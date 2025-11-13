export type UserRole = 'Admin' | 'Manager' | 'Worker';

export interface User {
  id: string; // Changed from number to string for MongoDB ObjectId
  name: string;
  email: string;
  role: UserRole;
}

export interface InventoryItem {
  id: string; // Changed from number to string
  productName: string;
  category: string;
  sku: string;
  quantity: number;
  purchaseDate: string;
  expiryDate: string;
  supplier: string;
}

export interface Task {
  id: string; // Changed from number to string
  description: string;
  assignedTo: string; // Changed from number to string
  assignedBy?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt?: string;
  completedAt?: string;
}

export enum Page {
  Dashboard = 'Dashboard',
  Inventory = 'Inventory',
  Reports = 'Reports',
  Settings = 'Settings',
  UserManagement = 'User Management',
  TaskManagement = 'Task Management',
  MyTasks = 'My Tasks'
}
