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
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }

    const { user_id } = this.context.user;
    // console.log("post api userid", user_id)
    // const { dataValues: user } = await this.store.User.findOne({
    //   where: {
    //     user_id
    //   }
    // })
    // console.log("post api user", user);

    try {
      const recipePost = new this.store.Recipe(recipePostData);
      recipePost.user_id = user_id
      const recipeVal = await recipePost.save();

      const { dataValues: { id } } = recipeVal;
      const tempContentDetail = { contentId: id, contentType: "recipe" }
      const contentDetail = new this.store.ContentDetail(tempContentDetail)
      const contentDetailVal = await contentDetail.save()


      success({ badge: true, message: "Recipe Created!" })
      return recipeVal.dataValues;

    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async createTips(tipsData) {
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }

    const { user_id } = this.context.user;

    // const { dataValues: user } = await this.store.User.findOne({
    //   where: {
    //     user_id
    //   }
    // })

    try {
      const tips = new this.store.Tips(tipsData)
      tips.user_id = user_id
      const tipsVal = await tips.save()

      const { dataValues: { id } } = tipsVal;
      const tempContentDetail = { contentId: id, contentType: "tips" }
      const contentDetail = new this.store.ContentDetail(tempContentDetail)
      const contentDetailVal = await contentDetail.save()

      success({ badge: true, message: "Tips Created!" })
      return tipsVal.dataValues;
    } catch (error) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }

  }

  async createPost(postData) {
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }

    const { user_id } = this.context.user;

    // const { dataValues: user } = await this.store.User.findOne({
    //   where: {
    //     user_id
    //   }
    // })

    try {
      const post = new this.store.Post(postData)
      post.user_id = user_id
      const postVal = await post.save()
      const { dataValues: { id } } = postVal;

      const tempContentDetail = { contentId: id, contentType: "post" }
      const contentDetail = new this.store.ContentDetail(tempContentDetail)
      const contentDetailVal = await contentDetail.save()

      success({ badge: true, message: "Post Created!" })
      return postVal.dataValues;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }

  }

  async getRecipesByIds({ contentIds }) {
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
        const { user, ...vals } = data.dataValues;
        return { type: 'recipe', ...vals, user: user.dataValues }
      });

      return recipes;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getPostsByIds({ contentIds }) {
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
        const { user, ...vals } = data.dataValues;
        return { type: 'post', ...vals, user: user.dataValues }
      });

      return posts;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getTipsByIds({ contentIds }) {
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
        const { user, ...vals } = data.dataValues;
        return { type: 'tips', ...vals, user: user.dataValues }
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


  async getPaginatedContentDetail({ pageSize, after }) {
    try {
      const allContent = await this.store.ContentDetail.findAll({
        order: [['createdAt', 'DESC']],
      })

      const slicedContent = allContent.slice(after, after + pageSize).map(data => data.dataValues)
      let hasMore = false;

      console.log(slicedContent.length + after, allContent.length)

      if (slicedContent.length + after < allContent.length) hasMore = true

      return { slicedContent, hasMore }

    } catch (err) {
      error({ message: err.message, badge: true })
    }
  }

  async getContent(slicedContent) {
    try {

      const { user_id } = this.context.user;

      const recipeIds = slicedContent.filter(data => data?.contentType === "recipe").map(data => data?.contentId)
      const postIds = slicedContent.filter(data => data?.contentType === "post").map(data => data.contentId)
      const tipsIds = slicedContent.filter(data => data?.contentType === "tips").map(data => data.contentId)

      const recipes = await this.getRecipesByIds({ contentIds: recipeIds })
      const posts = await this.getPostsByIds({ contentIds: postIds })
      const tips = await this.getTipsByIds({ contentIds: tipsIds })

      // console.log(recipes.concat(posts, tips))

      let content = recipes.concat(posts, tips);

      // content = await Promise.all(content.map(async (data) => {
      //   const { id, ...vals } = data;
      //   const currentUserReacted = await this.checkCurrentUserReacted(id, user_id)
      //   return { id, ...vals, currentUserReacted }
      // }))
      // content = [...content].sort(() => Math.random() - 0.5);

      return content
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

      const { user_id } = this.context.user;

      const currentUserReacted = await this.checkCurrentUserReacted(id, user_id)
      return { ...data.dataValues, currentUserReacted }
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getSinglePostById(id) {
    try {
      const data = await this.store.Post.findByPk(id)

      const { user_id } = this.context.user;

      const currentUserReacted = await this.checkCurrentUserReacted(id, user_id)

      return { ...data.dataValues, currentUserReacted }
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getSingleTipsById(id) {
    try {
      const data = await this.store.Tips.findByPk(id)
      const { user_id } = this.context.user;

      const currentUserReacted = await this.checkCurrentUserReacted(id, user_id)

      return { ...data.dataValues, currentUserReacted }

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
    } catch (error) {
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

  


  async reactToContent(id) {
    if (!this.context.user) {
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
    }

    const { user_id } = this.context.user;

    try {
      // const reactedBefore = await this.store.ContentReact.findOne({
      //   where: {
      //     contentId: id,
      //     user_id
      //   }
      // })

      // if (reactedBefore !== null) return { message: 'Already reacted' }

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
      error({ badge: true, message: "error" })
      throw new Error(err)
    }
  }



  

  async unReactToContent(id) {
    if (!this.context.user) {
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
    }

    const { user_id } = this.context.user;

    try {
      // const reactedBefore = await this.store.ContentReact.findOne({
      //   where: {
      //     contentId: id,
      //     user_id
      //   }
      // })

      // if (reactedBefore === null) return { message: 'user not reacted' }

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
    } catch (err) {
      console.log(err)
      error({ badge: true, message: "error" })
      throw new Error(err)
    }
  }

  /**
   * check whether content already save by user id
   * */
  async isContentSavedByUser(contentId, user_id) {
    await this.store.SavedContent.findOne({
      where: {
        contentId,
        user_id
      }
    }).then(data => {
      return !!data;
    });
  }

  /**
   * @apiNote: user save content as favorite
   * */
  async contentSaved(saveData) {
    const { user_id } = this.context.user;
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }
    const isSaved = await this.isContentSavedByUser(saveData.contentId, user_id);
    if (!isSaved) {
      try {
        const savedContent = new this.store.SavedContent(saveData);
        savedContent.user_id = user_id
        const savedResponse = await savedContent.save()
        const { dataValues: { id } } = savedResponse;

        success({ badge: true, message: "Content Saved!" })
        return savedResponse.dataValues;
      } catch (err) {
        error({ badge: true, message: err.message })
        throw new Error(err.message)
      }
    } else {
      error({ badge: true, message: 'contentSaved{} -> Already saved' })
      return 'Already saved';
    }
  }

  /**
   * @apiNote: get saved contented by user id and content id
   * @param contentId user can provide or not content id
   * */
  async searchContentSaved(contentId) {
    const { user_id } = this.context.user;
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }
    try {
      let query;
      if (contentId) {
        query = { where: { contentId: contentId, user_id: user_id }, order: [['createdAt', 'DESC']] };
      } else {
        query = { where: { user_id: user_id }, order: [['createdAt', 'DESC']] };
      }
      const { dataValues: savedContents } = await this.store
        .SavedContent
        .findAll(query)
      return savedContents;
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  /**
   * @apiNote: deleteContentByContentIDAndUserID
   * @param contentID
   * */
  async deleteContentById(contentID) {
    const { user_id } = this.context.user;
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }
    await this.store.ContentDetail.findOne({
      where: {
        contentID,
        user_id
      }
    }).then(async contentDetail => {
      if (contentDetail) {
        const { dataValues: { contentId, contentType } } = contentDetail;
        if (contentType === "recipe") {
          await this.deleteRecipe(contentId);
        } else if (contentType === "post") {
          await this.deletePost(contentId);
        } else if (contentType === "tips") {
          await this.deleteTip(contentId);
        }
        await contentDetail.destroy();
        success({ badge: true, message: 'deleteContentById{} -> Content delete success, Id:' + contentID })
        return 'Content delete success';
      } else {
        error({ badge: true, message: 'deleteContentById{} -> Invalid content id :' + contentID })
        throw new Error('Invalid content id :' + contentID)
      }
    });
  }

  /**
   * @apiNote delete Post by id
   * */
  async deletePost(contentID) {
    const { user_id } = this.context.user;
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }
    await this.store.Post.findOne({
      where: {
        contentID,
        user_id
      }
    }).then(contentDetail => {
      if (contentDetail) {
        contentDetail.destroy();
        success({ badge: true, message: 'deletePost{} -> Post delete success, Id:' + contentID })
        return 'Post delete success';
      } else {
        error({ badge: true, message: 'deletePost{} -> Invalid content id :' + contentID })
        throw new Error('Invalid content id :' + contentID)
      }
    });
  }

  /**
   * @apiNote delete Post by id
   * */
  async deleteTip(contentID) {
    const { user_id } = this.context.user;
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }
    await this.store.Tips.findOne({
      where: {
        contentID,
        user_id
      }
    }).then(contentDetail => {
      if (contentDetail) {
        contentDetail.destroy();
        success({ badge: true, message: 'deleteTips{} -> Tips delete success, Id:' + contentID })
        return 'Tips delete success';
      } else {
        error({ badge: true, message: 'deleteTip{} -> Invalid content id :' + contentID })
        throw new Error('Invalid content id :' + contentID)
      }
    });
  }

  /**
   * @apiNote delete Post by id
   * */
  async deleteRecipe(contentID) {
    const { user_id } = this.context.user;
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }
    await this.store.Recipe.findOne({
      where: {
        contentID,
        user_id
      }
    }).then(contentDetail => {
      if (contentDetail) {
        contentDetail.destroy();
        success({ badge: true, message: 'deleteRecipe{} -> Recipe delete success, Id:' + contentID })
        return 'Recipe delete success';
      } else {
        error({ badge: true, message: 'deleteRecipe{} -> Invalid content id :' + contentID })
        throw new Error('Invalid content id :' + contentID)
      }
    });
  }

  /**
   * @ApiNode Get content by user id
   * */
  async getContentByUserId({ pageSize, after }) {

    const { user_id } = this.context.user;
    if (!this.context.user) {
      error({ badge: true, message: 'User not logged in' })
      throw new Error('Error! User is not logged in');
    }
    try {
      const allContent = await this.store.ContentDetail.findAll({
        where: { user_id },
        order: [['createdAt', 'DESC']],
      });
      const slicedContent = allContent.slice(after, after + pageSize).map(data => data.dataValues)
      let hasMore = false;

      if (slicedContent.length + after < allContent.length) hasMore = true

      const recipeIds = slicedContent.filter(data => data?.contentType === "recipe").map(data => data?.contentId)
      const postIds = slicedContent.filter(data => data?.contentType === "post").map(data => data.contentId)
      const tipsIds = slicedContent.filter(data => data?.contentType === "tips").map(data => data.contentId)

      const recipes = await this.getRecipesByIds({ contentIds: recipeIds })
      const posts = await this.getPostsByIds({ contentIds: postIds })
      const tips = await this.getTipsByIds({ contentIds: tipsIds })

      let content = recipes.concat(posts, tips);
      content = await Promise.all(content.map(async (data) => {
        const { id, ...vals } = data;
        const currentUserReacted = await this.checkCurrentUserReacted(id, user_id)
        return { id, ...vals, currentUserReacted }
      }))

      return { content, hasMore };
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }
}

export default ContentAPI;