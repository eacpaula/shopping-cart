import {
	GraphQLFloat,
	GraphQLInputObjectType,
	GraphQLObjectType,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLEnumType,
	GraphQLID
} from 'graphql'

import { list, getByName, add, update, remove } from '../models/order'
import * as ProductModel from '../models/product'

import CostumerSchema from './costumer'
import AddressSchema from './address'
import ProductSchema from './product'

const customProductType = new GraphQLObjectType({
	name: 'PurchasedProductType',
	description: 'Purchased Product information',
	fields: () => ({
		quantity: {
			type: GraphQLInt,
			description: "Quantity of the purchased product of the order" 
		},
		product: { 
			type: ProductSchema.type,
			description: "Purchased product of the order" 
		}
	})
})

const PaymentMethods = new GraphQLEnumType({
	name: 'PaymentMethods',
	values: {
		CreditCard: { value: 0 },
		DebitCard: { value: 1 },
		Money: { value: 2 }
	}
})

const Status = new GraphQLEnumType({
	name: 'Status',
	values: {
		Open: { value: 0 },
		Pending: { value: 1 },
		WaitingShipping: { value: 2 },
		WaitingDelivery: { value: 3 },
		Delivered: { value: 4 }
	}
})

const orderType = new GraphQLObjectType({
	name: 'Order',
	description: 'Order specification',
	fields: () => ({
		id: {
			type: GraphQLID,
			description: 'The guid of the user',
		},
		costumer: { 
			type: CostumerSchema.type, 
			description: "Costumer of the order"
		},
		address: { 
			type: AddressSchema.type, 
			description: "Address of the costumer"
		},
		products: {
			type: new GraphQLList(customProductType),
			description: "Products of the order"
		},
		payment_method: {
			type: PaymentMethods,
			description: "Payment method" 
		},
		payment_creditcard: {
			type: GraphQLString,
			description: "Total cost of the order" 
		},
		payment_creditcard_expire: {
			type: GraphQLString,
			description: "Total cost of the order" 
		},
		payment_creditcard_secret: {
			type: GraphQLString,
			description: "Total cost of the order" 
		},
		payment_creditcard_fullname: {
			type: GraphQLString,
			description: "Total cost of the order" 
		},
		payment_creditcard_documentation: {
			type: GraphQLString,
			description: "Total cost of the order" 
		},
		status: { 
			type: Status,
			description: "Status of the order" 
		},
		total: {
			type: GraphQLFloat,
			description: "Total cost of the order" 
		}
	}),
})

const query = {
	orders: {
		type: new GraphQLList(orderType),
		args: {
			limit: {
				description: 'limit items in the results',
				type: GraphQLInt
			}
		},
		resolve: (root: any, { limit }: any) => list(limit)
	},
	orderById: {
		type: orderType,
		args: {
			id: {
				description: 'find by id of the order',
				type: GraphQLString
			}
		},
		resolve: (root: any, { id }: any) => getByName(id)
	}
}

const customProductInputType = new GraphQLInputObjectType({
	name: 'PurchasedProductInput',	
	fields: () => ({
		quantity: { type: new GraphQLNonNull(GraphQLInt) },
		product: { type: new GraphQLNonNull(GraphQLID) }
	})
}) 

const mutation = {
	addOrder: {
		type: orderType,
		args: {
			costumer: { 
				type: GraphQLID
			},
			address: { 
				type: GraphQLID
			},
			products: {
				type: new GraphQLList(customProductInputType)
			},
			payment_method: {
				type: new GraphQLNonNull(PaymentMethods) 
			},
			payment_creditcard: {
				type: new GraphQLNonNull(GraphQLString),
			},
			payment_creditcard_expire: {
				type: new GraphQLNonNull(GraphQLString),
			},
			payment_creditcard_secret: {
				type: new GraphQLNonNull(GraphQLString),
			},
			payment_creditcard_fullname: {
				type: new GraphQLNonNull(GraphQLString),
			},
			payment_creditcard_documentation: {
				type: new GraphQLNonNull(GraphQLString),
			},
			status: { 
				type: new GraphQLNonNull(Status) 
			},
			total: {
				type: new GraphQLNonNull(GraphQLFloat) 
			}
		},
		resolve: async (obj: any, input: any) => { 
			if(input.payment_creditcard !== '5136 3333 3333 3335')
				throw new Error("Este cartão de crédito não é valido para esta operação!")

			for (const item of input.products) {
				let product = await ProductModel.getById(item.product) as any
				product.stock = product.stock - item.quantity

				await ProductModel.update(item.product, product)
			}

			const result = await add(input)
			return result
		}
	}
}

const subscription = {

}

export default {
	query,
	mutation,
	subscription,
	types: [orderType, PaymentMethods, Status, customProductType]
}