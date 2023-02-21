import {sendEmail} from '../../utils/email/sendEmail';
import {type Request, type Response, Router} from 'express';
const router = Router();
import {getUserId} from '../../utils/db/user/getUserId';
import jwt from 'jsonwebtoken';
import {addUser} from '../../utils/db/user/addUser';
import {getLanguageId} from '../../utils/db/user/getLanguageId';
import error from '../../assets/constants/errors.json';
import bcrypt from 'bcrypt';
import {validateRequestSchema} from '../../middleware/validateReqSchema';
import {validator} from '../../utils/json-validator/Validator';
const secret = process.env.SMTPSALT!;

router.post('/registration', validator, validateRequestSchema, async (req: Request, res: Response) => {
	try {
		if (!await getUserId(req.body.email)) {
			return res.status(409).json({message: error.email_already_registered});
		}

		const jwtToken = jwt.sign({email: req.body.email, language: req.body.language}, secret, {expiresIn: '5m'});

		const emailUrl = new URL(req.protocol + '://' + req.get('host') + `/api/registration/${jwtToken}`);
		emailUrl.searchParams.append('email', req.body.email);

		try {
			await req.i18n.changeLanguage(req.body.language);
			await sendEmail(req.body.email, req.t('registration', {ns: 'mailSubject'}), req.t('registration', {ns: 'mailText'}), emailUrl);
			console.log('Email sent');
			return res.status(200).send();
		} catch (err) {
			console.log(err);
			return res.status(502).json({message: error.email_already_registered});
		}
	} catch (err) {
		console.error(err);
	}
});

router.get('/registration/:token', (req: Request, res: Response) => {
	try {
		jwt.verify(req.params.token, secret, (err: any, decoded: any) => {
			if (err) {
				if (err.message === 'jwt expired') {
					const URLExpired = new URL(process.env.CLIENT_REG_START_410!);
					URLExpired.searchParams.append('email', req.query.email as string);
					res.redirect(URLExpired.href);
					return;
				}

				return res.status(498).json({message: error.invalid_token});
			}

			const URLRegFinal = new URL(process.env.CLIENT_REG_FINAL! + req.params.token);
			URLRegFinal.searchParams.append('language', decoded.language);
			URLRegFinal.searchParams.append('email', decoded.email);
			res.redirect(URLRegFinal.href);
		});
	} catch (err) {
		console.error(err);
	}
});

router.post('/registration-final', validator, validateRequestSchema, async (req: Request, res: Response) => {
	if (await getUserId(req.body.email)) {
		return res.status(409).json({message: error.email_already_registered});
	}

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
				await addUser(req.body.email, hash, await getLanguageId(req.body.language));
			});
		return res.status(200).send();
	});
});

export default router;
