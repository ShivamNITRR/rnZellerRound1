import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { createAuthLink } from 'aws-appsync-auth-link';
import awsconfig from '../../aws-exports';
import { isLocalServer } from '../Constants/AppConstants';

const LOCAL_URL = 'http://192.168.1.19:9002/';

const url = awsconfig.aws_appsync_graphqlEndpoint;
const region = awsconfig.aws_appsync_region;
const auth = {
  type: 'API_KEY' as const,
  apiKey: awsconfig.aws_appsync_apiKey,
};

const httpLink = new HttpLink({ uri: isLocalServer ? LOCAL_URL : url });

const client = new ApolloClient({
  link: createAuthLink({ url, region, auth }).concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

