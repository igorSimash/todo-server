import {type Request, type Response, Router} from 'express';
import jwt, {JwtPayload, type VerifyErrors} from 'jsonwebtoken';
import {findUserPass} from '../../utils/db/findUserPass';
import error from '../../assets/constants/errors.json';
const router = Router();
const secret = process.env.SMTPSALT!;

router.get('/login', (req: Request, res: Response) => {
	if (req.session.authorized) {
		return res.status(200).send();
	}

	return res.status(204).send();
});

router.post('/login', async (req: Request, res: Response) => {
	await findUserPass(req.body.email)
		.then((response: string) => {
			jwt.verify(response, secret, async (err: any, decoded: any) => {
				if (err) {
					return res.status(498).json({message: error.invalid_token});
				}

				if (decoded.password === req.body.password) {
					req.session.email = req.body.email;
					req.session.authorized = true;
					return res.status(201).send('');
				}

				return res.status(401).json({message: error.invalid_password});
			});
		})
		.catch(() => res.status(401).json({message: error.user_not_found}));
});

export default router;
