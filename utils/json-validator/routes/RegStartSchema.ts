import {emailSchema} from '../EmailValidator';
import {languageSchema} from '../LanguageValidator';

export const regStartSchema = [emailSchema, languageSchema];
