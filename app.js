import express from "express"
import { ApolloServer } from "apollo-server-express"
import typeDefs from "./app/graphql/schemas/index.js"
import authResolvers from "./app/graphql/resolvers/index.js"
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import initializeDB from "./app/middleware/initializeDB.js"
import http from 'http';
import admin from "./app/config/firebase/firebase-config.js"
const app = express()
app.use(express.urlencoded({extended: true}))

initializeDB();

async function startApolloServer() {
  try {
    console.log("app starting.......")
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      context: async ({req}) => {
        const auth = req.headers && req.headers.authorization || '';
        if (auth) {
          const idToken = auth.split(" ")[1];

          admin
              .auth()
              .verifyIdToken(idToken)
              .then(function (decodedTOken) {
                console.log(decodedTOken)
              })
              .catch(error => console.log(error))
        }
      },
      typeDefs,
      authResolvers,
      plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
    });

    await server.start();
    server.applyMiddleware({app});
    await new Promise(resolve => httpServer.listen({port: 3000}, resolve));
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
  } catch (err) {
    console.log(err);
  }
}
startApolloServer();
