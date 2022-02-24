import {ApolloError} from "apollo-server-express";
import bcryptjs from 'bcryptjs';
const {hash, compare} = bcryptjs;
import {ErrorResponse} from "../../util/errorHandler/errorResponse.js";

export default {
    Query: {
        getAllUsers: async (_, {},
                            {
                                UserContent
                            }) => {
            try {

                let result = await UserContent.findAll();

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
        authenticateLoginUser: async (_,
                                      {
                                          username,
                                          email
                                      },
                                      {
                                          UserContent
                                      }) => {
            try {
                let user = await UserContent.findOne({where: {username: username}});
                if (!user) {
                    throw new ErrorResponse({message: 'User name not found', code: 403});
                }

                if (email !== user.email) {
                    throw new ErrorResponse({message: 'Invalid Email', code: 403});
                }

                user = user.dataValues;
                return returnResponse({
                    status: true,
                    code: 200,
                    message: "success",
                    data: user
                });

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

        createUser: async (_,
                           {
                               userData
                           },
                           {
                               UserContent
                           }
        ) => {

            let {username, email} = userData;
            let user;

            try {
                user = await UserContent.findOne({where: {username: username}});
                if (user) {
                    throw new ErrorResponse({message: "User name is already taken", code: 403});
                }

                user = await UserContent.findOne({where: {email: email}});
                if (user) {
                    throw new ErrorResponse({message: "Email is already taken", code: 403});
                }
                user = new UserContent(userData);
                let result = await user.save();
                result = result.dataValues;

                return result;

            } catch (e) {
                throw new ErrorResponse({message: e.message, code: 403});
            }
        }
    }
}

const returnResponse = ({status, code, message, data}) => {
    return {
        status: status,
        code: code,
        message: message,
        data: data
    };
}
