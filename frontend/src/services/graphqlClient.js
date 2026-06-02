/**
 * Cliente GraphQL para comunicación con el backend
 * ISO/IEC 25022: Capa de comunicación centralizada
 */

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/graphql';

const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  } catch (error) {
    console.error('Error al obtener token:', error);
    return { headers };
  }
});

const httpLink = new HttpLink({
  uri: API_URL,
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
  },
});

export default client;
