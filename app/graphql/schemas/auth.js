import {gql} from 'apollo-server-express';

export default gql`
    extend type Query {
        getAllUsers: [User!]!
    }
    extend type Mutation {
        testMutation: String!
        createUser(userData: UserInputData!): User!
    }
    
    type User {
        _id: Int!
        username: String!
        email: String!
    }
    
    type Role {
        _id: Int!
        name: String
        userId: Int!
    }
    
    input UserInputData {
        email: String!
        username: String!
    }
`;
