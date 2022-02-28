import sequelize from 'sequelize';
import db from '../config/db/database.js';

const Role = {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: sequelize.STRING
    }
};

export default Role;