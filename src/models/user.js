import sequelize from 'sequelize';
import db from '../config/db/database.js';

// const User = db.define("users", {
//         username: {
//             type: sequelize.STRING
//         },
//         email: {
//             type: sequelize.STRING
//         }
//     },
//     {
//         freezeTableName: true,
//     }
// );

const UserModel = {
    user_id: {
        type: sequelize.STRING,
        primaryKey: true,
    },
    username: {
        type: sequelize.STRING
    },
    email: {
        type: sequelize.STRING
    },
}

export default UserModel;
