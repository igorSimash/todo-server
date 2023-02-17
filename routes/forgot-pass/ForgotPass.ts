import {sendEmail} from '../../utils/email/sendEmail';
import {type Response, type Request, Router} from 'express';
const router = Router();
import jwt from 'jsonwebtoken';
import {userCheck} from '../../utils/db/userCheck';
import error from '../../assets/constants/errors.json';
import {isValidPassword} from '../../utils/isValidPassword';
import {userChangePass} from '../../utils/db/userChangePass';
import bcrypt from 'bcrypt';
import {deleteAllSessions} from '../../utils/db/deleteAllSessions';
import {validateRequestSchema} from '../../middleware/validateReqSchema';
import {regStartSchema} from '../../utils/json-validator/routes/RegStartSchema';
import {regFinalSchema} from '../../utils/json-validator/routes/RegFinalSchema'; '';
const secret = process.env.SMTPSALT!;

router.post('/forgot-pass', regStartSchema, validateRequestSchema, async (req: Request, res: Response) => {
	try {
		if ((await userCheck(req.body.email)).length === 0) {
			return res.status(404).json({message: error.user_not_found});
		}

		const jwtToken = jwt.sign({email: req.body.email, language: req.body.language}, secret, {expiresIn: '5m'});
		const emailUrl = new URL(req.protocol + '://' + req.get('host') + `/api/forgot-pass/${jwtToken}`);
		emailUrl.searchParams.append('email', req.body.email);
		try {
			await req.i18n.changeLanguage(req.body.language);
			await sendEmail(req.body.email, req.t('forgotPass', {ns: 'mailSubject'}), req.t('forgotPass', {ns: 'mailText'}), emailUrl);
			console.log('Email sent');
			return res.status(200).send();
		} catch (err) {
			return res.status(502).json({message: error.send_email_fail});
		}
	} catch (err) {
		console.log(err);
	}
});

router.get('/forgot-pass/:token', (req: Request, res: Response) => {
	try {
		jwt.verify(req.params.token, secret, (err: any, decoded: any) => {
			if (err) {
				if (err.message === 'jwt expired') {
					const URLExpired = new URL(process.env.CLIENT_FORGOT_PASS_410!);
					URLExpired.searchParams.append('email', req.query.email as string);
					res.redirect(URLExpired.href);
					return;
				}

				return res.status(498).json({message: error.invalid_token});
			}

			const URLForgPassFinal = new URL(process.env.CLIENT_FORGOT_PASS_FINAL! + req.params.token);
			URLForgPassFinal.searchParams.append('language', decoded.language);
			URLForgPassFinal.searchParams.append('email', decoded.email);
			res.redirect(URLForgPassFinal.href);
		});
	} catch (err) {
		console.log(err);
	}
});

router.post('/forgot-pass-final', regFinalSchema, validateRequestSchema, (req: Request, res: Response) => {
	jwt.verify(req.body.token, secret, async (err: any, decoded: any) => {
		if (err) {
			if (err.message === 'jwt expired') {
				return res.status(410).json({message: error.link_expired});
			}

			return res.status(498).json({message: error.invalid_token});
		}

		if (decoded.email !== req.body.email) {
			return res.status(400).json({message: error.invalid_email});
		}

		bcrypt.hash(req.body.password, 12)
			.then(async (hash: string) => {
				await userChangePass(req.body.email, hash);
				await deleteAllSessions(req.body.email);
			});
		return res.status(200).send();
	});
});

export default router;
