import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import client from '../services/graphqlClient';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  CHANGE_PASSWORD_MUTATION,
  UPDATE_USER_MUTATION,
  VERIFY_TOKEN_QUERY,
  GET_USER_QUERY,
  LIST_USERS_QUERY,
  ACTIVATE_USER_MUTATION,
  DEACTIVATE_USER_MUTATION,
  DELETE_USER_MUTATION,
} from '../services/graphqlQueries';

const normalizeRole = (role) => (role ? String(role).toLowerCase() : role);
const normalizeUser = (user) => (user ? { ...user, role: normalizeRole(user.role) } : null);

const extractError = (error) =>
  error?.graphQLErrors?.[0]?.message || error?.networkError?.message || error?.message || 'Error desconocido';

export const useAuthStore = create((set, get) => ({
  isLoading: true,
  isSignedIn: false,
  user: null,
  token: null,
  error: null,

  restoreSession: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 <= Date.now()) {
        localStorage.removeItem('auth_token');
        set({ isLoading: false });
        return;
      }
      const { data } = await client.query({
        query: VERIFY_TOKEN_QUERY,
        variables: { token },
        fetchPolicy: 'network-only',
      });
      if (!data?.verifyToken?.valid) {
        localStorage.removeItem('auth_token');
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
    } catch {
      localStorage.removeItem('auth_token');
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    set({ error: null });
    try {
      const { data, errors } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: { email: email.trim().toLowerCase(), password } },
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      const result = data?.login;
      if (!result?.success || !result?.accessToken) {
        const msg = result?.message || 'Credenciales inválidas';
        set({ error: msg });
        throw new Error(msg);
      }

      localStorage.setItem('auth_token', result.accessToken);
      set({
        isSignedIn: true,
        token: result.accessToken,
        user: normalizeUser(result.user),
        error: null,
      });
    } catch (error) {
      const msg = extractError(error);
      set({ error: msg });
      throw new Error(msg);
    }
  },

  signUp: async (email, username, password, fullName) => {
    set({ error: null });
    const { data } = await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: { input: { email, username, password, fullName } },
    });
    const result = data?.register;
    if (!result?.success) {
      const msg = result?.message || 'No se pudo registrar';
      set({ error: msg });
      throw new Error(msg);
    }
  },

  signOut: () => {
    localStorage.removeItem('auth_token');
    set({ isSignedIn: false, user: null, token: null, error: null });
  },

  requestPasswordReset: async (email) => {
    const { data } = await client.mutate({
      mutation: REQUEST_PASSWORD_RESET_MUTATION,
      variables: { input: { email } },
    });
    return data?.requestPasswordReset?.message;
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    const { data } = await client.mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: { userId, input: { currentPassword, newPassword } },
    });
    const result = data?.changePassword;
    if (!result?.success) throw new Error(result?.message || 'Error al cambiar contraseña');
    return result.message;
  },

  updateProfile: async (userId, fullName, email, username) => {
    const { data } = await client.mutate({
      mutation: UPDATE_USER_MUTATION,
      variables: { userId, input: { fullName, email, username } },
    });
    const result = data?.updateUser;
    if (!result?.success) throw new Error(result?.message || 'Error al actualizar');
    const updated = normalizeUser(result.user);
    if (get().user?.id === userId) set({ user: updated });
    return updated;
  },

  listUsers: async (skip = 0, limit = 100) => {
    const { data } = await client.query({
      query: LIST_USERS_QUERY,
      variables: { skip, limit },
      fetchPolicy: 'network-only',
    });
    const users = (data?.listUsers?.users || []).map(normalizeUser);
    return { total: data?.listUsers?.total ?? users.length, users };
  },

  activateUser: async (userId) => {
    const { data } = await client.mutate({ mutation: ACTIVATE_USER_MUTATION, variables: { userId } });
    if (!data?.activateUser?.success) throw new Error(data?.activateUser?.message);
  },

  deactivateUser: async (userId) => {
    const { data } = await client.mutate({ mutation: DEACTIVATE_USER_MUTATION, variables: { userId } });
    if (!data?.deactivateUser?.success) throw new Error(data?.deactivateUser?.message);
  },

  deleteUser: async (userId) => {
    const { data } = await client.mutate({ mutation: DELETE_USER_MUTATION, variables: { userId } });
    if (!data?.deleteUser?.success) throw new Error(data?.deleteUser?.message);
  },

  clearError: () => set({ error: null }),
}));
