import {checkCategory} from './checkCategory';
import {addCategory} from './addCategory';

export const getTodoCategoryId = async (email: string, name: string): Promise<number> => {
	const category = await checkCategory(email, name);
	if (category) {
		return category;
	}

	await addCategory(email, name);
	return getTodoCategoryId(email, name);
};
