import {getDatabaseConnector as db} from './db-injector';

export const getLanguageCulture = async (email: string): Promise<string> => (
	await db()
		.from('user')
		.join('language', {'language.id': 'user.language_id'})
		.select('language.culture')
		.where({'user.email': email}))[0].culture;

