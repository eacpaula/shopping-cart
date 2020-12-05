import { Schema, model, Document, Types } from 'mongoose'
import * as bcrypt from 'bcrypt'

const BCRYPT_SALT = 10

const schema = new Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true }
}, { timestamps: true })

schema.pre('save', function (next) {
	const user: any = this

	if (!user.isModified('password')) {
		return next(null)
	}

	bcrypt.genSalt(BCRYPT_SALT, function (errorSalt, salt) {
		if (errorSalt) {
			return next(errorSalt)
		}

		bcrypt.hash(user.password, salt, function (errorHash, hash) {
			if (errorHash) {
				return next(errorHash)
			}

			user.password = hash
			next(null)
		})
	})
})

schema.methods.checkPassword = async (password: String) => {
	const self: any = this

	const isMatch = await bcrypt.compare(password, self.password)

	return isMatch
}

export interface User {
	username: string
	password: string
}

export interface UserModel extends User, Document {
	checkPassword(password: string): boolean
}

export const UserModel = model<UserModel>('User', schema)

export const list = (limit: number = 100) => {
	return UserModel.find().limit(limit)
}

export const getById = (id: string) => {
	return UserModel.findOne({ _id: id })
}

export const getByName = (term: string) => {
	return UserModel.findOne({term})
}

export const add = async (data: any) => {
	const rec = UserModel.create(data)

	return rec
}

export const update = (id: string, data: any) => {
	const rec = UserModel.findByIdAndUpdate(id, data)

	return rec
}

export const remove = (data:any) => {
	return UserModel.findByIdAndDelete(data.id)
}