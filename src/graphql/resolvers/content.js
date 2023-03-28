import {ErrorResponse} from "../../util/errorHandler/errorResponse.js";

export default {
  Query: {
    getContent: async (_, { pageSize = 20, after = 0 }, { user: { user_id }, dataSources }) => {

      // const cachedContent = await dataSources.RedisCache.getContentCache(user_id, pageSize, after)
      // // console.log(cachedContent)
      // if (cachedContent) {
      //   console.log("returning content from cache")
      //   return cachedContent;
      // }

      try {
        let { slicedContent, hasMore } = await dataSources.ContentAPI.getPaginatedContentDetail({ pageSize, after })
        // console.log(slicedContent)

        let { content, notInCache } = await dataSources.RedisCache.getContentFromCache(slicedContent)

        // console.log("notInCache", notInCache, "content", content)
        if (notInCache.length > 0) {
          let notInCacheContent = await dataSources.ContentAPI.getContent(notInCache)

          notInCacheContent = await Promise.all(notInCacheContent.map(async (data) => {
            const { user: { user_id }, user, id, ...val } = data
            const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);

            const commentCount = await dataSources.CommentAPI.getCommentCountForPost(id)
            const temp = { ...val, id, user: { ...user, photoURL }, commentCount }
            await dataSources.RedisCache.setContentToCache(temp)
            return temp
          }))
          content = [...content, ...notInCacheContent]



        }

        content = await Promise.all(content.map(async (data) => {
          const { id, ...vals } = data;
          const currentUserReacted = await dataSources.ContentAPI.checkCurrentUserReacted(id, user_id)
          return { id, ...vals, currentUserReacted }
        }))
        content = [...content].sort(() => Math.random() - 0.5);
        return { content, hasMore }
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot get content: ${error.message}` })
      }
    },
    getRecipeById: async (_, { id }, { dataSources }) => {
      const recipe = await dataSources.ContentAPI.getSingleRecipeById(id);
      let comments = await dataSources.CommentAPI.getComments(recipe.id);

      comments = await Promise.all(comments.map(async (comment) => {
        const { user: { user_id }, user, ...vals } = comment;
        const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
        return { ...vals, user: { ...user, photoURL } }
      }))

      const commentCount = comments.length;

      return { ...recipe, comments, commentCount }
    },
    getPostById: async (_, { id }, { dataSources }) => {
      const post = await dataSources.ContentAPI.getSinglePostById(id);
      let comments = await dataSources.CommentAPI.getComments(recipe.id);

      comments = await Promise.all(comments.map(async (comment) => {
        const { user: { user_id }, user, ...vals } = comment;
        const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
        return { ...vals, user: { ...user, photoURL } }
      }))

      const commentCount = comments.length

      return { ...post, comments, commentCount };
    },
    getTipsById: async (_, { id }, { dataSources }) => {
      const tips = await dataSources.ContentAPI.getSingleTipsById(id);
      let comments = await dataSources.CommentAPI.getComments(recipe.id);

      comments = await Promise.all(comments.map(async (comment) => {
        const { user: { user_id }, user, ...vals } = comment;
        const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
        return { ...vals, user: { ...user, photoURL } }
      }))

      const commentCount = comments.length
      return { ...tips, comments, commentCount };
    },
    searchContentSaved: async (_, { contentId }, { dataSources }) => {
      return await dataSources.ContentAPI.searchContentSaved(contentId);
    },
    getContentUserId: async (_, {}, { user: { user_id }, dataSources }) => {
      try {
        let { content, hasMore }= await dataSources.ContentAPI.getContentByUserId();

        content = await Promise.all(content.map(async (data) => {
          const { user: { user_id }, user, id,  ...val } = data
          const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);

          const commentCount = await dataSources.CommentAPI.getCommentCountForPost(id)
          return {...val, id,  user: { ...user, photoURL }, commentCount }
        }));
        return { content, hasMore }
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot get content: ${error.message}`})
      }
    },
    checkUserSavedContent: async(_,{ contentId }, { dataSources }) => {
      console.log(contentId)
      const res = await dataSources.ContentAPI.checkUserSavedContent(contentId)
      console.log(res)
      return { message: res }
    }
  },
  Mutation: {
    createRecipe: async (_, { recipeInput }, { dataSources }) => {
      try {
        const recipe = await dataSources.ContentAPI.createRecipe(recipeInput)
        return recipe;
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create recipe: ${error.message}` })
      }

    },
    createTips: async (_, { tipsInput }, { dataSources }) => {
      try {
        const tips = await dataSources.ContentAPI.createTips(tipsInput)
        return tips;
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create tips: ${error.message}` })
      }
    },

    createPost: async (_, { postInput }, { dataSources }) => {
      try {
        const post = await dataSources.ContentAPI.createPost(postInput)
        return post;
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create post: ${error.message}` })
      }
    },

    reactToContent: async (_, { contentId }, { dataSources }) => {
      const message = await dataSources.ContentAPI.reactToContent(contentId);

      if (message.message === "success") {
        const content = await dataSources.RedisCache.getSingleContent(contentId)
        if (content) {
          content.reactCount += 1
          // content.currentUserReacted = true
          await dataSources.RedisCache.setContentToCache(content)
        }
      }

      return message;
    },

    unReactToContent: async (_, { contentId }, { dataSources }) => {
      const message = await dataSources.ContentAPI.unReactToContent(contentId);

      if (message.message === "success") {
        const content = await dataSources.RedisCache.getSingleContent(contentId)
        if (content) {
          console.log("updating cache")
          content.reactCount -= 1
          // content.currentUserReacted = false
          await dataSources.RedisCache.setContentToCache(content)
        }
      }
      return message;
    },
    contentSaved: async (_, { contentSaveInput }, { dataSources }) => {
      try {
        return await dataSources.ContentAPI.contentSaved(contentSaveInput);
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot save content: ${error.message}`})
      }
    },
    contentUnsaved: async (_, { contentSaveInput }, { dataSources }) => {
      return await dataSources.ContentAPI.contentUnsaved(contentSaveInput);
    },
    deleteContentById: async (_, { contentID }, { dataSources }) => {
      try {
        return await dataSources.ContentAPI.deleteContentById(contentID);
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot save content: ${error.message}`})
      }
    }
  }
}