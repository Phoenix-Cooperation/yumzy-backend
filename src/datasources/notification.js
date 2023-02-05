import {DataSource} from "apollo-datasource";
import {ErrorResponse} from "../util/errorHandler/errorResponse.js";

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
            const notify = new this.store.Notification(notifyData);
            notify.user_id = user_id;
            const notifyResponse = await notify.save();
            const {dataValues: {id, contentID, user_id, message, status}} = notifyResponse;
            success({badge: true, message: "Notification created!"});
            return notifyResponse.dataValues;
        } catch (err) {
            error({badge: false, message: err.message})
            throw new ErrorResponse({message: `Cannot create notification: ${error.message}`})
        }
    }

}

export default NotificationAPI;