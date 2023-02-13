import {getDatabaseConnector as db} from './db-injector';

export const addUser = async (email: string, passHash: string, languageId: number) => {
	await db()
		.insert({email, password_hash: passHash, language_id: languageId})
		.into('user');
};

