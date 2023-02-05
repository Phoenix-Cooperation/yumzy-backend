import {PubSub, withFilter} from 'graphql-subscriptions';
import {ErrorResponse} from "../../util/errorHandler/errorResponse";
import {SUBS} from '../../util/constant/subscription.js'

const pubsub = new PubSub();

export default {
    Subscription: {
        contentCreateSubscription: {
            subscribe: withFilter(() => pubsub.asyncIterator([SUBS.POST_CREATED]),
                (payload, variable) => {
                    return (payload);
                }),
        }
    },

    Mutation: {
        createNotification: async (_, {notifyInput}, {dataSources}) => {
            try {
                const notify = await dataSources.NotificationAPI.createNotification(notifyInput);
                const {id, contentID, user_id, message, status} = notify;
                await pubsub.publish(SUBS.POST_CREATED, {
                    contentCreateSubscription: {
                        id: id,
                        contentId: contentID,
                        message: message,
                        status: status
                    }
                });
                return notify;
            } catch (error) {
                throw new ErrorResponse({message: `Cannot create notification: ${error.message}`})
            }
        }
    }
}