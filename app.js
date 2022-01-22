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
import typeDefs from "./typedef"
import resolvers from "./resolver"
const app = express()
app.use(bodyParser.json())
const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  formatError: error => {
    return error
  },
  context: ({ req, res }) => {
    return {
      req,
      res,
    }
  },
})
server.applyMiddleware({ app, path: "/graphql" })
app.listen(3030, () => {
  console.log("app is listening to port 3030")
})