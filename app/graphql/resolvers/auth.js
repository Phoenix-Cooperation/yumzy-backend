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
                    return passAllUsers(
                        {
                            status: false,
                            code: 404,
                            message: 'Can not find values',
                            data: []
                        }
                    );
                }

                return passAllUsers(
                    {
                        status: true,
                        code: 200,
                        message: 'success',
                        data: result
                    }
                );
            } catch (e) {
                passAllUsers(
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

                let isMatch = await compare(email, user.email);
                if (!isMatch) {
                    return new ApolloError("Invalid Email", '400');
                }

                user = user.dataValues;
                return user;

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
// const authResolvers = {
//     Query: {
//         users: () => {
//             return new Promise((resolve, reject) => {
//                 fetchAllUsers((data) => {
//                     resolve(data);
//                 });
//             });
//         }
//     }
// }
const passAllUsers = ({status, code, message, data}) => {
    return {
        status: status,
        code: code,
        message: message,
        data: data
    };
}
const fetchAllUsers = (callback) => {
    db.collection('users')
        .get()
        .then((item) => {
            const items = [];
            item.docs.forEach(item => {
                console.log('Adding...')
                items.push(item.data())
            });
            return callback(items);
        })
        .catch(e => console.log(e));
}