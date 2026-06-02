/**
 * Auth Store - Gestión de estado de autenticación
 * ISO/IEC 25022: Manejo centralizado de estado
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';
import client from '../services/graphqlClient';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
  CHANGE_PASSWORD_MUTATION,
  UPDATE_USER_MUTATION,
  VERIFY_TOKEN_QUERY,
  GET_USER_QUERY,
  LIST_USERS_QUERY,
  ACTIVATE_USER_MUTATION,
  DEACTIVATE_USER_MUTATION,
  DELETE_USER_MUTATION,
} from '../services/graphqlQueries';

const normalizeRole = (role) => {
  if (!role) return role;
  return String(role).toLowerCase();
};

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    role: normalizeRole(user.role),
  };
};

const extractGraphQLError = (error) => {
  if (error?.graphQLErrors?.length) {
    return error.graphQLErrors[0].message;
  }
  if (error?.networkError?.message) {
    return error.networkError.message;
  }
  return error?.message || 'Error desconocido';
};

const useAuthStore = create((set, get) => ({
  isLoading: true,
  isSignedIn: false,
  user: null,
  token: null,
  error: null,

  restoreToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');

      if (!token) {
        set({ isLoading: false });
        return;
      }

      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 <= Date.now()) {
        await SecureStore.deleteItemAsync('auth_token');
        set({ isLoading: false });
        return;
      }

      const { data } = await client.query({
        query: VERIFY_TOKEN_QUERY,
        variables: { token },
        fetchPolicy: 'network-only',
      });

      if (!data?.verifyToken?.valid) {
        await SecureStore.deleteItemAsync('auth_token');
        set({ isLoading: false });
        return;
      }

      const userId = data.verifyToken.userId;
      const userResult = await client.query({
        query: GET_USER_QUERY,
        variables: { userId },
        fetchPolicy: 'network-only',
      });

      set({
        isSignedIn: true,
        token,
        user: normalizeUser(userResult.data?.getUser),
        isLoading: false,
      });
    } catch (error) {
      console.error('Error restaurando token:', error);
      await SecureStore.deleteItemAsync('auth_token').catch(() => {});
      set({ isLoading: false });
    }
  },

  setUser: (user, token) => {
    set({ user: normalizeUser(user), token });
  },

  signIn: async (email, password) => {
    set({ error: null });
    try {
      const { data, errors } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: { email, password } },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.login;
      if (!result?.success || !result?.accessToken) {
        throw new Error(result?.message || 'Credenciales inválidas');
      }

      await SecureStore.setItemAsync('auth_token', result.accessToken);
      set({
        isSignedIn: true,
        token: result.accessToken,
        user: normalizeUser(result.user),
      });
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  signUp: async (email, username, password, fullName) => {
    set({ error: null });
    try {
      const { data, errors } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          input: { email, username, password, fullName },
        },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.register;
      if (!result?.success) {
        throw new Error(result?.message || 'No se pudo registrar el usuario');
      }
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  signOut: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      set({
        isSignedIn: false,
        user: null,
        token: null,
        error: null,
      });
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  requestPasswordReset: async (email) => {
    set({ error: null });
    try {
      const { data, errors } = await client.mutate({
        mutation: REQUEST_PASSWORD_RESET_MUTATION,
        variables: { input: { email } },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.requestPasswordReset;
      if (!result?.success) {
        throw new Error(result?.message || 'No se pudo procesar la solicitud');
      }

      return result.message;
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ error: null });
    try {
      const { data, errors } = await client.mutate({
        mutation: RESET_PASSWORD_MUTATION,
        variables: { input: { token, newPassword } },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.resetPassword;
      if (!result?.success) {
        throw new Error(result?.message || 'No se pudo resetear la contraseña');
      }

      return result.message;
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    set({ error: null });
    try {
      const { data, errors } = await client.mutate({
        mutation: CHANGE_PASSWORD_MUTATION,
        variables: {
          userId,
          input: { currentPassword, newPassword },
        },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.changePassword;
      if (!result?.success) {
        throw new Error(result?.message || 'No se pudo cambiar la contraseña');
      }

      return result.message;
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  updateProfile: async (userId, fullName, email, username) => {
    set({ error: null });
    try {
      const { data, errors } = await client.mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          userId,
          input: { fullName, email, username },
        },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.updateUser;
      if (!result?.success) {
        throw new Error(result?.message || 'No se pudo actualizar el perfil');
      }

      const updatedUser = normalizeUser(result.user);
      if (get().user?.id === userId) {
        set({ user: updatedUser });
      }

      return updatedUser;
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  fetchUser: async (userId) => {
    try {
      const { data, errors } = await client.query({
        query: GET_USER_QUERY,
        variables: { userId },
        fetchPolicy: 'network-only',
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      return normalizeUser(data?.getUser);
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  listUsers: async (skip = 0, limit = 100) => {
    try {
      const { data, errors } = await client.query({
        query: LIST_USERS_QUERY,
        variables: { skip, limit },
        fetchPolicy: 'network-only',
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const users = (data?.listUsers?.users || []).map(normalizeUser);
      return {
        total: data?.listUsers?.total ?? users.length,
        users,
      };
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  activateUser: async (userId) => {
    try {
      const { data, errors } = await client.mutate({
        mutation: ACTIVATE_USER_MUTATION,
        variables: { userId },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.activateUser;
      if (!result?.success) {
        throw new Error(result?.message || 'No se pudo activar el usuario');
      }

      return result.message;
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  deactivateUser: async (userId) => {
    try {
      const { data, errors } = await client.mutate({
        mutation: DEACTIVATE_USER_MUTATION,
        variables: { userId },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.deactivateUser;
      if (!result?.success) {
        throw new Error(result?.message || 'No se pudo desactivar el usuario');
      }

      return result.message;
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  deleteUser: async (userId) => {
    try {
      const { data, errors } = await client.mutate({
        mutation: DELETE_USER_MUTATION,
        variables: { userId },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.deleteUser;
      if (!result?.success) {
        throw new Error(result?.message || 'No se pudo eliminar el usuario');
      }

      return result.message;
    } catch (error) {
      const message = extractGraphQLError(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
