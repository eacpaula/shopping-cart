import { NextFunction, Request, Response } from 'express'
import HttpException from '../exceptions/error.middleware'

export default (error: HttpException, req: Request, res: Response, next: NextFunction) => {
	const success = false
	const message = error.message || 'Something went wrong'
	const data = error.stack

	res
		.status(req.statusCode || 500)
		.send({
			success,
			message,
			data
		})
}
