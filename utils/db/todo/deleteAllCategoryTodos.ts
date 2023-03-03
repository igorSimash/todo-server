import {getDatabaseConnector as db} from '../db-injector';

export const deleteAllCategoryTodos = async (categoryId: number) =>
	db()('todo')
		.where({category_id: categoryId})
		.del();
