import {gql} from "apollo-server-express";

export default gql`
    extend type Subscription {
        contentCreateSubscription: Message
    }

    extend type Mutation {
        createNotification(notifyInput: NotifyInput): Notify
    }

    input NotifyInput {
        contentID: String!
        user_id: String!
        message: String!
        status: String!
    }

    type Notify {
        id: String!
        contentID: String!
        user_id: String!
        message: String!
        status: String!
        receiversId: [String]!
    }

    type Message {
        id: String!
        contentId: String!
        message: String!
        status: String!
    }
`;