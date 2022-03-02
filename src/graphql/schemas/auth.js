import {gql} from 'apollo-server-express';

export default gql`
    extend type Query {
        authenticateLoginUser(username: String!, email: String!): AuthUserOutput!
        getAllUsers: AllUserOutput!
    }
    extend type Mutation {
        testMutation: String!
        createUser(username: String!, email: String!, user_id: String!): User!
    }
    
    type AuthUserOutput {
        status: Boolean!
        code: Int!
        message: String!
        data: User!
    }

    type AllUserOutput {
        status: Boolean!
        code: String!
        message: String!
        data: [User!]!
    }
    
    type User {
        id: Int!
        username: String!
        email: String!
        user_id: String!
    }
    
    type Role {
        id: Int!
        name: String
        userId: Int!
    }
    
    input UserInputData {
        email: String!
        username: String!
        user_id: String!
    }
`;
