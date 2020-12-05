export default class HttpException extends Error {
	success: boolean
	message: string
	data: object

	constructor(success: boolean, message: string, data: object) {
		super(message)
		this.success = success
		this.message = message
		this.data = data
	}
}