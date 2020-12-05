import { printSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'
const { graphqlUploadExpress } = require('graphql-upload')
import { Router, Request, Response, Application } from 'express'

import { createWriteStream, unlink } from 'fs'
import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import mkdirp from 'mkdirp'
import shortid from 'shortid'

import { graphqlSchema } from '../schemas'
import AuthService from '../services/auth'

import authenticationMiddleware from '../middlewares/authentication.middleware'
import errorMiddleware from '../middlewares/error.middleware'

export default (app: Application) => {
	const router = Router()

	app.use('/', router)

	router.get('/', (req: Request, res: Response) => {
		res.send({
			name: "Shopping Cart Api",
			version: "1.0.0"
		})
	})

	router.post("/auth/login", AuthService.login)

	router.post("/auth/change-password", authenticationMiddleware, AuthService.changePassword)

	/**
	 * Upload configuration
	 */
	const UPLOAD_DIR = `${process.cwd()}/src/public/images`

	const adapter = new FileSync('./data.json')
	const db = lowdb(adapter)

	db.defaults({ uploads: [] }).write()

	mkdirp.sync(UPLOAD_DIR)

	const storeUpload = async (upload: any) => {
		const { createReadStream, filename, mimetype } = await upload
		const stream = createReadStream()
		const id = shortid.generate()
		const path = `${UPLOAD_DIR}/${id}-${filename}`
		const file = { id, filename, mimetype, path }

		// Store the file in the filesystem.
		await new Promise((resolve, reject) => {
			// Create a stream to which the upload will be written.
			const writeStream = createWriteStream(path)

			// When the upload is fully written, resolve the promise.
			writeStream.on('finish', resolve)

			// If there's an error writing the file, remove the partially written file
			// and reject the promise.
			writeStream.on('error', (error) => {
				unlink(path, () => {
					reject(error)
				})
			})

			// In Node.js <= v13, errors are not automatically propagated between piped
			// streams. If there is an error receiving the upload, destroy the write
			// stream with the corresponding error.
			stream.on('error', (error: any) => writeStream.destroy(error))

			// Pipe the upload into the write stream.
			stream.pipe(writeStream)
		})

		// Record the file metadata in the DB.
		const data: any = db.get('uploads')

		data.push(file).write()

		return file
	}

	router.use('/graphql',
		// authenticationMiddleware,
		graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
		graphqlHTTP(request => {
			const startTime = Date.now()
			return {
				schema: graphqlSchema,
				graphiql: true,
				context: { db, storeUpload },
				extensions({ document, variables, operationName, result }) {
					return { runTime: Date.now() - startTime }
				}
			}
		})
	)

	router.use('/schema',
		// authenticationMiddleware,
		(req, res, _next) => {
			res.set('Content-Type', 'text/plain')
			res.send(printSchema(graphqlSchema))
		}
	)

	router.use((req: Request, res: Response) => {
		return res.status(404).send({
			success: false,
			message: `Route ${req.url} Not found.`,
			data: null
		})
	})

	router.use(errorMiddleware)
}