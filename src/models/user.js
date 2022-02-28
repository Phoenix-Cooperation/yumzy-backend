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

const User = {
    username: {
        type: sequelize.STRING
    },
    email: {
        type: sequelize.STRING
    },
    user_id: {
        type: sequelize.STRING
    }
}

export default User;
