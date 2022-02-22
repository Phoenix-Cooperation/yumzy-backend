import sequelize from 'sequelize';
import db from '../config/db/database.js';

const UserContent = db.define("users", {
        username: {
            type: sequelize.STRING
        },
        email: {
            type: sequelize.STRING
        }
    },
    {
        freezeTableName: true,
    }
);

export default UserContent;
