import {ApolloError} from "apollo-server-express";
import bcryptjs from 'bcryptjs';
const {hash, compare} = bcryptjs;


export default {
    Query: {
        getAllUsers: async (_, {},
                            {
                                UserContent
                            }) => {
            try {

                let result = await UserContent.findAll();

                if (!result) {
                    return returnResponse(
                        {
                            status: false,
                            code: 404,
                            message: 'Can not find values',
                            data: []
                        }
                    );
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
                returnResponse(
                    {
                        status: false,
                        code: 403,
                        message: e.message,
                        data: []
                    }
                );
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
                    return new ApolloError("User name not found", '400');
                }

                if (email !== user.email) {
                    return new ApolloError("Invalid Email", '400');
                }

                user = user.dataValues;
                return returnResponse({
                    status: true,
                    code: 200,
                    message: "success",
                    data: user
                });

            } catch (e) {
                throw new ApolloError(e.message, '403');
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
                    return new ApolloError("User name is already taken", '400');
                }

                user = await UserContent.findOne({where: {email: email}});
                if (user) {
                    return new ApolloError("Email is already taken", '400');
                }
                user = new UserContent(userData);
                let result = await user.save();
                result = result.dataValues;

                return result;

            } catch (e) {
                throw new ApolloError(e.message, '403');
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
