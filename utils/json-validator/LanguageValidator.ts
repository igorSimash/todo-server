import {body} from 'express-validator';
import errors from '../../assets/constants/errors.json';

export const languageSchema
    = body('language')
    	.isIn(['en-US', 'uk-UA', 'pl-PL'])
    	.withMessage(errors.invalid_language);
