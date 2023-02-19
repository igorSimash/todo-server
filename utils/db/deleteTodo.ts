import {getDatabaseConnector as db} from './db-injector';

export const deleteTodo = async (id: number) =>
	db()('todo')
		.where({id})
		.del();
