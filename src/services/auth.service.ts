import axios from 'axios';
import type { LoginResponse, SignupResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface UpdateProfileData {
    name?: string;
    email?: string;
    current_password?: string;
    new_password?: string;
}

interface VerifyAccountResponse {
    message: string;
    user: {
        id: number;
        email: string;
        name: string;
        isVerified: boolean;
    };
}

export class SecurityService {
    private static API_URL = API_URL;

    private static clearAllData() {
        console.log('SecurityService: Starting to clear all data...');
        
        // Log all keys before clearing
        const localStorageKeys = Object.keys(localStorage);
        const sessionStorageKeys = Object.keys(sessionStorage);
        
        console.log('Current localStorage keys:', localStorageKeys);
        console.log('Current sessionStorage keys:', sessionStorageKeys);
        
        // Explicitly remove known keys first
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Then clear everything
        localStorage.clear();
        sessionStorage.clear();
        
        // Verify clearing worked
        const remainingLocalStorageKeys = Object.keys(localStorage);
        const remainingSessionStorageKeys = Object.keys(sessionStorage);
        
        console.log('Remaining localStorage keys:', remainingLocalStorageKeys);
        console.log('Remaining sessionStorage keys:', remainingSessionStorageKeys);
        
        if (remainingLocalStorageKeys.length > 0 || remainingSessionStorageKeys.length > 0) {
            console.warn('Some storage keys could not be cleared:', {
                localStorage: remainingLocalStorageKeys,
                sessionStorage: remainingSessionStorageKeys
            });
        } else {
            console.log('SecurityService: All data successfully cleared');
        }
    }

    static async login(email: string, password: string): Promise<LoginResponse> {
        try {
            // Clear any existing data before login
            this.clearAllData();
            
            console.log('Attempting login with:', { email });
            
            const response = await fetch(`${this.API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            // Store the token if it's in the response
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            // Store the user data
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            console.log('Login successful:', data);
            return data;
        } catch (error: any) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    static getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No authentication token found');
            throw new Error('No authentication token found');
        }
        
        console.log('Using token for authentication:', `Bearer ${token.substring(0, 10)}...`);
        
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    static isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    }

    static clearAuth() {
        this.clearAllData();
    }

    static async signup(data: { name: string; email: string; password: string }): Promise<SignupResponse> {
        console.log('Starting signup process for:', { name: data.name, email: data.email });
        
        // Clear any existing data before signup
        console.log('Clearing existing data before signup...');
        this.clearAllData();
        
        console.log('Making signup request to:', `${this.API_URL}/api/auth/register`);
        const response = await fetch(`${this.API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Signup response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Signup failed:', error);
            throw new Error(error.message || 'Registration failed');
        }

        const responseData = await response.json();
        console.log('Signup successful:', { user: responseData.user, hasToken: !!responseData.token });
        return responseData;
    }

    static async verifyAccount(data: { email: string; code: string }): Promise<VerifyAccountResponse> {
        const response = await fetch(`${this.API_URL}/api/auth/verify-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Account verification failed');
        }

        const responseData = await response.json();
        return responseData;
    }

    static async requestPasswordReset(email: string): Promise<{ message: string }> {
        const response = await fetch(`${this.API_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to request password reset');
        }

        const responseData = await response.json();
        return responseData;
    }

    static async verifyResetCode(data: { email: string; code: string }): Promise<{ message: string }> {
        const response = await fetch(`${this.API_URL}/api/auth/verify-reset-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid or expired verification code');
        }

        const responseData = await response.json();
        return responseData;
    }

    static async resetPassword(data: { email: string; code: string; new_password: string }): Promise<{ message: string }> {
        const response = await fetch(`${this.API_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reset password');
        }

        const responseData = await response.json();
        return responseData;
    }

    static async updateProfile(data: UpdateProfileData): Promise<LoginResponse> {
        try {
            // Validate input data
            this.validateProfileData(data);
            
            console.log('Updating profile with:', {
                ...data,
                current_password: data.current_password ? '********' : undefined,
                new_password: data.new_password ? '********' : undefined
            });
            
            const response = await fetch(`${this.API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify(this.sanitizeProfileData(data))
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update profile');
            }
            
            const result = await response.json();
            console.log('Profile update successful');
            return result;
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                this.clearAuth();
            }
            console.error('Profile update failed:', error);
            throw error;
        }
    }

    private static validateProfileData(data: UpdateProfileData): void {
        // Validate email format if provided
        if (data.email && !this.isValidEmail(data.email)) {
            throw new Error('Invalid email format');
        }

        // Validate name if provided
        if (data.name && !this.isValidName(data.name)) {
            throw new Error('Name must be between 2 and 50 characters and contain only letters, spaces, and hyphens');
        }

        // Validate password requirements if changing password
        if (data.new_password) {
            if (!data.current_password) {
                throw new Error('Current password is required when setting a new password');
            }
            
            if (!this.isValidPassword(data.new_password)) {
                throw new Error(
                    'Password must be at least 8 characters long and contain at least one uppercase letter, ' +
                    'one lowercase letter, one number, and one special character'
                );
            }

            if (data.new_password === data.current_password) {
                throw new Error('New password must be different from current password');
            }
        }

        // Ensure at least one field is being updated
        if (!data.name && !data.email && !data.new_password) {
            throw new Error('No changes provided for update');
        }
    }

    private static sanitizeProfileData(data: UpdateProfileData): UpdateProfileData {
        return {
            ...data,
            name: data.name?.trim(),
            email: data.email?.trim().toLowerCase(),
        };
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    private static isValidName(name: string): boolean {
        const nameRegex = /^[a-zA-Z\s-]{2,50}$/;
        return nameRegex.test(name);
    }

    private static isValidPassword(password: string): boolean {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    static async logout(): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${this.API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Logout failed');
            }
        } finally {
            this.clearAuth();
        }
    }

    static configureAxios(): void {
        // Log the configuration
        console.log('Configuring axios with base URL:', this.API_URL);
        
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Accept'] = 'application/json';
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        // Add request interceptor
        axios.interceptors.request.use(
            (config) => {
                console.log('Making request:', {
                    url: config.url,
                    method: config.method,
                    headers: config.headers,
                    withCredentials: config.withCredentials
                });
                return config;
            },
            (error) => {
                console.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor
        axios.interceptors.response.use(
            (response) => {
                console.log('Response received:', {
                    status: response.status,
                    data: response.data
                });
                return response;
            },
            (error) => {
                console.error('Response error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                return Promise.reject(error);
            }
        );
    }

    static async verifyPassword(password: string): Promise<void> {
        try {
            console.log('Verifying password locally...');
            const user = localStorage.getItem('user');
            if (!user) {
                throw new Error('No user found. Please log in again.');
            }

            const parsedUser = JSON.parse(user);
            
            // Verify password by trying to login with current credentials
            const response = await fetch(`${this.API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: parsedUser.email,
                    password: password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Invalid password');
            }

            console.log('Password verification successful');
        } catch (error: any) {
            console.error('Password verification failed:', error);
            throw new Error('Invalid password');
        }
    }
}

// Initialize axios configuration
SecurityService.configureAxios();
