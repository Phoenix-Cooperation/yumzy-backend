import { ErrorResponse } from "../../util/errorHandler/errorResponse.js";

export default {
  Query: {
    getAllUsers: async (_, {}, { dataSources }) => {
        const { sqlDataSource } = dataSources;
        try {

            let result = await sqlDataSource.UserModel.findAll();

            if (!result) {
                throw new ErrorResponse({message: 'Can not find values', code: 403});
            }

            return returnResponse(
                {
                    status: true,
                    code: 200,
                    message: 'success',
                    data: result
                }
            );
        } catch (e) {
            throw new ErrorResponse({message: e.message, code: 403});
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

    createUser: async (_, { userData }, { dataSources }) => {

      let { user_id } = userData;
      let user;
      const { sqlDataSource } = dataSources;
      try {
        user = await sqlDataSource.UserModel.findOne({ where: { user_id } });
        if (user) {
          throw new ErrorResponse({ message: "User name is already taken", code: 403 });
        }

        // user = new UserContent(userData);
        user = new sqlDataSource.UserModel(userData);
        let result = await user.save();
        result = result.dataValues;

        return result;

      } catch (e) {
        throw new ErrorResponse({ message: e.message, code: 403 });
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
