import {body} from 'express-validator';
import errors from '../../assets/constants/errors.json';

export const passwordSchema
	= body('password')
		.isLength({min: 8})
		.withMessage(errors.weak_password)
		.custom(value => {
			if (/[\u0400-\u04FF]/.test(value)) {
				throw new Error(errors.cyrillic_used);
			}

			return true;
		})
		.withMessage(errors.cyrillic_used)
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]/)
		.withMessage(errors.weak_password);

export const changePassSchema
	= body('newPassword')
		.isLength({min: 8})
		.withMessage(errors.weak_password)
		.custom(value => {
			if (/[\u0400-\u04FF]/.test(value)) {
				throw new Error(errors.cyrillic_used);
			}

			return true;
		})
		.withMessage(errors.cyrillic_used)
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]/)
		.withMessage(errors.weak_password);
