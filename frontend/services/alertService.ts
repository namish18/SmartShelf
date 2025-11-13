import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export const alertService = {
  async getLowStock(threshold?: number): Promise<any[]> {
    const endpoint = threshold
      ? `${API_ENDPOINTS.ALERTS.LOW_STOCK}?threshold=${threshold}`
      : API_ENDPOINTS.ALERTS.LOW_STOCK;
    const response = await apiClient.get<{ success: boolean; data: { alerts: any[] } }>(endpoint);
    return response.data.alerts;
  },

  async getExpiringSoon(days?: number): Promise<any[]> {
    const endpoint = days
      ? `${API_ENDPOINTS.ALERTS.EXPIRING_SOON}?days=${days}`
      : API_ENDPOINTS.ALERTS.EXPIRING_SOON;
    const response = await apiClient.get<{ success: boolean; data: { alerts: any[] } }>(endpoint);
    return response.data.alerts;
  },

  async getCritical(): Promise<any[]> {
    const response = await apiClient.get<{ success: boolean; data: { alerts: any[] } }>(
      API_ENDPOINTS.ALERTS.CRITICAL
    );
    return response.data.alerts;
  },

  async getSummary(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: { summary: any } }>(
      API_ENDPOINTS.ALERTS.SUMMARY
    );
    return response.data.summary;
  },
};
