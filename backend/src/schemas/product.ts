import {
	GraphQLFloat,
	GraphQLObjectType,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLID
} from 'graphql'

import { list, getByName, getById, add, update, remove } from '../models/product'

const productType = new GraphQLObjectType({
	name: 'Product',
	description: 'Product specification',
	fields: () => ({
		id: {
			type: GraphQLID,
			description: 'The guid of the user',
		},
		title: { 
			type: GraphQLString, 
			description: "Name of the product" 
		},
		description: { 
			type: GraphQLString, 
			description: "Description of the product" 
		},
		image: { 
			type: GraphQLString, 
			description: "Image of the product" 
		},
		price: { 
			type: GraphQLFloat, 
			description: "Price of the product" 
		},
		stock: { 
			type: GraphQLInt, 
			description: "Quantity in stock of the product" 
		}
	}),
})

const query = {
	products: {
		type: new GraphQLList(productType),
		args: {
			limit: {
				description: 'limit items in the results',
				type: GraphQLInt
			}
		},
		resolve: (root: any, { limit }: any) => list(limit)
	},
	productByName: {
		type: productType,
		args: {
			title: {
				description: 'find by name of the product',
				type: GraphQLString
			}
		},
		resolve: (root: any, { title }: any) => getByName(title)
	},
	productById: {
		type: productType,
		args: {
			id: {
				description: 'find by id of the product',
				type: GraphQLString
			}
		},
		resolve: (root: any, { id }: any) => getById(id)
	}
}

const mutation = {
	addProduct: {
		type: productType,
		args: {
			title: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			description: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			image: {
                type: GraphQLNonNull(GraphQLString),
            },
			price: { 
				type: new GraphQLNonNull(GraphQLFloat)
			},
			stock: { 
				type: new GraphQLNonNull(GraphQLInt)
			}
		},
		resolve: async (obj: any, input: any) => add(input)
	},
	updateProduct: {
		type: productType,
		args: {
			id: { 
				type: new GraphQLNonNull(GraphQLID)
			},
			title: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			description: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			image: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			price: { 
				type: new GraphQLNonNull(GraphQLFloat)
			},
			stock: { 
				type: new GraphQLNonNull(GraphQLInt)
			}
		},
		resolve: (obj: any, input: any) => update(input.id, input)
	},
	removeProduct: {
		type: productType,
		args: {
			id: { 
				type: new GraphQLNonNull(GraphQLID)
			}
		},
		resolve: (obj: any, input: any) => remove(input)
	}
}

const subscription = {

}

export default {
	query,
	mutation,
	subscription,
	type: productType
}