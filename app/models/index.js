import {Sequelize} from "sequelize";
import sequelize from '../config/db/database.js';

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

import userModel from "./user.js";
import roleModel from "./role.js";

db.user = userModel;
db.role = roleModel;

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

export default db;
