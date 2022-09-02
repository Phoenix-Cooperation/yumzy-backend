import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";


export default {
  Mutation: {
    createRecipe: async (_, { recipeInput }, { dataSources }) => {
      try {
        const recipe = await dataSources.PostAPI.createRecipe(recipeInput)
      } catch (error) {
        throw new ErrorResponse({ message: 'Cannot create recipe'})
      }

      return recipe;
    },
    createTips: async (_, { tipsInput }, { dataSources }) => {
      try {
        const tips = await dataSources.PostAPI.createTips(tipsInput)
      } catch (error) {
        throw new ErrorResponse({ message: 'Cannot create tips'})
      }
      return tips;
    },

    createPost: async (_, { postInput }, { dataSources }) => {
      try {
        const post = await dataSources.PostAPI.createPost(postInput)
        
      } catch (error) {
        throw new ErrorResponse({ message: 'Cannot create post'})
      }
      return post;
    }
  }
}