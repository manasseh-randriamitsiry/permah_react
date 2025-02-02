import axios from 'axios';
import type { User, LoginResponse, SignupResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface UpdateProfileData {
    name?: string;
    email?: string;
    current_password?: string;
    new_password?: string;
}

export class SecurityService {
    private static API_URL = API_URL;

    static async login(email: string, password: string): Promise<LoginResponse> {
        try {
            console.log('Attempting login with:', { email });
            
            const response = await axios.post<LoginResponse>(
                `${this.API_URL}/api/auth/login`,
                {
                    username: email,
                    password: password
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            
            console.log('Login successful:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Login failed:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    }

    static async signup(data: { email: string; password: string; name: string }): Promise<SignupResponse> {
        try {
            const response = await axios.post<SignupResponse>(
                `${this.API_URL}/api/auth/register`,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
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
            
            const response = await axios.put<LoginResponse>(
                `${this.API_URL}/api/auth/profile`,
                this.sanitizeProfileData(data),
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            
            console.log('Profile update successful');
            return response.data;
        } catch (error: any) {
            console.error('Profile update failed:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
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
        try {
            await axios.post(
                `${this.API_URL}/api/auth/logout`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
        } catch (error) {
            throw error;
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
            // Get the current user's email from the store
            const userJson = localStorage.getItem('user');
            if (!userJson) {
                throw new Error('No user found');
            }
            
            const user = JSON.parse(userJson);
            
            // Use the login endpoint to verify credentials
            await axios.post(
                `${this.API_URL}/api/auth/login`,
                {
                    username: user.email,  // Using username as we did for login
                    password: password
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
        } catch (error: any) {
            console.error('Password verification failed:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw new Error('Invalid password. Please try again.');
        }
    }
}

// Initialize axios configuration
SecurityService.configureAxios();
