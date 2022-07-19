import sequelize, { DataTypes} from "sequelize";

export const RecipePost = {
    title: {
        type: sequelize.STRING
    },
    tags: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    description: {
        type: sequelize.STRING
    },
    ingredients: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    time: {
        type: sequelize.STRING
    },
    images: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    method: {
        type: sequelize.STRING,
    }

}