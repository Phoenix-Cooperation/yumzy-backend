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

  async createRecipe(recipePostData) {

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
      
      success({ badge: true, message: "Recipe Created!" })
      return recipePostVal.dataValues;

    }
    catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async createTips(tipsData) {
    if (!this.context.user) {
      return null;
    }

    const { user_id } = this.context.user;

    const { dataValues: user } = await this.store.User.findOne({
      where: {
        user_id
      }
    })

    try {
      const tips = new this.store.Tips(tipsData)
      tips.userId = user.id
      const tipsVal = await tips.save()

      success({ badge: true,  message: "Tips Created!"})
      return tipsVal.dataValues;
    } catch (error) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }

  }

  async createPost(postData) {
    if (!this.context.user) {
      return null;
    }

    const { user_id } = this.context.user;

    const { dataValues: user } = await this.store.User.findOne({
      where: {
        user_id
      }
    })

    try {
      const post = new this.store.Post(postData)
      post.userId = user.id
      const postVal = await post.save()

      success({ badge: true,  message: "Post Created!"})
      return postVal.dataValues;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }

  }

}

export default PostAPI;