import { create } from 'zustand';
import { SecurityService } from '../services/auth.service';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
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

  login: (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    console.log('Auth store: starting logout process...');
    // First clear the state
    set({ user: null, isAuthenticated: false });
    // Then clear storage through SecurityService
    SecurityService.clearAuth();
    console.log('Auth store: logout complete');
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

  initialize: () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true, isInitialized: true });
      } catch (e) {
        // If there's an error parsing the stored user, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false, isInitialized: true });
      }
    } else {
      set({ isInitialized: true });
    }
  },
}));