import {type Request, type Response} from 'express';

import {Router} from 'express';
const router = Router();
import {getLanguageCulture} from '../../utils/db/getLanguageCulture';
import error from '../../assets/constants/errors.json';

router.get('/todo', async (req: Request, res: Response) => {
	try {
		if (req.session.authorized) {
			await getLanguageCulture(req.session.email)
				.then((response: string) => {
					res.status(200).json({language: response});
				});
		} else {
			res.status(440).json({message: error.session_expired});
		}
	} catch (err) {
		console.error(err);
	}
});

export default router;
