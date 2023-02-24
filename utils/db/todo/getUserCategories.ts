import {getDatabaseConnector as db} from '../db-injector';
import {getUserId} from '../user/getUserId';

export const getUserCategories = async (email: string) =>
	db()('category')
		.select('id', 'name')
		.where({user_id: await getUserId(email)});
