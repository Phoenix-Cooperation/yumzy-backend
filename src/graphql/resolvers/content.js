import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";


export default {
  Query: {
    getContent: async (_, {pageSize = 20, after = 0 }, { dataSources }) => {
      try {
        const content = await dataSources.ContentAPI.getContent({ pageSize, after })
        console.log(content, "query")
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
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create recipe: ${error.message}`})
      }

      return recipe;
    },
    createTips: async (_, { tipsInput }, { dataSources }) => {
      try {
        const tips = await dataSources.ContentAPI.createTips(tipsInput)
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create tips: ${error.message}`})
      }
      return tips;
    },

    createPost: async (_, { postInput }, { dataSources }) => {
      try {
        const post = await dataSources.ContentAPI.createPost(postInput)
        
      } catch (error) {
        throw new ErrorResponse({ message: `Cannot create post: ${error.message}`})
      }
      return post;
    },
  }
}