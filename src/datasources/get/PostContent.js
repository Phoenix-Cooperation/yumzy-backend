import {DataSource} from "apollo-datasource";

class PostContentAPI extends DataSource{
    constructor({store}) {
        super();
        this.store = store;
    }

    initialize(config) {
        this.context = config.context;
    }

    /**
     * get all post
     * */
    async getAllPostContent() {
        if (!this.context.user) {
            error({badge: true, message: 'User not logged in'})
            throw new Error('Error! User is not logged in');
        }

        const user_id = this.context.user.user_id;
        const {dataValues: user} = await this.store.User.findOne({
            where: {
                user_id
            }
        });

        if (!user) {
            error({badge: true, message: 'getAllPostContent{} -> Unauthorized user'})
            throw new Error('getAllPostContent{} -> Unauthorized user');
        }

        return await this.store.Post.findAll();
    }
}

export default PostContentAPI;