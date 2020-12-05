import { GraphQLSchema, GraphQLObjectType } from 'graphql'

import AddressSchema from './address'
import CostumerSchema from './costumer'
import OrderSchema from './order'
import ProductSchema from './product'
import UserSchema from './user'
import FileSchema from './file'

export const graphqlSchema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: () => Object.assign(
			AddressSchema.query,
			CostumerSchema.query,
			FileSchema.query,
			OrderSchema.query,
			ProductSchema.query,
			UserSchema.query
		)
	}),
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: () => Object.assign(
			AddressSchema.mutation,
			CostumerSchema.mutation,
			FileSchema.mutation,
			OrderSchema.mutation,
			ProductSchema.mutation,
			UserSchema.mutation
		)
	}),
	types: [
		AddressSchema.type,
		CostumerSchema.type,
		FileSchema.type,
		...OrderSchema.types,
		ProductSchema.type,
		UserSchema.type,
	]
})
