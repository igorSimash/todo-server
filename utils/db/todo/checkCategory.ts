import {getDatabaseConnector as db} from '../db-injector';
import {getUserId} from '../user/getUserId';

export const checkCategory = async (email: string, name: string): Promise<number | undefined> => (await db()('category')
	.select('id')
	.where({user_id: await getUserId(email), name}))[0]?.id;
