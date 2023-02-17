import {emailSchema} from '../EmailValidator';
import {passwordSchema} from '../PasswordValidator';

export const loginSchema = [emailSchema, passwordSchema];
