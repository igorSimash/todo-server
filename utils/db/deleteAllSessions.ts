import {getDatabaseConnector as db} from './db-injector';

export const deleteAllSessions = async (email: string): Promise<void> => {
	await db()('session')
		.where('data', 'like', `%"email":"${email}"%`)
		.del();
};
