import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";


export default {
  Mutation: {
    createRecipe: async (_, { recipeInput }, { dataSources }) => {
      const recipe = await dataSources.PostAPI.createRecipe(recipeInput)
      console.log("resolver", recipe)
      return recipe;
    },
    createTips: async (_, { tipsInput }, { dataSources }) => {
      const tips = await dataSources.PostAPI.createTips(tipsInput)
      return tips;
    },
    createPost: async (_, { postInput }, { dataSources }) => {
      const post = await dataSources.PostAPI.createPost(postInput)
      return post;
    }
  }
}