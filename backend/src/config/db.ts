import mongoose from 'mongoose'

(mongoose as any).Promise = global.Promise

export const connect = () => {
	const {
		MONGODB_HOSTNAME,
		MONGODB_PORT,
		MONGODB_DATABASE,
		MONGODB_USER,
		MONGODB_PASSWORD
	} = process.env

	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	}

	const url = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}:${MONGODB_PORT}/${MONGODB_DATABASE}`

	return mongoose.connect(url, options)
}

export const disconnect = (cb = () => { }) => {
	mongoose.disconnect(cb)
}

export const generateMongooseId = () => {
	return mongoose.Types.ObjectId()
}
