import {getDatabaseConnector as db} from '../db-injector';
import {getLanguageId} from './getLanguageId';

export const changeLanguage = async (email: string, language: string) => {
	db()('user')
		.where({email})
		.update({language: await getLanguageId(language)});
};
