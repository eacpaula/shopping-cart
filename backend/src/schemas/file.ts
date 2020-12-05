import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID
} from 'graphql'

import { GraphQLUpload } from 'graphql-upload'

const fileType = new GraphQLObjectType({
    name: 'File',
    description: 'A stored file.',
    fields: () => ({
        id: {
            description: 'Unique ID.',
            type: GraphQLNonNull(GraphQLID),
        },
        path: {
            description: 'Where it’s stored in the filesystem.',
            type: GraphQLNonNull(GraphQLString),
        },
        filename: {
            description: 'Filename, including extension.',
            type: GraphQLNonNull(GraphQLString),
        },
        mimetype: {
            description: 'MIME type.',
            type: GraphQLNonNull(GraphQLString),
        }
    })
})

const query = {
    uploads: {
        description: 'All stored files.',
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(fileType))),
        resolve: (root: any, args: {}, { db }: any) => db.get('uploads').value()
    }
}

const mutation = {
    singleUpload: {
        description: 'Stores a single file.',
        type: GraphQLNonNull(fileType),
        args: {
            file: {
                description: 'File to store.',
                type: GraphQLNonNull(GraphQLUpload),
            }
        },
        resolve: async (obj: any, { file }: any, { storeUpload }: any) => { 
            const result = await storeUpload(file)
            return result
        }
    }
    // multipleUpload: {
    //     description: 'Stores multiple files.',
    //     type: GraphQLNonNull(GraphQLList(GraphQLNonNull(fileType))),
    //     args: {
    //         files: {
    //             description: 'Files to store.',
    //             type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLUpload))),
    //         },
    //     },
    //     async resolve(obj: any, { files }: any, { storeUpload }: any) {
    //         // Ensure an error storing one upload doesn’t prevent storing the rest.
    //         const results = await Promise.allSettled(files.map(storeUpload))
            
    //         return results.reduce((storedFiles: any, { value, reason }: any) => {
    //             if (value) storedFiles.push(value)
    //             // Realistically you would do more than just log an error.
    //             else console.error(`Failed to store upload: ${reason}`)
    //             return storedFiles
    //         }, [])
    //     },
    // },
}

const subscription = {

}

export default {
    query,
    mutation,
    subscription,
    type: fileType
}