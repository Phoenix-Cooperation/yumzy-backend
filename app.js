//
// import { ApolloServer } from 'apollo-server-express';
// import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
// import express from 'express';
// import http from 'http';
//
// async function startApolloServer(typeDefs, resolvers) {
//   const app = express();
//   const httpServer = http.createServer(app);
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   });
//
//   await server.start();
//   server.applyMiddleware({ app });
//   await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// }
import express from "express"
import bodyParser from "body-parser"
import { ApolloServer } from "apollo-server-express"
import typeDefs from "./app/graphql/schemas/auth.js"
import authResolvers from "./app/graphql/resolvers/auth.js"
import db from "./app/models/index.js"
const app = express()
app.use(bodyParser.json())
const server = new ApolloServer({
  context: async ({ req }) => {
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
  authResolvers
})
server.applyMiddleware({ app, path: "/graphql" })
app.listen(3030, () => {
  console.log("app is listening to port 3030")
})