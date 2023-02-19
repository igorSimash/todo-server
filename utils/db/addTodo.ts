import {getDatabaseConnector as db} from './db-injector';

type IAddTodo = {
	userId: number;
	title: string;
	description: string | undefined;
	priorityId: number;
	categoryId: number | undefined;
};

export const addTodo = async (userId: number, title: string, description: string | undefined, priorityId: number, categoryId: number | undefined) => {
	await db()('todo')
		.insert({user_id: userId, title, description, priority_id: priorityId, category_id: categoryId});
};
