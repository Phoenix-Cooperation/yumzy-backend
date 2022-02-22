import db from "../models/index.js";

const Role = db.role;

const initializeDB = async () => {
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
    }).then();

    Role.create({
        id: 2,
        name: "moderator"
    }).then();

    Role.create({
        id: 3,
        name: "admin"
    }).then();
}

export default initializeDB;