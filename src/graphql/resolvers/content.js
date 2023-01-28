import { validateSDL } from "graphql/validation/validate.js";
import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";


export default {
  Query: {
    getContent: async (_, {pageSize = 20, after = 0 }, { dataSources }) => {
      try {
        let content = await dataSources.ContentAPI.getContent({ pageSize, after })

        content = await Promise.all(content.map(async (data) => {
          console.log("data", data)
          const { user: { user_id }, user,  ...val } = data
          const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
          return {...val, user: { ...user, photoURL } }
        }))

        return content
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot get content: ${error.message}`})
      }

     
    }
  },
  Mutation: {
    createRecipe: async (_, { recipeInput }, { dataSources }) => {
      try {
        const recipe = await dataSources.ContentAPI.createRecipe(recipeInput)
        return recipe;
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create recipe: ${error.message}`})
      }

    },
    createTips: async (_, { tipsInput }, { dataSources }) => {
      try {
        const tips = await dataSources.ContentAPI.createTips(tipsInput)
        return tips;
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create tips: ${error.message}`})
      }
    },

    createPost: async (_, { postInput }, { dataSources }) => {
      try {
        const post = await dataSources.ContentAPI.createPost(postInput)
        return post;
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create post: ${error.message}`})
      }
    },
  }
}