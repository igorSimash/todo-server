import {getDatabaseConnector as db} from '../db-injector';
import {getLanguageId} from './getLanguageId';

export const changeLanguage = async (email: string, language: string) => {
	await db()('user')
		.where({email})
		.update({language_id: await getLanguageId(language)});
};
