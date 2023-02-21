import {getDatabaseConnector as db} from '../db-injector';
import {getUserId} from '../user/getUserId';

export const addCategory = async (email: string, name: string) => {
	await db()
		.insert({name, user_id: await getUserId(email)})
		.into('category');
};
