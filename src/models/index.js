import {Sequelize} from 'sequelize';
import console from 'consola';

import dbConfig from '../config/db/dbConfig.js';
import UserModel from "./user.js";
import RoleModel from "./role.js";
import { 
    RecipeModel, 
    TipsModel, 
    PostModel, 
    ContentDetailModel, 
    ContentReactModel,
} from "./content.js";

import { CommentModel } from './comment.js';

const {success, error} = console;

export const paginateResults = ({
                                      after: cursor,
                                      pageSize = 20,
                                      results,
                                      // can pass in a function to calculate an item's cursor
                                      getCursor = () => null,
                                  }) => {
    if (pageSize < 1) return [];

    if (!cursor) return results.slice(0, pageSize);
    const cursorIndex = results.findIndex(item => {
        // if an item has a `cursor` on it, use that, otherwise try to generate one
        let itemCursor = item.cursor ? item.cursor : getCursor(item);

        // if there's still not a cursor, return false by default
        return itemCursor ? cursor === itemCursor : false;
    });

    return cursorIndex >= 0
        ? cursorIndex === results.length - 1 // don't let us overflow
            ? []
            : results.slice(
                cursorIndex + 1,
                Math.min(results.length, cursorIndex + 1 + pageSize),
            )
        : results.slice(0, pageSize);
};

export const createStore = () => {

    const db = new Sequelize(
        dbConfig.DB,
        dbConfig.USER,
        dbConfig.PASSWORD,
        {
            host: dbConfig.HOST,
            dialect: dbConfig.dialect,
            operatorsAliases: false,

            pool: {
                max: dbConfig.pool.max,
                min: dbConfig.pool.min,
                acquire: dbConfig.pool.acquire,
                idle: dbConfig.pool.idle
            },
            logging: false,
        }
    )

    const User = db.define('user', UserModel, {freezeTableName: true})
    const Role = db.define('role', RoleModel,)

    User.belongsToMany(Role, {through: "user_roles"})
    Role.belongsToMany(User, {through: "user_roles"})


    const Recipe = db.define('recipe', RecipeModel)

    User.hasMany(Recipe, {
        foreignKey: 'user_id'
    })
    Recipe.belongsTo(User, {
        foreignKey: 'user_id'
    })

    const Post = db.define('post', PostModel)

    User.hasMany(Post, {
        foreignKey: 'user_id'
    })
    Post.belongsTo(User, {
        foreignKey: 'user_id'
    })

    const Tips = db.define('tips', TipsModel)

    User.hasMany(Tips, {
        foreignKey: 'user_id'
    })
    Tips.belongsTo(User, {
        foreignKey: 'user_id'
    })
    
    const ContentDetail = db.define('contentDetail', ContentDetailModel)

    const ContentReact = db.define('contentReact', 
        ContentReactModel,
        // {
        //     indexes: [
        //         {
        //             unique: true,
        //             fields: ['contentId']
        //         }
        //     ]
        // }
    )

    const Comment = db.define('comment', CommentModel)

    ContentDetail.hasMany(Comment, {
        foreignKey: 'contentId'
    })
    Comment.belongsTo(ContentDetail, {
        foreignKey: 'contentId'
    })

    User.hasMany(Comment, {
        foreignKey: 'user_id'
    })
    Comment.belongsTo(User, {
        foreignKey: 'user_id'
    })

   

    try {
        // db.sync({ force : true })
        db.sync()
        success({badge: true, message: "DB Sync successfull"})
    } catch (err) {
        error({badge: true, message: "DB Sync failed"})
    }


    // const ROLES = ["user", "admin", "moderator"];
    return {db, User, Role, Recipe, Tips, Post, ContentDetail, ContentReact, Comment}
}

    
