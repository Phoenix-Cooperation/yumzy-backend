import sequelize, {DataTypes} from "sequelize";

export const NotificationModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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