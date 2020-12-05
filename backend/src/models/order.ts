import { Schema, model, Document } from 'mongoose'

const ProductOrderSchema = new Schema({
    quantity: { type: Number, required: true },
	product: { type: Schema.Types.ObjectId, ref: "Product", required: true }
})

const schema = new Schema({
	costumer: { type: Schema.Types.ObjectId, ref: "Costumer", required: true },
	address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
	products: { type: [ ProductOrderSchema ] },
	payment_method: { type: Number, enum: [0, 2], default: 0, required: true},
	status: { type: Number, enum: [0, 4], default: 0, required: true },
	total: { type: Number, required: true }
}, { timestamps: true })

export interface Order {
	costumer: string
	address: string
	products: Array<object>
	payment_method: PaymentMethod
	status: Status
	total: Number
}

enum Status {
	Open = 0,
	Pending = 1,
	WaitingShipping = 2,
	WaitingDelivery = 3,
	Delivered = 4
}

enum PaymentMethod {
	CreditCard = 0,
	DebitCard = 1,
	Money = 2
}

export interface OrderModel extends Order, Document { }

export const OrderModel = model<OrderModel>('Order', schema)

export const list = (limit: number = 100) => {
	return OrderModel.find().limit(limit)
}

export const getById = (id: string) => {
	return OrderModel.findOne({ _id: id })
}

export const getByName = (term: string) => {
	return OrderModel.findOne({term})
}

export const add = (data: any) => {
	const rec = OrderModel.create(data)

	return rec
}

export const update = (id: string, data: any) => {
	const rec = OrderModel.findByIdAndUpdate(id, data)

	return rec
}

export const remove = (id: string) => {
	return OrderModel.findByIdAndRemove(id)
}