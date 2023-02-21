import {getDatabaseConnector as db} from '../db-injector';

export const completeTodo = async (id: number) => {
	await db()('todo')
		.where({id})
		.update({completed: 1});
};
