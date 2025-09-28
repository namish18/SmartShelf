
export enum Page {
    Dashboard = 'Dashboard',
    Inventory = 'Inventory',
    Reports = 'Reports',
    Settings = 'Settings',
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
