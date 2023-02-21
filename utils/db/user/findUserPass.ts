import {getDatabaseConnector as db} from '../db-injector';

export const findUserPass = async (email: string): Promise<string> =>
	(await db()
		.from('user')
		.select('password_hash')
		.where({email}))[0].password_hash;
