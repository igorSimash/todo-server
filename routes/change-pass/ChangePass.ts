import {type Response, type Request, Router} from 'express';
import {validateRequestSchema} from '../../middleware/validateReqSchema';
import {findUserPass} from '../../utils/db/user/findUserPass';
import bcrypt from 'bcrypt';
import errors from '../../assets/constants/errors.json';
import {userChangePass} from '../../utils/db/user/userChangePass';
import {deleteAllSessions} from '../../utils/db/user/deleteAllSessions';
import {validator} from '../../utils/json-validator/Validator';
import error from '../../assets/constants/errors.json';
const router = Router();

router.post('/change-pass', validator, validateRequestSchema, async (req: Request, res: Response) => {
	if (req.body.oldPassword === req.body.newPassword) {
		return res.status(403).json({message: errors.passwords_same});
	}

	const {email} = req.session;
	await findUserPass(email)
		.then(async (response: string) => {
			await bcrypt.compare(req.body.oldPassword, response)
				.then(async (result: boolean) => {
					if (result) {
						await bcrypt.hash(req.body.newPassword, 12)
							.then(async (hash: string) => {
								await userChangePass(email, hash);
								await deleteAllSessions(email);
								return res.status(200).send();
							});
					} else {
						return res.status(401).json({message: error.invalid_password});
					}
				});
		});
});

export default router;
