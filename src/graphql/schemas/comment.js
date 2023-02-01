import {gql} from 'apollo-server-express'

export default gql`
    extend type Mutation {
        addComment(comment: String!, contentId: ID!): messageResponse
    }
`