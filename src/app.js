import console from 'consola';
import express from "express";
import {ApolloServer, gql, ApolloError, AuthenticationError} from "apollo-server-express";
import {typeDefs, resolvers} from "./graphql/index.js";

// import initializeDB from "./app/middleware/initializeDB.js";
import http from "http";
import admin from "./config/firebase/firebase-config.js";
import {PORT, IN_PROD} from "./config/constant/index.js";
import * as AppModels from "./models/mainModels.js";
import {createStore} from "./models/index.js";
import UserAPI from "./datasources/user.js";
import ContentAPI from "./datasources/content.js";
import RecipeAPI from './datasources/get/recipe.js';
import TipAPI from './datasources/get/tip.js';
import PostContentAPI from "./datasources/get/PostContent.js";

const {error, success} = console;

const app = express();
app.use(express.urlencoded({extended: true}));

// initializeDB().then();
// const store = createStore();


let store = createStore();

const dataSources = () => ({
    UserAPI: new UserAPI({store}),
    ContentAPI: new ContentAPI({store}),
    RecipeAPI: new RecipeAPI({store}),
    TipAPI: new TipAPI({store}),
    PostContentAPI: new PostContentAPI({store}),
});

async function startApolloServer() {
    try {
        console.log("app starting.......")
        const app = express();
        const httpServer = http.createServer(app);
        // const store = createStore();
        const server = new ApolloServer({
            context: async ({req}) => {
                let user;
                const auth = req.headers && req.headers.authorization || '';
                // console.log(auth)
                if (auth) {
                    const idToken = auth.split(" ")[1];
                    if (idToken) {
                        await admin
                            .auth()
                            .verifyIdToken(idToken)
                            .then(function (decodedToken) {
                                console.log(decodedToken)
                                // success({badge: true, message: `decodedToken`});
                                const {name, user_id} = decodedToken
                                user = {name, user_id};
                                // console.log(user, "user")

                            })
                            .catch((err) => {
                                error({badge: true, message: err})
                                throw new AuthenticationError(err.message);
                            })

                    }
                }
                // console.log(user, "after")
                return {user};
            },
            typeDefs,
            resolvers,
            dataSources
        });

        try {
            await store.db.authenticate();
            success({badge: true, message: "connected to db successfully"})
        } catch (e) {
            error({badge: true, message: e.message})
        }

        await server.start();
        server.applyMiddleware({app});
        await new Promise(resolve => httpServer.listen({port: PORT}, resolve));
        success({
            badge: true,
            message: `🚀 Server ready at http://localhost:5000${server.graphqlPath}`,
        })
    } catch (err) {
        error({
            badge: true,
            message: err.message
        });
    }
}

startApolloServer();
