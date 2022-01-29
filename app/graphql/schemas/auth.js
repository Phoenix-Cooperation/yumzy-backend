import { ApolloServer, gql } from 'apollo-server-express';

const typeDefs = gql(`
 
  type Book {
    title: String
    author: String
  }

  
  type Query {
    books: [Book]
  }
  
  type User {
        _id: Int!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }
    
    type Role {
        _id: Int!
        name: String
        userId: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        hello: String
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

export default typeDefs;