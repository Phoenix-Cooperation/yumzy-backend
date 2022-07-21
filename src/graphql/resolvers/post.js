import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";


export default {
    Mutation: {
        createRecipe: async (_, args, { dataSources }) => {
            console.log("resolver", args);
            const { recipeInput } = args
            const recipe = await dataSources.PostAPI.createRecipePost(recipeInput)
            console.log("resolver", recipe)
            return recipe;
        }
    }
}