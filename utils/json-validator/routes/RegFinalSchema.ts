import {languageSchema} from '../LanguageValidator';
import {passwordSchema} from '../PasswordValidator';
import {emailSchema} from '../EmailValidator';

export const regFinalSchema = [languageSchema, passwordSchema, emailSchema];
