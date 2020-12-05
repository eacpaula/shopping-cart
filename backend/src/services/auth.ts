import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"

import { update, getById, getByName, User, UserModel } from "../models/user"

export default class AuthService {
	static login = async (req: Request, res: Response) => {
		const SECRET = <string>process.env.API_SECRET
		const EXPIRATION = <string>process.env.API_TOKEN_EXPIRATION
		
		let { username, password } = req.body
		
		if (!(username && password)) res.status(400).send()
		
		const user = <UserModel> await getByName(username)
		
		if(!user) 
			throw new Error(`User or password is invalid!`)

		if (!await user.checkPassword(password))
			throw new Error('User password is not correct')

		const token = jwt.sign(
			{ 
				id: user.id, 
				username: user.username 
			},
			SECRET,
			{ 
				expiresIn: EXPIRATION 
			}
		)

		res.send(token)
	}

	static changePassword = async (req: Request, res: Response) => {
		const id = res.locals.jwtPayload.id

		const { oldPassword, newPassword } = req.body

		if (!(oldPassword && newPassword)) {
			throw new Error("The old password and new password isn't inputed")
		}

		const user = await getById(id)

		if(!user) 
			throw new Error(`User or password is invalid!`)

		if (!user.checkPassword(oldPassword))
			throw new Error(`User or password is invalid!`)

		user.password = newPassword
		
		await update(id, user)

		res.status(204).send()
	}
}