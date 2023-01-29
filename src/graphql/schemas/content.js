import {gql} from 'apollo-server-express';

export default gql`

    extend type Mutation {
        createRecipe(recipeInput: RecipeInput!): Recipe
        createTips(tipsInput: TipsInput!): Tips
        createPost(postInput: PostInput!): Post
    }

    extend type Query {
        getContent(pageSize: Int!, after: Int): getContentResponse
        getRecipeById(id: String!): Recipe
        getPostById(id: String!): Post
        getTipsById(id: String!): Tips
    }

    type getContentResponse {
        content: [Content!]
        hasMore: Boolean
    }

    type Content {
        id: String
        type: String!
        title: String!
        description: String
        ingredients: [String!]
        images: [String!]
        method: String
        time: String
        tips: String
        tags: [String]
        user: User
    }

    type Recipe {
        id: String!
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
        id: String!
        title: String!
        tips: String!
        images: [String]
        tags: [String]
    }

    input TipsInput {
        title: String!
        tips: String!
        images: [String]
        tags: [String]
    }

    type Post{
        id: String!
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
        id: String!
        title: String!
        content: String!
        createdAt: String!
    }
`;

