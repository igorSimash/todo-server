import {passwordSchema} from '../PasswordValidator';
import {emailSchema} from '../EmailValidator';

export const forgotPassFinalSchema = [passwordSchema, emailSchema];
