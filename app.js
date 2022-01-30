import express from "express"
import { ApolloServer } from "apollo-server-express"
import typeDefs from "./app/graphql/schemas/auth.js"
import authResolvers from "./app/graphql/resolvers/auth.js"
import db from "./app/models/index.js"
const app = express()
app.use(express.urlencoded({extended: true}))


async function startApolloServer() {
  console.log("app starting.......")
  const app = express();
  const httpServer = http.createServer(app);
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
    authResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}