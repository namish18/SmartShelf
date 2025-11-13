import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Task } from '../types';

interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: any;
  };
}

interface TaskResponse {
  success: boolean;
  data: {
    task: Task;
  };
}

export const taskService = {
  async getAll(params?: { page?: number; limit?: number; status?: string }): Promise<{ tasks: Task[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `${API_ENDPOINTS.TASKS.BASE}?${queryParams.toString()}`;
    const response = await apiClient.get<TasksResponse>(endpoint);
    return response.data;
  },

  async getMyTasks(params?: { page?: number; limit?: number; status?: string }): Promise<{ tasks: Task[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `${API_ENDPOINTS.TASKS.MY_TASKS}?${queryParams.toString()}`;
    const response = await apiClient.get<TasksResponse>(endpoint);
    return response.data;
  },

  async create(taskData: { description: string; assignedTo: string }): Promise<Task> {
    console.log('taskService.create called with:', taskData); // Debug log
    const response = await apiClient.post<TaskResponse>(
      API_ENDPOINTS.TASKS.BASE,
      taskData
    );
    return response.data.task;
  },

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const response = await apiClient.put<TaskResponse>(
      API_ENDPOINTS.TASKS.BY_ID(id),
      taskData
    );
    return response.data.task;
  },

  async updateStatus(id: string, status: string): Promise<Task> {
    const response = await apiClient.patch<TaskResponse>(
      API_ENDPOINTS.TASKS.UPDATE_STATUS(id),
      { status }
    );
    return response.data.task;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TASKS.BY_ID(id));
  },
};
