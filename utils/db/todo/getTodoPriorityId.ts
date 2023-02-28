import {getDatabaseConnector as db} from '../db-injector';

export const getTodoPriorityId = async (priority: string): Promise<number> =>
	(await db()('priority')
		.select('id')
		.where({name: priority}))[0].id;
