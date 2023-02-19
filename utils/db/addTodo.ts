import {getDatabaseConnector as db} from './db-injector';
export const addTodo = async (userId: number, title: string, description: string | undefined, priorityId: number, categoryId: number | undefined) => {
	await db()('todo')
		.insert({user_id: userId, title, description, priority_id: priorityId, category_id: categoryId});
};
