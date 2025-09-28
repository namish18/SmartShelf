export enum Page {
    Dashboard = 'Dashboard',
    Inventory = 'Inventory',
    Reports = 'Reports',
    Settings = 'Settings',
    UserManagement = 'User Management',
    TaskManagement = 'Task Management',
    MyTasks = 'My Tasks',
}

export interface InventoryItem {
    id: number;
    productName: string;
    category: string;
    sku: string;
    quantity: number;
    purchaseDate: string;
    expiryDate: string;
    supplier: string;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export type UserRole = 'Admin' | 'Manager' | 'Worker';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface Task {
    id: number;
    description: string;
    assignedTo: number; // Worker ID
    status: 'Pending' | 'In Progress' | 'Completed';
}