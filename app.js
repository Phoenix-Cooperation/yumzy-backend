import console from 'consola';
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {typeDefs, resolvers} from "./app/graphql/index.js";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import initializeDB from "./app/middleware/initializeDB.js";
import http from "http";
import admin from "./app/config/firebase/firebase-config.js";
import {PORT, IN_PROD} from "./app/config/constant/index.js";
import * as AppModels from "./app/models/mainModels.js";
import db from './app/config/db/database.js';

const {error, success} = console;

const app = express();
app.use(express.urlencoded({extended: true}));

initializeDB().then();

async function startApolloServer() {
    try {
        console.log("app starting.......")
        const app = express();
        const httpServer = http.createServer(app);
        const server = new ApolloServer({
            // context: async ({req}) => {
            //   const auth = req.headers && req.headers.authorization || '';
            //   if (auth) {
            //     const idToken = auth.split(" ")[1];
            //
            //     admin
            //         .auth()
            //         .verifyIdToken(idToken)
            //         .then(function (decodedTOken) {
            //           console.log(decodedTOken)
            //         })
            //         .catch(error => console.log(error))
            //   }
            // },
            typeDefs,
            resolvers,
            plugins: [IN_PROD ? ApolloServerPluginLandingPageGraphQLPlayground() : ApolloServerPluginLandingPageDisabled(),
                ApolloServerPluginDrainHttpServer({httpServer})],
            context: {
                ...AppModels
            }
        });

        await db.authenticate()
            .then(() => success({
                badge: true,
                message: `DATABASE CONNECTION SUCCESSFULLY`,
            }))
            .catch(err => {
                error({
                    badge: true,
                    message: `ERROR :${err}`
                });
            });

        await server.start();
        server.applyMiddleware({app});
        await new Promise(resolve => httpServer.listen({port: PORT}, resolve));
        success({
            badge: true,
            message: `🚀 Server ready at http://localhost:3000${server.graphqlPath}`,
        })
    } catch (err) {
        error({
            badge: true,
            message: err.message
        });
    }
}

startApolloServer().then();
