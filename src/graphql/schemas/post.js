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
        content: String!
        author: User!
        createdAt: String

    }

    type CreatePostResponse {
        id: Int!
        title: String!
        content: String!
        createdAt: String!
    }
`;

