import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { InventoryItem } from '../types';

interface InventoryResponse {
  success: boolean;
  message: string;
  data: {
    items: InventoryItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  };
}

interface InventoryItemResponse {
  success: boolean;
  data: {
    item: InventoryItem;
  };
}

export const inventoryService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    supplier?: string;
    search?: string;
  }): Promise<{ items: InventoryItem[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.supplier) queryParams.append('supplier', params.supplier);
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `${API_ENDPOINTS.INVENTORY.BASE}?${queryParams.toString()}`;
    const response = await apiClient.get<InventoryResponse>(endpoint);
    return response.data;
  },

  async getById(id: number): Promise<InventoryItem> {
    const response = await apiClient.get<InventoryItemResponse>(
      API_ENDPOINTS.INVENTORY.BY_ID(id.toString())
    );
    return response.data.item;
  },

  async create(item: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await apiClient.post<InventoryItemResponse>(
      API_ENDPOINTS.INVENTORY.BASE,
      item
    );
    return response.data.item;
  },

  async update(id: number, item: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await apiClient.put<InventoryItemResponse>(
      API_ENDPOINTS.INVENTORY.BY_ID(id.toString()),
      item
    );
    return response.data.item;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.INVENTORY.BY_ID(id.toString()));
  },

  async getSummary(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: { summary: any } }>(
      API_ENDPOINTS.INVENTORY.ANALYTICS_SUMMARY
    );
    return response.data.summary;
  },

  async getCategoryAnalytics(): Promise<any[]> {
    const response = await apiClient.get<{ success: boolean; data: { categories: any[] } }>(
      API_ENDPOINTS.INVENTORY.ANALYTICS_CATEGORY
    );
    return response.data.categories;
  },
};
