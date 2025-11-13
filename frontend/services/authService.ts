import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { User, UserRole } from '../types';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export const authService = {
  async login(credentials: LoginData): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      { requiresAuth: false }
    );
    
    // Store token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data.user;
  },

  async register(userData: RegisterData): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData,
      { requiresAuth: false }
    );
    
    // Store token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: { user: User } }>(
        API_ENDPOINTS.AUTH.ME
      );
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
