import React from 'react'
import './style.sass'
import logo from '../../assets/images/main/symbol.svg'

export default function Footer(props) {
	return (
		<footer className="footer">
			<p><img src={logo} alt="logotipo"></img>© Copyright 2020. Todos os direitos reservados</p>
		</footer>
	)
}