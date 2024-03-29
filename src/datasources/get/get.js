import {DataSource} from "apollo-datasource";
import console from "consola";
import * as GetAPI from "./index.js";
const { success, error } = console;

class GetWrapper extends DataSource {
    constructor({store}) {
        super();
        this.store = store;
    }

    initialize(config) {
        this.context = config.context;
    }

    async receiptAPI() {
        return GetAPI.ReceiptAPI;
    }

    async tipAPI() {
        return GetAPI.TipAPI;
    }

    // async getAllTips() {
    //     if (!this.context.user) {
    //         error({badge: true, message: 'User not logged in'})
    //         throw new Error('Error! User is not logged in');
    //     }
    //
    //     const user_id = this.context.user.user_id;
    //     const {dataValues: user} = await this.store.User.findOne({
    //         where: {
    //             user_id
    //         }
    //     });
    //
    //     if (!user) {
    //         error({badge: true, message: 'getAllTips{} -> Unauthorized user'})
    //         throw new Error('getAllTips{} -> Unauthorized user');
    //     }
    //
    //     const tips = await this.store.Tips.findAll();
    //     return tips && tips.length > 0;
    // }

}

export default GetWrapper;