import {
	GraphQLObjectType,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLID
} from 'graphql'

import { list, getByName, getById, add, update, remove } from '../models/user'

const userType = new GraphQLObjectType({
	name: 'User',
	description: 'User specification',
	fields: () => ({
		id: {
			type: GraphQLID,
			description: 'The guid of the user',
		},
		username: {
			type: GraphQLString,
			description: 'The username',
		},
		password: {
			type: GraphQLString,
			description: 'The password',
		},
	}),
})

const query = {
	users: {
		type: new GraphQLList(userType),
		args: {
			limit: {
				description: 'limit items in the results',
				type: GraphQLInt
			}
		},
		resolve: (root: any, { limit }: any) => list(limit)
	},
	userByName: {
		type: userType,
		args: {
			username: {
				description: 'find by username',
				type: GraphQLString
			}
		},
		resolve: (root: any, { username }: any) => getByName(username)
	},
	userById: {
		type: userType,
		args: {
			id: {
				description: 'find by id',
				type: GraphQLID
			}
		},
		resolve: (root: any, { id }: any) => getById(id)
	}
}

const mutation = {
	addUser: {
		type: userType,
		args: {
			username: {
				type: new GraphQLNonNull(GraphQLString)
			},
			password: {
				type: new GraphQLNonNull(GraphQLString)
			},
		},
		resolve: (obj: any, input: any) => add(input)
	},
	updateUser: {
		type: userType,
		args: {
			id: { 
				type: new GraphQLNonNull(GraphQLID)
			},
			username: {
				type: new GraphQLNonNull(GraphQLString)
			},
			password: {
				type: new GraphQLNonNull(GraphQLString)
			},
		},
		resolve: (obj: any, input: any) => update(input.id, input)
	},
	removeUser: {
		type: userType,
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
	type: userType
}