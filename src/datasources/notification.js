import {DataSource} from "apollo-datasource";
import {ErrorResponse} from "../util/errorHandler/errorResponse.js";
import {PubSub} from "graphql-subscriptions";
import console from 'consola';
import {NotificationModel} from "../models/notification.js";

const {error, success} = console;
const pubsub = new PubSub();

class NotificationAPI extends DataSource {
    constructor({store}) {
        super();
        this.store = store;
    }

    initialize(config) {
        this.context = config.context;
    }

    /**
     * @apiNote: crate notification and
     * create subscription to FE
     * */
    async createNotification(notifyData) {
        const {user_id} = this.context.user;
        if (!this.context.user) {
            error({badge: true, message: 'User not logged in'});
            throw new Error('Error! User is not logged in');
        }
        try {
            const notify = new this.store.NotificationRepo(notifyData);
            const notifyResponse = await notify.save();
            const {dataValues: {id, contentID, user_id, message, status}} = notifyResponse;
            // await pubsub.publish('POST_CREATED', {
            //     contentCreateSubscription: {
            //         id: id,
            //         contentId: contentID,
            //         message: message,
            //         status: status
            //     }
            // });
            // success({badge: true, message: "Notification created!"});
            return notifyResponse.dataValues;
        } catch (err) {
            error({badge: false, message: err.message})
            throw new ErrorResponse({message: `Cannot create notification: ${error.message}`})
        }
    }

    /**
     * @apiNote: get notification by user id
     * */
    async getNotification() {
        const {user_id} = this.context.user;
        if (!this.context.user) {
            error({badge: true, message: 'User not logged in'});
            throw new Error('Error! User is not logged in');
        }
        try {
            const rows = await this.store.NotificationRepo.findAll({
                where: {
                    user_id: user_id
                },
                include: {
                    model: this.store.Post,
                },
                order: [['createdAt', 'DESC']],
            });
            const notifications = rows.map((row) => {
                const {id, message, status, contentID, user_id} = row.dataValues;
                return row.dataValues;
            });
            console.log(notifications);
            return notifications;
        } catch (err) {
            error({badge: false, message: err.message})
            throw new ErrorResponse({message: `Cannot create notification: ${error.message}`})
        }
    }
}

export default NotificationAPI;