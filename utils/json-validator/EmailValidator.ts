import {body} from 'express-validator';
import errors from '../../assets/constants/errors.json';

export const emailSchema
	= body('email')
		.isEmail()
		.withMessage(errors.invalid_email);
