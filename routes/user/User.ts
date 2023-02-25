import {type Request, type Response} from 'express';
import {Router} from 'express';
import {changeLanguage} from '../../utils/db/user/changeLanguage';
import error from '../../assets/constants/errors.json';
const router = Router();

router.put('/user/language', async (req: Request, res: Response) => {
	try {
		if (req.session.authorized) {
			return res.status(440).json({message: error.session_expired});
		}

		await changeLanguage(req.session.email, req.body.language);
		return res.status(200).send();
	} catch (err) {
		console.log(err);
	}
});

export default router;
