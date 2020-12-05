import { GraphQL, GraphQLProvider } from 'graphql-react'
import React, { Component } from 'react'
import Router from './router'

import './App.css'

const graphql = new GraphQL()

export default class App extends Component {
	render() {
		return (
			<GraphQLProvider graphql={graphql}>
				<Router />
			</GraphQLProvider>
		)
	}
}