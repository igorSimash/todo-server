import {getDatabaseConnector as db} from './db-injector';
import {getUserId} from './getUserId';

export const getUserTodos = async (email: string): Promise<Array<Record<string, unknown>>> =>
	db()
		.from('todo')
		.select('*')
		.where({user_id: await getUserId(email)});
