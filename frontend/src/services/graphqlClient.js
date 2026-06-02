/**
 * Cliente GraphQL para comunicación con el backend
 * ISO/IEC 25022: Capa de comunicación centralizada
 */

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/graphql';

/**
 * Link personalizado para agregar token a las peticiones
 */
const authLink = new ApolloLink(async (operation, forward) => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    
    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Error al obtener token:', error);
  }

  return forward(operation);
});

/**
 * Link HTTP para conexión a GraphQL
 */
const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'include',
});

/**
 * Cliente Apollo
 */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
