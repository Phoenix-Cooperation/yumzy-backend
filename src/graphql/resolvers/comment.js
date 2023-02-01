import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";

export default {
  Query: {
    getComments: async (_, { contentId }, { dataSources }) => {
      const comments = await dataSources.CommentAPI.getComments(contentId);
      
      return comments
    }
  },
  Mutation: {
    addComment: async (_, { comment, contentId }, { dataSources }) => {
      console.log(comment, "comment")
      const message = await dataSources.CommentAPI.addComment(comment, contentId);
      return message;
    }
  },
}