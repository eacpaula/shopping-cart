import { Schema, model, Document } from 'mongoose'

export interface Costumer {
	user: string
	fullname: string
	email: string
	age: number,
	addresses: [{
		type: String,
	}],
}

export interface CostumerModel extends Costumer, Document { }

const schema = new Schema({
	user:{ type: Schema.Types.ObjectId, ref: "User", required: true },
	fullname: { type: String, required: true },
	age: { type: String, required: true, index: { unique: true } },
	addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
}, { timestamps: true })

export const CostumerModel = model<CostumerModel>('Costumer', schema)

export const list = (limit: number = 100) => {
	return CostumerModel.find().limit(limit)
}

export const getById = (id: string) => {
	return CostumerModel.findOne({ _id: id })
}

export const getByName = (term: string) => {
	return CostumerModel.findOne({term})
}

export const add = (data: any) => {
	const rec = CostumerModel.create(data)

	return rec
}

export const update = (id: string, data: any) => {
	const rec = CostumerModel.findByIdAndUpdate(id, data)

	return rec
}

export const remove = (id: string) => {
	return CostumerModel.findByIdAndRemove(id)
}