import {getDatabaseConnector as db} from './db-injector';

type TodoColumns = {
	title: string;
	description: string | undefined;
	priorityId: number;
	categoryId: number | undefined;
};
export const updateTodo = async (id: number, {title, description, priorityId, categoryId}: TodoColumns) =>
	db()('todo')
		.where({id})
		.update({title, description, priority_id: priorityId, category_id: categoryId});
