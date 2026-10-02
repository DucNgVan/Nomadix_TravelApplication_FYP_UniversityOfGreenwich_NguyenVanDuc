import { create } from 'zustand';
import apiClient, { setAuthToken, clearAuthToken } from '../api/client';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      const accessToken = data.tokens?.accessToken || null;
      const refreshToken = data.tokens?.refreshToken || null;

      if (accessToken) {
        setAuthToken(accessToken);
      }

      set({
        user: data.user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (err) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async ({ fullName, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/register', { fullName, email, password });
      const accessToken = data.tokens?.accessToken || null;
      const refreshToken = data.tokens?.refreshToken || null;

      if (accessToken) {
        setAuthToken(accessToken);
      }

      set({
        user: data.user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (err) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: () => {
    clearAuthToken();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));
