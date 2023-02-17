import {type Request, type Response, Router} from 'express';
import {findUserPass} from '../../utils/db/findUserPass';
import error from '../../assets/constants/errors.json';
const router = Router();
import bcrypt from 'bcrypt';
import {validateRequestSchema} from '../../middleware/validateReqSchema';
import {loginSchema} from '../../utils/json-validator/routes/LoginSchema';
router.get('/login', (req: Request, res: Response) => {
	if (req.session.authorized) {
		return res.status(200).send();
	}

	return res.status(401).send();
});
router.post('/login', loginSchema, validateRequestSchema, async (req: Request, res: Response) => {
	await findUserPass(req.body.email)
		.then((response: string) => {
			bcrypt.compare(req.body.password, response)
				.then((result: boolean) => {
					if (result) {
						req.session.email = req.body.email;
						req.session.authorized = true;
						return res.status(201).send('');
					}

					return res.status(401).json({message: error.invalid_password});
				})
				.catch(() => res.status(498).json({message: error.invalid_token}));
		})
		.catch(() => res.status(401).json({message: error.user_not_found}));
});

export default router;
