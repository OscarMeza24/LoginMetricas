/**
 * Auth Store - Gestión de estado de autenticación
 * ISO/IEC 25022: Manejo centralizado de estado
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

const useAuthStore = create((set, get) => ({
  isLoading: true,
  isSignedIn: false,
  user: null,
  token: null,
  error: null,

  /**
   * Restaura sesión al iniciar la app
   */
  restoreToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Verificar si token está expirado
          if (decoded.exp * 1000 > Date.now()) {
            set({
              isSignedIn: true,
              token,
              isLoading: false,
            });
          } else {
            // Token expirado
            await SecureStore.deleteItemAsync('auth_token');
            set({ isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error restaurando token:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Establece datos de usuario y token
   */
  setUser: (user, token) => {
    set({ user, token });
  },

  /**
   * Inicia sesión
   */
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Llamar API GraphQL
      // const response = await graphqlClient.login({ email, password });
      // if (response.success) {
      //   await SecureStore.setItemAsync('auth_token', response.access_token);
      //   set({
      //     isSignedIn: true,
      //     token: response.access_token,
      //     user: response.user,
      //   });
      // }
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Registra nuevo usuario
   */
  signUp: async (email, username, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Llamar API GraphQL
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Cierra sesión
   */
  signOut: async () => {
    set({ isLoading: true });
    try {
      await SecureStore.deleteItemAsync('auth_token');
      set({
        isSignedIn: false,
        user: null,
        token: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Solicita reset de contraseña
   */
  requestPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Llamar API GraphQL
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Completa reset de contraseña
   */
  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Llamar API GraphQL
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /**
   * Limpia errores
   */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
