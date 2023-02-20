import {getDatabaseConnector as db} from './db-injector';

type TodoOptions = {
	userId: number;
	title: string;
	description: string | undefined;
	priorityId: number;
	categoryId: number | undefined;
	deadline: string | undefined;
};
export const addTodo = async ({userId, title, description, priorityId, categoryId, deadline}: TodoOptions) => {
	await db()('todo')
		.insert({user_id: userId, title, description, priority_id: priorityId, category_id: categoryId, deadline});
};
