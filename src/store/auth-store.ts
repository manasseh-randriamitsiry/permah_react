import { create } from 'zustand';
import { SecurityService } from '../services/auth.service';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  loginWithUser: (user: User) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    email?: string;
    current_password?: string;
    new_password?: string;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  loginWithCredentials: async (email: string, password: string) => {
    try {
      const response = await SecurityService.login(email, password);
      const { user } = response;
      
      localStorage.setItem('user', JSON.stringify(user));
      
      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },

  loginWithUser: (user: User) => {
    // Store user data
    localStorage.setItem('user', JSON.stringify(user));
    
    set({
      user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      await SecurityService.logout();
    } finally {
      localStorage.removeItem('user');
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await SecurityService.updateProfile(data);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },

  initialize: async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      localStorage.removeItem('user');
    } finally {
      set({ isInitialized: true });
    }
  },
}));