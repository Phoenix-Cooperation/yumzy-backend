import sequelize, {DataTypes, Sequelize} from "sequelize";


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
        type: sequelize.TEXT
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
        type: sequelize.TEXT,
    },
    reactCount: {
        type: sequelize.INTEGER
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
        type: sequelize.TEXT
    },
    images: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    tags: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    reactCount: {
        type: sequelize.INTEGER
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
        type: sequelize.TEXT
    },
    images: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    tags: {
        type: DataTypes.ARRAY(sequelize.STRING)
    },
    reactCount: {
        type: sequelize.INTEGER
    }
}

export const ContentDetailModel = {
    contentId: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    contentType: {
        type: sequelize.STRING
    }
}

export const ContentReactModel = {
    contentId: {
        type: DataTypes.UUID
    },
    user_id: {
        type: sequelize.STRING
    }
}

export const SaveContentModel = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    contentType: {
        type: sequelize.STRING
    }
}

