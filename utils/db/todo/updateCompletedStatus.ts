import {getDatabaseConnector as db} from '../db-injector';
import {getTodoIsCompleted} from './getTodoIsCompleted';

export const updateCompletedStatus = async (id: number) => {
	await db()('todo')
		.where({id})
		.update({completed: Number(!await getTodoIsCompleted(id))});
};
