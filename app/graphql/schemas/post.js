import {gql } from 'apollo-server-express';

const typeDefs = gql(`

 type Post {
     id: Int!
     title: String!
     content: String!
     author: User!
     createdAt: String

 }

 type Query {
    getAllPosts: [Post!]
    getSinglePost(postId: Int!): Post
}
 type Mutation {
     createPost(title: String!, content: String!): CreatePostResponse
 }

 type CreatePostResponse {
    id: Int!
    title: String!
    content: String!
    createdAt: String!
 }
 
schema {
    query: Query
    mutation: Mutation
}
 `);

export default typeDefs;
