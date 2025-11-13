// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`, // Changed from number to string
    WORKERS: '/users/workers',
    STATS: '/users/stats',
  },
  // Inventory
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id: string) => `/inventory/${id}`, // Changed from number to string
    UPDATE_QUANTITY: (id: string) => `/inventory/${id}/quantity`,
    ANALYTICS_CATEGORY: '/inventory/analytics/by-category',
    ANALYTICS_SUPPLIER: '/inventory/analytics/by-supplier',
    ANALYTICS_SUMMARY: '/inventory/analytics/summary',
  },
  // Tasks
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`, // Changed from number to string
    MY_TASKS: '/tasks/my-tasks',
    UPDATE_STATUS: (id: string) => `/tasks/${id}/status`, // Changed from number to string
    COMPLETION_RATE: '/tasks/analytics/completion-rate',
  },
  // Alerts
  ALERTS: {
    LOW_STOCK: '/alerts/low-stock',
    EXPIRING_SOON: '/alerts/expiring-soon',
    EXPIRED: '/alerts/expired',
    OUT_OF_STOCK: '/alerts/out-of-stock',
    CRITICAL: '/alerts/critical',
    SUMMARY: '/alerts/summary',
    CATEGORY: (category: string) => `/alerts/category/${category}`,
  },
  // Forecast
  FORECAST: {
    DEMAND: '/forecast/demand',
    DEMAND_CATEGORY: (category: string) => `/forecast/demand/category/${category}`,
    REORDER: '/forecast/reorder-suggestions',
    TRENDS: '/forecast/stock-trends',
    EXPIRY: '/forecast/expiry-forecast',
  },
};
