import {getDatabaseConnector as db} from '../db-injector';

export const getLanguageId = async (culture: string): Promise<number> =>
	(await db()('language')
		.select('id')
		.where({culture}))[0].id;
