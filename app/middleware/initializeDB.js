import db from "../models/index.js";

const Role = db.role;

const initilizeDB = async () => {
    try {
// force: true will drop the table if it already exists
        db.sequelize.sync({force: true}).then(() => {
            console.log('Drop and Resync Database with { force: true }');
            initial();
        });
    } catch (err) {
        console.log(err);
    }
}

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
}

export default initilizeDB;