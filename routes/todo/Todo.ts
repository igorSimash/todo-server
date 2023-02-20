import {type Request, type Response} from 'express';
import {Router} from 'express';

const router = Router();
import {getLanguageCulture} from '../../utils/db/getLanguageCulture';
import error from '../../assets/constants/errors.json';
import {getUserId} from '../../utils/db/getUserId';
import {getTodoCategoryId} from '../../utils/db/getTodoCategoryId';
import {addTodo} from '../../utils/db/addTodo';
import {getUserTodos} from '../../utils/db/getUserTodos';
import {deleteTodo} from '../../utils/db/deleteTodo';
import {updateTodo} from '../../utils/db/updateTodo';

router.get('/todo', async (req: Request, res: Response) => {
	try {
		// If (!req.session.authorized) {
		// 	res.status(440).json({message: error.session_expired});
		// }

		const culture = await getLanguageCulture('vigorochok@gmail.com');
		res.status(200).json({language: culture, todos: await getUserTodos('vigorochok@gmail.com')});
	} catch (err) {
		console.error(err);
	}
});

router.post('/todo', async (req: Request, res: Response) => {
	const userId = await getUserId('vigorochok@gmail.com');
	const {
		title,
		description,
		priorityId,
		category,
		deadline,
	}: {title: string; description: string; priorityId: number; category: string; deadline: string} = req.body;
	const categoryId = category.trim() === '' ? undefined : await getTodoCategoryId('vigorochok@gmail.com', category);
	const descriptionResult = description.trim() === '' ? undefined : description;
	const deadlineResult = deadline.trim() === '' ? undefined : deadline.replace('T', ' ') + ':00';
	await addTodo({userId, title, description: descriptionResult, priorityId, categoryId, deadline: deadlineResult});
	return res.send();
});

router.delete('/todo', async (req: Request, res: Response) => {
	await deleteTodo(req.body.todoId);
	res.status(200).send();
});

router.put('/todo', async (req: Request, res: Response) => {
	const {
		id,
		title,
		description,
		priorityId,
		category,
		deadline,
	}: {id: number; title: string; description: string; priorityId: number; category: string; deadline: string} = req.body;
	const categoryId = category.trim() === '' ? undefined : await getTodoCategoryId('vigorochok@gmail.com', category);
	const descriptionResult = description.trim() === '' ? undefined : description;
	const deadlineResult = deadline.trim() === '' ? undefined : deadline.trim().replace('T', ' ') + ':00';
	await updateTodo(id, {title, description: descriptionResult, priorityId, categoryId, deadline: deadlineResult});
	res.status(200).send();
});

export default router;
