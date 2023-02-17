import {type Response, type Request, Router} from 'express';
import {passwordSchema} from '../../utils/json-validator/PasswordValidator';
const router = Router();

router.post('/change-pass', passwordSchema, (req: Request, res: Response) => {

});

export default router;
