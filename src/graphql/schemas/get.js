import {gql} from 'apollo-server-express';

export default gql`
    extend type Query {
        getAllTips(pageSize: Int!, after: String!): TipsConnection!
        getAllRecipes(pageSize: Int!, after: String): RecipeConnection!
    }

    type TipsConnection {
        status: Boolean!
        code: Int!
        message: String!
        data: [TipsGet!]
        cursor: String
        hasMore: Boolean!
    }

    type RecipeConnection {
        status: Boolean!
        code: Int!
        message: String!
        data: [RecipeGet!]
        cursor: String
        hasMore: Boolean!
    }

    type TipsGet {
        id: Int!
        title: String!
        tips: String!
        images: [String]
        tags: [String]
    }

    type RecipeGet {
        id: Int!
        title: String!
        description: String!
        ingredients: [String!]
        images: [String!]
        method: String!
        time: String!
        tags: [String]
    }
`;