import {ApolloError} from "apollo-server-express";

export default {
    Query: {
        getAllUsers: async () => {
            return [
                {
                    _id: 2,
                    name: "apple",
                    email: "apple@gmail.com"
                }
            ];
        }
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
            console.log(userData);
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