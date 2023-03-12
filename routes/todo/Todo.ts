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
import {updateCompletedStatus} from '../../utils/db/todo/updateCompletedStatus';
import {getUserCategories} from '../../utils/db/todo/getUserCategories';
import {deleteAllCategoryTodos} from '../../utils/db/todo/deleteAllCategoryTodos';
import {deleteCategory} from '../../utils/db/todo/deleteCategory';

router.get('/todo', async (req: Request, res: Response) => {
	try {
		console.log(req.session);
		if (!req.session.authorized) {
			return res.status(440).json({message: error.session_expired});
		}

		const culture = await getLanguageCulture(req.session.email);
		return res.status(200).json({language: culture, todos: await getUserTodos(req.session.email), categories: await getUserCategories(req.session.email)});
	} catch (err) {
		console.error(err);
	}
});

router.post('/todo', async (req: Request, res: Response) => {
	try {
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
	} catch (err) {
		console.error(err);
	}
});

router.delete('/todo', async (req: Request, res: Response) => {
	try {
		if (!req.session.authorized) {
			return res.status(440).json({message: error.session_expired});
		}

		await deleteTodo(req.body.id);
		res.status(200).send();
	} catch (err) {
		console.error(err);
	}
});

router.put('/todo', async (req: Request, res: Response) => {
	try {
		const {
			id,
			title,
			description,
			priorityId,
			category,
			deadline,
		}: {id: number; title: string; description: string; priorityId: number; category: string; deadline: string} = req.body;
		console.log(priorityId);
		const categoryId = category?.trim() === '' ? undefined : await getTodoCategoryId(req.session.email, category);
		const descriptionResult = description?.trim() === '' ? undefined : description;
		const deadlineResult = deadline?.trim() === '' ? undefined : deadline.trim().replace('T', ' ') + ':00';
		await updateTodo(id, {title, description: descriptionResult, priorityId, categoryId, deadline: deadlineResult});
		res.status(200).send();
	} catch (err) {
		console.error(err);
	}
});

router.put('/todo/complete', async (req: Request, res: Response) => {
	try {
		if (!req.session.authorized) {
			return res.status(440).json({message: error.session_expired});
		}

		await updateCompletedStatus(req.body.id);
		res.status(200).send();
	} catch (err) {
		console.error(err);
	}
});

router.delete('/todo/category', async (req: Request, res: Response) => {
	try {
		if (!req.session.authorized) {
			return res.status(440).json({message: error.session_expired});
		}

		const {category}: {category: string} = req.body;
		const categoryId = await getTodoCategoryId(req.session.email, category);
		await deleteAllCategoryTodos(categoryId);
		await deleteCategory(categoryId);
		res.status(200).send();
	} catch (err) {
		console.error(err);
	}
});

export default router;
