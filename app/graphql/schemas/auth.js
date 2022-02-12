import {gql } from 'apollo-server-express';

const typeDefs = gql(`
 
  type User {
        _id: Int!
        name: String!
        email: String!
    }
    
    type Role {
        _id: Int!
        name: String
        userId: Int!
    }
  
    input UserInputData {
        email: String!
        name: String!
    }

    type Query {
        user: User!
    }

    type Mutation {
        createUser(userInput: UserInputData): User!
    }
    
    schema {
    query: Query
    mutation: Mutation
}
`);

export default typeDefs;