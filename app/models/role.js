import sequelize from 'sequelize';
import db from '../config/db/database.js';

const role = db.define("roles", {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: sequelize.STRING
    }
});

export default role;