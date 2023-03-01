import {getDatabaseConnector as db} from '../db-injector';

export const getTodoIsCompleted = async (id: number): Promise<boolean> =>
	Boolean((await db()('todo')
		.select('completed')
		.where({id}))[0].completed);
