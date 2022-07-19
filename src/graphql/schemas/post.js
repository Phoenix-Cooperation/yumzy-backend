import {gql} from 'apollo-server-express';

export default gql`

    extend type Query {
        getAllPosts: [Post!]
        getSinglePost(postId: Int!): Post
    }
    
    extend type Mutation {
        createPost(title: String!, content: String!): CreatePostResponse
    }

    type Post {
        id: Int!
        title: String!
        images: [String]
        tags: [String]
    }

    type RecipePost {
        id: Int!
        title: String!
        tags: [String]
        description: String!
        ingredients: [String!]
        images: [String!]
        Method: String
        Time: String!
    }

    type TipsPost {
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
`;

