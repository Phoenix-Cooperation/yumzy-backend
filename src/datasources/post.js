import { DataSource } from "apollo-datasource";
import console from 'consola';

const { success, error } = console;

class PostAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async createRecipePost(recipePostData) {

    console.log("post", this.context.user)
    if (!this.context.user) {
      return null;
    }

    const { user_id }= this.context.user;
    console.log("post api userid", user_id)
    const { dataValues: user } = await this.store.User.findOne({
      where: {
        user_id
      }
    })
    console.log("post api user", user);

    try {
      const recipePost = new this.store.Recipe(recipePostData);
      recipePost.userId = user.id
      const recipePostVal = await recipePost.save();
      console.log("post api recipe", recipePostVal.dataValues)
      
      success({ badge: true, message: "Recipe Post Created!" })
      return recipePostVal.dataValues;

    }
    catch (err) {
      error({ badge: true, message: err.message })
      return null;
    }
  }

}

export default PostAPI;