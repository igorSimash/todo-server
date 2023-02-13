import {getDatabaseConnector as db} from './db-injector';

export const userChangePass = async (email: string, password_hash: string): Promise<void> => {
	await db()('user')
		.where('email', '=', email)
		.update({password_hash});
};
