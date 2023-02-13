import {type Request, type Response, Router} from 'express';
const router = Router();

router.get('/logout', (req: Request, res: Response) => {
	if (req.session.authorized) {
		req.session.destroy(err => {
			console.error(err);
		});
		return res.status(200).send();
	}

	return res.status(204).send();
});

export default router;
