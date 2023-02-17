import {type Response, type Request, Router} from 'express';
import {changePassSchema, passwordSchema} from '../../utils/json-validator/PasswordValidator';
import {validateRequestSchema} from '../../middleware/validateReqSchema';
import {findUserPass} from '../../utils/db/findUserPass';
import bcrypt from 'bcrypt';
import errors from '../../assets/constants/errors.json';
import {userChangePass} from '../../utils/db/userChangePass';
import {deleteAllSessions} from '../../utils/db/deleteAllSessions';
const router = Router();

router.post('/change-pass', changePassSchema, validateRequestSchema, async (req: Request, res: Response) => {
	if (req.body.oldPassword === req.body.newPassword) {
		return res.status(403).json({message: errors.passwords_same});
	}

	const {email} = req.session;
	await findUserPass(email)
		.then((response: string) => {
			bcrypt.compare(req.body.oldPassword, response)
				.then((result: boolean) => {
					if (result) {
						bcrypt.hash(req.body.newPassword, 12)
							.then(async (hash: string) => {
								await userChangePass(email, hash);
								await deleteAllSessions(email);
							});
					}
				});
		});
	return res.status(200).send();
});

export default router;
