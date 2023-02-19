import {getDatabaseConnector as db} from './db-injector';
import {getUserId} from './getUserId';

export const getUserTodos = async (email: string) =>
	db()
		.from('todo')
		.select('*')
		.where({user_id: await getUserId(email)});
