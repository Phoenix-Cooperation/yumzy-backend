import { DataSource } from "apollo-datasource";
import console from 'consola';
import { Op } from "sequelize";

const { success, error } = console;

class ContentAPI extends DataSource {
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
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
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
      const recipeVal = await recipePost.save();
      
      const { dataValues: { id }} = recipeVal;
      const tempContentDetail = { contentId: id, contentType: "recipe"}
      const contentDetail = new this.store.ContentDetail(tempContentDetail)
      const contentDetailVal = await contentDetail.save()


      success({ badge: true, message: "Recipe Created!" })
      return recipeVal.dataValues;

    }
    catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async createTips(tipsData) {
    if (!this.context.user) {
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
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

      const { dataValues: { id }} = tipsVal;
      const tempContentDetail = { contentId: id, contentType: "tips"}
      const contentDetail = new this.store.ContentDetail(tempContentDetail)
      const contentDetailVal = await contentDetail.save()

      success({ badge: true,  message: "Tips Created!"})
      return tipsVal.dataValues;
    } catch (error) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }

  }

  async createPost(postData) {
    if (!this.context.user) {
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
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
      const { dataValues: { id } } = postVal;

      const tempContentDetail = { contentId: id, contentType: "post"}
      const contentDetail = new this.store.ContentDetail(tempContentDetail)
      const contentDetailVal = await contentDetail.save()

      success({ badge: true,  message: "Post Created!"})
      return postVal.dataValues;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }

  }

  async getRecipesByIds({contentIds}) {
    if (contentIds === []) return [];

    try {
      const recipeVals = await this.store.Recipe.findAll({
        where: {
          id: {
            [Op.in]: contentIds
          }
        } 
      })
      const recipes = recipeVals.map(data => ({ type: "recipe", ...data.dataValues }));
      return recipes;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getPostsByIds({contentIds}) {
    if (contentIds === []) return [];

    try {
      const postVals = await this.store.Post.findAll({
        where: {
          id: {
            [Op.in]: contentIds
          }
        }
      })
      const posts = postVals.map(data => ({ type:"post", ...data.dataValues}))
      return posts;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getTipsByIds({contentIds}) {
    if (contentIds === []) return [];

    try {
      const tipsVals = await this.store.Tips.findAll({
        where: {
          id: {
            [Op.in]: contentIds
          }
        }
      })
      const tips = tipsVals.map(data => ({ type:"tips", ...data.dataValues }))
      return tips;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  

  async getContent({pageSize, after}) {
    try {
      const allContent = await this.store.ContentDetail.findAll({
        order: [['createdAt', 'DESC']],
      })
      console.log(pageSize, after)
      const slicedContent = allContent.slice(after, after + pageSize).map(data => data.dataValues)
      // const { dataValues: {}}
      // console.log(slicedContent, "slicedContent")

      const recipeIds = slicedContent.filter(data => data?.contentType === "recipe").map(data => data?.contentId)
      const postIds = slicedContent.filter(data => data?.contentType === "post").map(data => data.contentId)
      const tipsIds =  slicedContent.filter(data => data?.contentType === "tips").map(data => data.contentId)
      
      const recipes = await this.getRecipesByIds({ contentIds: recipeIds })
      const posts = await this.getPostsByIds({ contentIds: postIds })
      const tips = await this.getTipsByIds({ contentIds: tipsIds })

      // console.log(recipes.concat(posts, tips))
      return recipes.concat(posts, tips)
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }

  }

}

export default ContentAPI;