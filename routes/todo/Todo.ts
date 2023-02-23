import {type Request, type Response} from 'express';
import {Router} from 'express';
const router = Router();
import {getLanguageCulture} from '../../utils/db/user/getLanguageCulture';
import error from '../../assets/constants/errors.json';
import {getUserId} from '../../utils/db/user/getUserId';
import {getTodoCategoryId} from '../../utils/db/todo/getTodoCategoryId';
import {addTodo} from '../../utils/db/todo/addTodo';
import {getUserTodos} from '../../utils/db/todo/getUserTodos';
import {deleteTodo} from '../../utils/db/todo/deleteTodo';
import {updateTodo} from '../../utils/db/todo/updateTodo';
import {completeTodo} from '../../utils/db/todo/completeTodo';

router.get('/todo', async (req: Request, res: Response) => {
	try {
		if (!req.session.authorized) {
			res.status(440).json({message: error.session_expired});
		} else {
			const culture = await getLanguageCulture(req.session.email);
			res.status(200).json({language: culture, todos: await getUserTodos(req.session.email)});
		}
	} catch (err) {
		console.error(err);
	}
});

router.post('/todo', async (req: Request, res: Response) => {
	const userId = await getUserId(req.session.email);
	const {
		title,
		description,
		priorityId,
		category,
		deadline,
	}: {title: string; description: string; priorityId: number; category: string; deadline: string} = req.body;
	const categoryId = category.trim() === '' ? undefined : await getTodoCategoryId(req.session.email, category);
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
	const categoryId = category.trim() === '' ? undefined : await getTodoCategoryId(req.session.email, category);
	const descriptionResult = description.trim() === '' ? undefined : description;
	const deadlineResult = deadline.trim() === '' ? undefined : deadline.trim().replace('T', ' ') + ':00';
	await updateTodo(id, {title, description: descriptionResult, priorityId, categoryId, deadline: deadlineResult});
	res.status(200).send();
});

router.put('/todo/complete', async (req: Request, res: Response) => {
	await completeTodo(req.body.id);
	res.send();
});

export default router;
