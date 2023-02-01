import {gql} from 'apollo-server-express'

export default gql`
    extend type Query {
        getComments(contentId: ID): [Comment!]
    }
    extend type Mutation {
        addComment(comment: String!, contentId: ID!): messageResponse
    }

    type Comment {
        id: ID!
        comment: String
        user: User!
    }
`