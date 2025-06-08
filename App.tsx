import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './src/apollo/client';
import UserListScreen from './src/screens/UserListScreen';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <UserListScreen />
    </ApolloProvider>
  );
};

export default App;
