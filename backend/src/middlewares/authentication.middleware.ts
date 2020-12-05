import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"

export default (req: Request, res: Response, next: NextFunction) => {
	const SECRET = <string>process.env.API_SECRET
	const EXPIRATION = <string>process.env.API_TOKEN_EXPIRATION

	let token = <string>(req.headers['x-access-token'] || req.headers['authorization'])

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length)
    }

	let jwtPayload

	try {
		jwtPayload = <any>jwt.verify(token, SECRET)
		res.locals.jwtPayload = jwtPayload
	} catch (error) {
		res.status(401).send()
		return
	}

	const { id, username } = jwtPayload

	const newToken = jwt.sign({ id, username }, SECRET, {
		expiresIn: EXPIRATION
	})

	res.setHeader("token", newToken)

	next()
}