import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { User } from '../types';

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: any;
  };
}

interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export const userService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<{ users: User[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `${API_ENDPOINTS.USERS.BASE}?${queryParams.toString()}`;
    const response = await apiClient.get<UsersResponse>(endpoint);
    return response.data;
  },

  async create(userData: { name: string; email: string; password: string; role: string }): Promise<User> {
    const response = await apiClient.post<UserResponse>(
      API_ENDPOINTS.USERS.BASE,
      userData
    );
    return response.data.user;
  },

  async update(id: number, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<UserResponse>(
      API_ENDPOINTS.USERS.BY_ID(id),
      userData
    );
    return response.data.user;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  async getWorkers(): Promise<User[]> {
    const response = await apiClient.get<{ success: boolean; data: { workers: User[] } }>(
      API_ENDPOINTS.USERS.WORKERS
    );
    return response.data.workers;
  },
};
