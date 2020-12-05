import {
	GraphQLObjectType,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLID
} from 'graphql'

import { list, getByName, add, update, remove } from '../models/costumer'

import UserSchema from './user'
import AddressSchema from './address'

const costumerType = new GraphQLObjectType({
	name: 'Costumer',
	description: 'Costumer specification',
	fields: () => ({
		id: {
			type: GraphQLID,
			description: 'The guid of the user',
		},
		user: { 
			type: UserSchema.type, 
			description: "User of the costumer"
		},
		fullname: { 
			type: GraphQLString, 
			description: "Fullname of the costumer"
		},
		age: { 
			type: GraphQLInt, 
			description: "Age of the costumer" 
		},
		addresses: {
			type: new GraphQLList(AddressSchema.type),
			description: "Addresses of the costumer"
		}
	})
})

const query = {
	costumers: {
		type: new GraphQLList(costumerType),
		args: {
			limit: {
				description: 'limit items in the results',
				type: GraphQLInt
			}
		},
		resolve: (root: any, { limit }: any) => list(limit)
	},
	costumerByName: {
		type: costumerType,
		args: {
			fullname: {
				description: 'find by fullname of the costumer',
				type: GraphQLString
			}
		},
		resolve: (root: any, { fullname }: any) => getByName(fullname)
	},
	costumerById: {
		type: costumerType,
		args: {
			id: {
				description: 'find by id of the costumer',
				type: GraphQLString
			}
		},
		resolve: (root: any, { id }: any) => getByName(id)
	}
}

const mutation = {
	addCostumer: {
		type: costumerType,
		args: {
			user: { 
				type: GraphQLID
			},
			fullname: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			age: { 
				type: new GraphQLNonNull(GraphQLInt)
			},
			addresses: {
				type: new GraphQLList(GraphQLID)
			}
		},
		resolve: (obj: any, input: any) => add(input)
	},
	updateCostumer: {
		type: costumerType,
		args: {
			id: { 
				type: new GraphQLNonNull(GraphQLID)
			},
			user: { 
				type: GraphQLID
			},
			fullname: { 
				type: new GraphQLNonNull(GraphQLString)
			},
			age: { 
				type: new GraphQLNonNull(GraphQLInt)
			},
			addresses: {
				type: new GraphQLList(GraphQLID)
			}
		},
		resolve: (obj: any, input: any) => update(input.id, input)
	},
	removeCostumer: {
		type: costumerType,
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
	type: costumerType
}