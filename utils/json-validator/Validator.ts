import {body} from 'express-validator';
import errors from '../../assets/constants/errors.json';

export const validator = [
	body('email')
		.optional({nullable: true})
    	.isEmail()
    	.withMessage(errors.invalid_email),
	body('language')
		.optional({nullable: true})
		.isIn(['en-US', 'uk-UA', 'pl-PL'])
		.withMessage(errors.invalid_language),
	body('password')
		.optional({nullable: true})
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
		.withMessage(errors.weak_password),
	body('newPassword')
		.optional({nullable: true})
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
		.withMessage(errors.weak_password),
];
