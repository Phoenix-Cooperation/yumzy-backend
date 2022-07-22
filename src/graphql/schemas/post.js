import { gql } from 'apollo-server-express';

export default gql`

    
    extend type Mutation {
        createRecipe(recipeInput: RecipeInput!): Recipe
        createTips(tipsInput: TipsInput!): Tips
        createPost(postInput: PostInput!): Post
    }

    
    type Recipe {
        id: Int!
        title: String!
        description: String!
        ingredients: [String!]
        images: [String!]
        method: String!
        time: String!
        tags: [String]
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

    type Tips {
        id: Int!
        title: String!
        tips: String!
        images: [String]
        tags: [String]
    }

    input TipsInput {
        id: Int!
        title: String!
        tips: String!
        images: [String]
        tags: [String]
    }
    
    type Post{
        id: Int!
        title: String!
        description: String!
        images: [String]
        tags: [String]
    }

    input PostInput {
        title: String!
        description: String!
        images: [String]
        tags: [String]
    }
    type CreatePostResponse {
        id: Int!
        title: String!
        content: String!
        createdAt: String!
    }

    
`;

