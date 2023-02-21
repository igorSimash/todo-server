import {getDatabaseConnector as db} from '../db-injector';

export const getUserId = async (email: string): Promise<number> =>
	(await db()
		.from('user')
		.select('id')
		.where({email}))[0]?.id;
