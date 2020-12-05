import { Schema, model, Document } from 'mongoose'

// const imageSchema = new Schema({
// 	id: { type: String, required: true },
// 	path: { type: String, required: true },
//     filename: { type: String, required: true },
// 	mimetype: { type: String }
// })

const schema = new Schema({
	title: { type: String, required: true, index: { unique: true } },
	description: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, required: true }
}, { timestamps: true })

export interface Product {
	title: string
	description: string,
	image: string,
	price: number,
	stock: number
}

export interface ProductModel extends Product, Document {}

export const ProductModel = model<ProductModel>('Product', schema)

export const list = (limit: number = 100) => {
	return ProductModel.find().limit(limit)
}

export const getById = (id: string) => {
	return ProductModel.findOne({ _id: id })
}

export const getByName = (term: string) => {
	return ProductModel.findOne({term})
}

export const add = (data: any) => {
	const result = ProductModel.create(data)

	return result
}

export const update = (id: string, data: any) => {
	const result = ProductModel.findByIdAndUpdate(id, data)

	return result
}

export const remove = (id: string) => {
	return ProductModel.findByIdAndRemove(id)
}