const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      born: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      /*if (args.author && args.genre) 
        return books.filter(b => 
        ((b.author === args.author) && (b.genres.includes(args.genre)))
        )
      else if (args.author) 
        return books.filter(b => b.author === args.author)
      else if (args.genre) 
        return books.filter(b => b.genres.includes(args.genre))
      return books */
      return Book.find({})
    },
    allAuthors: async (root, args) => {
      //filters missing
      return Author.find({})
    }
  },
  Author: {
    bookCount: (root) => {
      return books.filter(b => b.author === root.name).length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author)
        author = new Author({ name: args.author })
        await author.save()
      const book = new Book({ ...args, author: author })
      return await book.save()
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.born
      return author.save()
    } 
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
