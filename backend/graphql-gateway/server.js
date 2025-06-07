const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const cors = require('cors');

// Inisialisasi express
const app = express();
const PORT = 3008;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'graphql-gateway' });
});

async function startApolloServer() {
  // Inisialisasi Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Konteks yang akan tersedia di semua resolver
      return {
        headers: req.headers,
      };
    },
    introspection: true, // Aktifkan introspection untuk development
    playground: {
      settings: {
        'editor.theme': 'dark',
      },
    }, // Aktifkan GraphQL Playground
  });

  await server.start();
  
  // Terapkan middleware Apollo GraphQL ke Express
  server.applyMiddleware({ app, path: '/graphql' });

  // Mulai server
  app.listen(PORT, () => {
    console.log(`GraphQL Gateway running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch(err => {
  console.error('Error starting server:', err);
});
