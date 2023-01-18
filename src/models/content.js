import sequelize, { DataTypes} from "sequelize";


export const RecipeModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
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

export const TipsModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: sequelize.STRING
    },
    tips: {
        type: sequelize.STRING
    },
    images: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    tags: {
        type: DataTypes.ARRAY(sequelize.STRING)
    }
}


export const PostModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: sequelize.STRING
    },
    description: {
        type: sequelize.STRING
    },
    images: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    tags: {
        type: DataTypes.ARRAY(sequelize.STRING)
    }
}


export const ContentDetailModel = {
    contentId: {
        type: DataTypes.UUID,
    }, 
    contentType: {
        type: sequelize.STRING
    }
}