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

    if (!this.context.user) {
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
    }

    const { user_id }= this.context.user;
    // console.log("post api userid", user_id)
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
        },
        include: 'user',
      });

      const recipes = recipeVals.map(data => {
        const { user, ...vals} = data.dataValues;
        return { type: 'recipe', ...vals, user: user.dataValues}
      });

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
        },
        include: 'user',
      })

      
      const posts = postVals.map(data => {
        const { user, ...vals} = data.dataValues;
        return { type: 'post', ...vals, user: user.dataValues}
      });

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
        },
        include: 'user'
      })

      const tips = tipsVals.map(data => {
        const { user, ...vals} = data.dataValues;
        return { type: 'tips', ...vals, user: user.dataValues}
      })

      return tips;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }


  async checkCurrentUserReacted(contentId, user_id) {
    const status = await this.store.ContentReact.findOne({
      where: {
        contentId, 
        user_id
      }
    });

    if (status) return true;

    return false;
  }
  

  async getContent({pageSize, after}) {
    try {

      const { user_id } = this.context.user;

      const allContent = await this.store.ContentDetail.findAll({
        order: [['createdAt', 'DESC']],
      })
      const slicedContent = allContent.slice(after, after + pageSize).map(data => data.dataValues)
      let hasMore = false;

      console.log(slicedContent.length + after, allContent.length)
      if (slicedContent.length + after < allContent.length) hasMore = true

      const recipeIds = slicedContent.filter(data => data?.contentType === "recipe").map(data => data?.contentId)
      const postIds = slicedContent.filter(data => data?.contentType === "post").map(data => data.contentId)
      const tipsIds =  slicedContent.filter(data => data?.contentType === "tips").map(data => data.contentId)
      
      const recipes = await this.getRecipesByIds({ contentIds: recipeIds })
      const posts = await this.getPostsByIds({ contentIds: postIds })
      const tips = await this.getTipsByIds({ contentIds: tipsIds })

      // console.log(recipes.concat(posts, tips))

      let content = recipes.concat(posts, tips);

      content = await Promise.all(content.map(async (data) => {
        const { id, ...vals } = data;
        const currentUserReacted = await this.checkCurrentUserReacted(id, user_id)
        return { ...vals, currentUserReacted }
      }))
      content = [...content].sort(() => Math.random() - 0.5);

      return { content , hasMore };
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getSingleRecipeById(id) {
    try {
      // const { dataValues: recipe } = await this.store.Recipe.findByPk(id)
      const data = await this.store.Recipe.findByPk(id);
      // console.log(data.dataValues)
      return data.dataValues
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getSinglePostById(id) {
    try {
      const data = await this.store.Post.findByPk(id)
      return data.dataValues
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getSingleTipsById(id) {
    try {
      const data = await this.store.Tips.findByPk(id)
      return data.dataValues
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async reactToRecipe(id) {
    try {
      let contentData = await this.getSingleRecipeById(id);
      
      contentData.reactCount = contentData.reactCount + 1;
      await this.store.Recipe.update(contentData, {
        where: { id }
      })
      
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async unReactToRecipe(id) {
    try {
      let contentData = await this.getSingleRecipeById(id);
      
      contentData.reactCount = contentData.reactCount - 1;
      await this.store.Recipe.update(contentData, {
        where: { id }
      })
      
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async reactToPost(id) {
    try {
      let contentData = await this.getSinglePostById(id);

      contentData.reactCount = contentData.reactCount + 1;
      await this.store.Post.update(contentData, {
        where: { id }
      })
      
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async unReactToPost(id) {
    try {
      let contentData = await this.getSinglePostById(id);

      contentData.reactCount = contentData.reactCount - 1;
      await this.store.Post.update(contentData, {
        where: { id }
      })
      
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async reactToTips(id) {
    try {
      let contentData = await this.getSingleTipsById(id);

      contentData.reactCount = contentData.reactCount + 1;
      await this.store.Tips.update(contentData, {
        where: { id }
      })

    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async reactToTips(id) {
    try {
      let contentData = await this.getSingleTipsById(id);

      contentData.reactCount = contentData.reactCount - 1;
      await this.store.Tips.update(contentData, {
        where: { id }
      })

    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async reactToContent(id) {
    if (!this.context.user) {
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
    }

    const { user_id } = this.context.user;

    try {
      const vals = await this.store.ContentDetail.findOne({
        where: {
          contentId : id
        }
      })
      
      const { dataValues: ContentDetail } = vals;
      const { contentType } = ContentDetail;
      
      if (contentType === "recipe") {
        await this.reactToRecipe(id)
      } else if (contentType === "post") {
        await this.reactToPost(id);
      } else if (contentType === "tips") {
        await this.reactToTips(id);
      }

      const contentReact= await new this.store.ContentReact({ contentId: id, user_id })
      await contentReact.save()
      return { message: "success" }
    }
    catch (err) {
      console.log(err)
    }
  }

  async unReactToContent(id) {
    if (!this.context.user) {
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
    }

    const { user_id } = this.context.user;

    try {
      const vals = await this.store.ContentDetail.findOne({
        where: {
          contentId : id
        }
      });

      const { dataValues: ContentDetail } = vals;
      const { contentType } = ContentDetail;

      if (contentType === "recipe") {
        await this.unReactToRecipe(id)
      } else if (contentType === "post") {
        await this.unReactToPost(id);
      } else if (contentType === "tips") {
        await this.unReactToTips(id);
      }

      await this.store.ContentReact.destroy({
        where: {
          contentId: id,
          user_id
        }
      })

      return { message: "success" }
    } catch (error) {
      
    }
  }
}

export default ContentAPI;