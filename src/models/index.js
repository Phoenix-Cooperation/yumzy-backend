import { Sequelize } from 'sequelize';
import console from 'consola';

import dbConfig from '../config/db/dbConfig.js';
import UserModel from "./user.js";
import RoleModel from "./role.js";
import { RecipePostModel } from "./post.js";

const { success, error } = console;

// async function initial() {
//     Role.create({
//         id: 1,
//         name: "user"
//     }).then();

//     Role.create({
//         id: 2,
//         name: "moderator"
//     }).then();

//     Role.create({
//         id: 3,
//         name: "admin"
//     }).then();
// }

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

    const User = db.define('user', UserModel, { freezeTableName: true })
    const Role = db.define('role', RoleModel, )

    User.belongsToMany(Role, { through: "user_roles" })
    Role.belongsToMany(User, { through: "user_roles" })

    
    const RecipePost = db.define('recipe_post', RecipePostModel)

    User.hasMany(RecipePost)
    RecipePost.belongsTo(User)

    
    try {
        db.sync()
        success({ badge: true, message: "DB Sync successfull" })
    } catch (error) {
        error({ badge: true, message: "DB Sync failed"})
    }


    // const ROLES = ["user", "admin", "moderator"];
    return { db, User, Role }
}

    