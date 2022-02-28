// import console from "consola";
// import db from "../models/index.js";

const {error, success} = console;
const Role = db.role;

// const initializeDB = async () => {
//     try {
// // force: true will drop the table if it already exists
//         db.sequelize.sync({force: true}).then(() => {
//             success({
//                 badge: true,
//                 message: 'Drop and Resync Database with { force: true }',
//             });
//             initial();
//         });
//     } catch (err) {
//         error({
//             badge: true,
//             message: err.message
//         })
//     }
// }

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

// export default initializeDB;