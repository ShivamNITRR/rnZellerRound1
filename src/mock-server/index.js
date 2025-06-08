import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema'; // ✅ use this instead of addMocksToSchema

import { listZellerCustomers } from './queries/listZellerCustomers.js';
import { getZellerCustomer } from './queries/getZellerCustomer.js';

// Load schema.gql as typeDefs
const typeDefs = await loadSchema('schema.gql', {
  loaders: [new GraphQLFileLoader()],
});

// Define your resolvers
const resolvers = {
  Query: {
    listZellerCustomers,
    getZellerCustomer,
  },
};

// Create the schema with resolvers (not mocks)
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Start the Apollo Server
const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, {
  listen: { port: 9002, host: '192.168.1.19' },
});

console.log(`🚀 Server is running at ${url}`);
