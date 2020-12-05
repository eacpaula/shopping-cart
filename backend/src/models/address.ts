import { Schema, model, Document } from 'mongoose'

export interface Address {
	street: string
	neighborhood: string
	zipcode: string
	city: string
	state: string
}

export interface AddressModel extends Address, Document { }

const schema = new Schema({
	street: { type: String, required: true },
	neighborhood: { type: String, required: true },
	zipcode: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true }
}, { timestamps: true })

export const AddressModel = model<AddressModel>('Address', schema)

export const list = (limit: number = 100) => {
	return AddressModel.find().limit(limit)
}

export const getById = (id: string) => {
	return AddressModel.findOne({ _id: id })
}

export const getByName = (term: string) => {
	return AddressModel.findOne({term})
}

export const add = (data: any) => {
	const rec = AddressModel.create(data)

	return rec
}

export const update = (id: string, data: any) => {
	const rec = AddressModel.findByIdAndUpdate(id, data)

	return rec
}

export const remove = (data: any) => {
	return AddressModel.findByIdAndRemove(data.id)
}