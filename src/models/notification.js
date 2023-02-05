import sequelize, {DataTypes} from "sequelize";

export const NotificationModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    contentID: {
        type: DataTypes.UUID,
    },
    user_id: {
        type: sequelize.STRING,
    },
    message: {
        type: sequelize.TEXT
    },
    /**
     * user seen or not notification
     * S - seen
     * U - unseen
     * */
    status: {
        type: sequelize.TEXT
    }
}