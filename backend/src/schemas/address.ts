import {
	GraphQLObjectType,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLID
} from 'graphql'

import { list, getByName, add, update, remove } from '../models/address'

const addressType = new GraphQLObjectType({
	name: 'Address',
	description: 'Address specification',
	fields: () => ({
		id: {
			type: GraphQLID,
			description: 'The guid of the user',
		},
		street: { 
			type: GraphQLString, 
			description: "Name of the street" 
		},
		neighborhood: {
			type: GraphQLString, 
			description: "Name of the neighborhood" 
		},
		zipcode: { 
			type: GraphQLString, 
			description: "Zipcode of the address" 
		},
		city: { 
			type: GraphQLString, 
			description: "Name of the city" 
		},
		state: { 
			type: GraphQLString, 
			description: "Name of the state" 
		}
	}),
})

const query = {
	addresses: {
		type: new GraphQLList(addressType),
		args: {
			limit: {
				description: 'limit items in the results',
				type: GraphQLInt
			}
		},
		resolve: (root: any, { limit }: any) => list(limit)
	},
	addressByStreetName: {
		type: addressType,
		args: {
			street: {
				description: 'find by street name of the address',
				type: GraphQLString
			}
		},
		resolve: (root: any, { street }: any) => getByName(street)
	},
	addressById: {
		type: addressType,
		args: {
			id: {
				description: 'find by id of the address',
				type: GraphQLString
			}
		},
		resolve: (root: any, { id }: any) => getByName(id)
	}
}

const mutation = {
	addAddress: {
		type: addressType,
		args: {
			street: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			neighborhood: {
				type: new GraphQLNonNull(GraphQLString)
			},
			zipcode: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			city: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			state: { 
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		resolve: (obj: any, input: any) => add(input)
	},
	updateAddress: {
		type: addressType,
		args: {
			id: { 
				type: new GraphQLNonNull(GraphQLID)
			},
			street: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			neighborhood: {
				type: new GraphQLNonNull(GraphQLString)
			},
			zipcode: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			city: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			state: { 
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		resolve: (obj: any, input: any) => update(input.id, input)
	},
	removeAddress: {
		type: addressType,
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
	type: addressType
}