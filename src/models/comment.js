import sequelize, { DataTypes } from "sequelize";


export const CommentModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    comment: {
        type: sequelize.TEXT
    }
}