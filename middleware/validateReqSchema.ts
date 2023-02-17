import {type NextFunction, type Request, type Response} from 'express';
import {validationResult} from 'express-validator';

export function validateRequestSchema(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(400).json({message: errors.array()[0].msg});
	}

	next();
}
