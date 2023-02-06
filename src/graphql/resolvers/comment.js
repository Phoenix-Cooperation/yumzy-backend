import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";

export default {
  Query: {
    getComments: async (_, { contentId }, { dataSources }) => {
      let comments = await dataSources.CommentAPI.getComments(contentId);
      
      comments = await Promise.all(comments.map(async (comment) => {
        const { user: { user_id }, user, ...vals} = comment;
        const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
        return {...vals, user: { ...user, photoURL }} 
      }))
      
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