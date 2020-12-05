import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import routes from './config/routes'
import normalizePort from './util/normalizePort'
import * as db from './config/db'

import Debug from 'debug'
const debug = Debug('api')

require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV}` })

const app: Application = express()

app.use(express.static(`${process.cwd()}/src/public`));
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

routes(app)

const port = normalizePort(process.env.API_PORT || '3000')
app.set('port', port)

app.listen(port, '0.0.0.0')
	.on('error', (error:any) => {
		if (error.syscall !== 'listen') {
			throw error
		}
	
		var bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
	
		switch (error.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges')
				process.exit(1)
			break
			case 'EADDRINUSE':
				console.error(bind + ' is already in use')
				process.exit(1)
			break
			default:
				throw error
		}
	})
	.on('listening', () => {
		debug(`⚡️[server]: Server is running at http://localhost:${port}`)

		db.connect()
			.then(() => {
				debug(`Database successfully connected`)
			})
	})

export default app