const express = require('express');
const path = require('path');
const db = require('./config/connection');
//leave these for now, but!!
// TODO: remove this once front end refactor is complete.
const routes = require('./routes');
//import the auth middleware here so we can have context.
const { authMiddleware } = require('./utils/auth')
//Add apollo server here.
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas')

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
//so while I test, if we have routes set
if (routes) {
  //use the routes if we have them.
  app.use(routes);
  //if not, use apollo.
} else {
  //if we use apollo, just serve the front end.  This line is technically too long but looks way better like this.
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/buildindex.html')));
}
//Create Apollo server instance.  maybe we can just do this without the const, and inline it?  I'll try after it all works.
// TODO: make this slicker.
const startApolloServer = async ( typeDefs, resolvers ) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(` Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
}
// I don't think I actually need to do all this?  I think I'll leave it for now.
startApolloServer(typeDefs, resolvers);