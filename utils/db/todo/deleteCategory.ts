import {getDatabaseConnector as db} from '../db-injector';

export const deleteCategory = async (id: number) =>
	db()('category')
		.where({id})
		.del();
