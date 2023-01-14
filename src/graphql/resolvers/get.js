import {paginateResults} from "../../models/index.js";
import {TipAPI} from "../../datasources/get/index.js";

export default {
    Query: {
        /**
         * @param pageSize - page size
         * @param after - cursor result to check whether user come to bottom of the page
         * @return returnResponse get all tips wih pagination
         * */
        getAllTips: async (_, {pageSize = 20, after}, {dataSources}) => {
            const allTips = await dataSources.TipAPI.getAllTip();
            allTips.reverse();

            const paginatedAllTips = paginateResults({
                after,
                pageSize,
                results: allTips,
            });
            return returnResponse({
                status: true,
                code: 200,
                message: 'All Content get Success',
                data: paginatedAllTips,
                cursor: paginatedAllTips.length ? paginatedAllTips[paginatedAllTips.length - 1].cursor : null,
                hasMore: paginatedAllTips.length
                    ? paginatedAllTips[paginatedAllTips.length - 1].cursor !==
                    paginatedAllTips[paginatedAllTips.length - 1].cursor
                    : false,
            })
        },

        /**
         * @param pageSize - page size
         * @param after - cursor result to check whether user come to bottom of the page
         * @return returnResponse get all Recipe wih pagination
         * */
        getAllRecipes: async (_, {pageSize = 20, after}, {dataSources}) => {
            console.log("dataSources", dataSources)
            const allRecipe = await  dataSources.RecipeAPI.getAllRecipe();
            console.log(allRecipe)
            allRecipe.reverse();

            const paginatedAllRecipe = paginateResults({
                after,
                pageSize,
                results: allRecipe,
            });
            return returnResponse({
                status: true,
                code: 200,
                message: 'All Content get Success',
                data: paginatedAllRecipe,
                cursor: paginatedAllRecipe.length ? paginatedAllRecipe[paginatedAllRecipe.length - 1].cursor : null,
                hasMore: paginatedAllRecipe.length
                    ? paginatedAllRecipe[paginatedAllRecipe.length - 1].cursor !==
                    paginatedAllRecipe[paginatedAllRecipe.length - 1].cursor
                    : false,

            })
        },
    }
}
const returnResponse = ({
                            status,
                            code,
                            message,
                            data,
                            cursor,
                            hasMore
                        }) => {
    return {
        status: status,
        code: code,
        message: message,
        data: data,
        cursor: cursor,
        hasMore: hasMore
    }
};