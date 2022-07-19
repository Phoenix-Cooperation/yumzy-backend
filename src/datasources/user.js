import { DataSource } from 'apollo-datasource';
import console from 'consola';

const { success, error } = console
class UserAPI extends DataSource {
    constructor({ store }) {
        super();
        this.store = store;
    }

    initialize(config) {
        this.context = config.context;
    }

    async createOrFindUser(userData) {
        const { user_id, email, username } = userData;
        try {
            const user = await this.store.User.findOne({ where: {
                user_id : user_id, 
                email: email, 
                username: username,
            }})

            if (user) {
                success({ badge: true,  message: "User Found"})
                return user; 
            }
            else {
                const user = new this.store.User(userData)
                const userVal = await user.save();
                console.log(userVal);
                success({ badge: true,  message: "User Created"})
                return userVal.dataValues;
            }
            return null;
        } catch (err) {
            error({ badge: true, message: err.message })
            return null
        }
    }

    async getAllUsers() {
        // console.log(this.store)
        try {
            const users = await this.store.User.findAll()
            console.log(users);
            const userList = users.map(user => user.dataValues)
            console.log(userList)
            if (users) {
                success({ badge: true, message: "Get all users successful"})
                return userList;
            } else {
                return null;
            }
        } catch (err) {
            error({ badge: true, message: err.message })
            return null
        }
    }

};

export default UserAPI;