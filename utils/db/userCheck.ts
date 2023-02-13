import {getDatabaseConnector as db} from './db-injector';

export const userCheck = async (email: string) =>
	db()
		.from('user')
		.select('id')
		.where({email});
