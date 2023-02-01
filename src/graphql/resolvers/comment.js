import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";

export default {
  Query: {

  },
  Mutation: {
    addComment: async (_, { comment, contentId }, { dataSources }) => {
      const message = await dataSources.CommentAPI.addComment(comment, contentId);
      return message;
    }
  },
}