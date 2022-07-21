import {gql} from 'apollo-server-express';

export default gql`

    extend type Query {
        getAllPosts: [Post!]
        getSinglePost(postId: Int!): Post
    }
    
    extend type Mutation {
        createPost(title: String!, content: String!): CreatePostResponse
        createRecipe(recipeInput: RecipeInput!): Recipe
    }

    type Post {
        id: Int!
        title: String!
        images: [String]
        tags: [String]
    }

    type Recipe {
        id: Int!
        title: String!
        tags: [String]
        description: String!
        ingredients: [String!]
        images: [String!]
        method: String!
        time: String!
    }

    type Tips {
        id: Int!
        title: String!
        tags: [String]
        images: [String]
    }

    
    type CreatePostResponse {
        id: Int!
        title: String!
        content: String!
        createdAt: String!
    }

    input RecipeInput {
        title: String!
        description: String!
        ingredients: [String!]
        images: [String!]
        method: String!
        time: String!
        tags: [String]
    }
`;

