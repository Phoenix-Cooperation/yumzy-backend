import {DataSource} from "apollo-datasource";
import console from "consola";
const { success, error } = console;

class RecipeAPI extends DataSource {
    constructor({store}) {
        super();
        this.store = store;
    }

    initialize(config) {
        this.context = config.context;
    }

    /**
     * get all recipe
     * */
    async getAllRecipe() {
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
            error({badge: true, message: 'getAllRecipe{} -> Unauthorized user'})
            throw new Error('getAllRecipe{} -> Unauthorized user');
        }

        const recipe = await this.store.Recipe.findAll();
        return recipe && recipe.length > 0;
    }
}

export default RecipeAPI;