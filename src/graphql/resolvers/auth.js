import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";

export default {
  Query: {
    getAllUsers: async (_, {}, { dataSources }) => {
        const { UserAPI } = dataSources;
        const users = await UserAPI.getAllUsers();
        if (users) {
          return returnResponse({
            status: true,
            code: 200,
            message: 'success',
            data: users
          })
        } else {
          throw new ErrorResponse({ message: 'Cannot get users'})
        }
    },
  },

  Mutation: {
    testMutation: async (_, args, context, info) => {
      console.log("_", _);
      console.log("AGRS", args);
      console.log("CONTEXT", context);
      console.log("INFO", info);
      return "Test Mutation";
    },

    createUser: async (_, { username, email, user_id }, { dataSources }) => {

      console.log("create user")
      const user = await dataSources.UserAPI.createOrFindUser({ username, email, user_id });
      if (user) {
        return user;
      } else {
        throw new ErrorResponse({ message: "User Already exists or cannot create user"})
      }
    }
  }
}

const returnResponse = ({ status, code, message, data }) => {
  return {
    status: status,
    code: code,
    message: message,
    data: data
  };
}
