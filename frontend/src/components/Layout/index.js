import React from 'react'
import Footer from '../Footer'
import Header from '../Header'
import './style.sass'

export default function Layout(props) {
	const { children, updateBadge } = props

	return (
		<div>
			<Header updateBadge={updateBadge} />
			{children}
			<Footer />
		</div>
	)
}