import axios from 'axios';
import type { 
  Event, 
  EventWithUser,
  User, 
  LoginRequest,
  LoginResponse, 
  SignupRequest,
  SignupResponse,
  UpdateProfileRequest,
  CreateEventRequest
} from '../types';

// Base URL without /api prefix since we include it in each endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Making request with token:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    
    // Log full request details
    console.log('Request details:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const errorDetails = {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
      };
      console.error('API Error:', errorDetails);

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signup: (data: SignupRequest) =>
    api.post<SignupResponse>('/api/auth/signup', data),
    
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/api/auth/login', data),
  
  logout: () => 
    api.post<{ message: string }>('/api/auth/logout'),

  verifyPassword: (password: string) =>
    api.post<{ isValid: boolean; message: string }>('/api/auth/verify-password', { 
      current_password: password 
    }),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<{ message: string; user: User; token: string }>('/api/auth/profile', {
      name: data.name,
      email: data.email,
      current_password: data.current_password,
      new_password: data.new_password
    }),
};

export const userApi = {
  getProfile: () => 
    api.get<{ user: User }>('/api/auth/profile'),
  
  updateProfile: (data: UpdateProfileRequest) =>
    api.put<{ message: string; user: User }>('/api/auth/update', data),
  
  deleteAccount: () =>
    api.delete<{ message: string }>('/api/auth/delete'),
};

export const eventApi = {
  create: async (eventData: any) => {
    try {
      const response = await api.post('/api/events', eventData);
      return response.data;
    } catch (error) {
      console.error('API Error Details:', error);
      throw error;
    }
  },
  
  getAll: () =>
    api.get<EventWithUser[]>('/api/events'),

  getUserEvents: () =>
    api.get<Event[]>('/api/events/user'),
  
  update: (id: number, eventData: Partial<CreateEventRequest>) => 
    api.put<{ message: string; event: Partial<Event> }>(`/api/events/${id}`, eventData),
  
  delete: (id: number) => 
    api.delete<{ message: string }>(`/api/events/${id}`),
};
