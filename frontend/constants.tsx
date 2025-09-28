import React from 'react';
import { InventoryItem, Page, User, Task } from './types';

export const ICONS = {
    Dashboard: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Inventory: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    Reports: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Settings: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Logout: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    Users: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 14.155A4 4 0 1121 12.845" /></svg>,
    Tasks: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    Sun: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Moon: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    Edit: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Delete: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Close: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Menu: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    AiLogo: ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>,
    UsersGroup: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.284.084A3 3 0 0 1 7 15.75m-4.548 2.586a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1 4.682-2.72m-7.284.084A3 3 0 0 0 7 15.75m-4.548 2.586a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1 4.682-2.72m-7.284.084A3 3 0 0 0 7 15.75m-4.548 2.586a9.094 9.094 0 0 1-3.741-.479 3 3 0 0 1 4.682-2.72m-7.284.084a3 3 0 0 0 9.096-2.586m-9.096 2.586a3 3 0 0 0 9.096-2.586m1.146-8.546a3 3 0 0 1 5.716 0m-11.432 0a3 3 0 0 0 5.716 0m-5.716 0a3 3 0 0 0-2.858 1.43m5.716 0a3 3 0 0 1-2.858 1.43m5.716-1.43a3 3 0 0 1 2.858 1.43" /></svg>,
    ArchiveBox: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>,
    CurrencyDollar: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.979-.775 2.459-1.229 3.998-1.229 1.428 0 2.848.337 3.98.998M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.979-.775 2.459-1.229 3.998-1.229 1.428 0 2.848.337 3.98.998" /></svg>,
};

export const ADMIN_NAV_ITEMS = [
    { id: Page.Dashboard, label: 'Dashboard', icon: ICONS.Dashboard },
    { id: Page.UserManagement, label: 'User Management', icon: ICONS.Users },
    { id: Page.Inventory, label: 'Inventory', icon: ICONS.Inventory },
    { id: Page.Reports, label: 'Reports', icon: ICONS.Reports },
    { id: Page.Settings, label: 'Settings', icon: ICONS.Settings },
];

export const MANAGER_NAV_ITEMS = [
    { id: Page.Dashboard, label: 'Dashboard', icon: ICONS.Dashboard },
    { id: Page.Inventory, label: 'Inventory', icon: ICONS.Inventory },
    { id: Page.TaskManagement, label: 'Task Management', icon: ICONS.Tasks },
    { id: Page.Reports, label: 'Reports', icon: ICONS.Reports },
];

export const WORKER_NAV_ITEMS = [
    { id: Page.MyTasks, label: 'My Tasks', icon: ICONS.Tasks },
];


const today = new Date();
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const MOCK_INVENTORY_DATA: InventoryItem[] = [
    { id: 1, productName: 'Organic Milk', category: 'Dairy', sku: 'DA-001', quantity: 50, purchaseDate: formatDate(addDays(today, -20)), expiryDate: formatDate(addDays(today, 5)), supplier: 'Farm Fresh Inc.' },
    { id: 2, productName: 'Whole Wheat Bread', category: 'Bakery', sku: 'BK-001', quantity: 75, purchaseDate: formatDate(addDays(today, -2)), expiryDate: formatDate(addDays(today, 3)), supplier: 'Bakers Delight' },
    { id: 3, productName: 'Cheddar Cheese', category: 'Dairy', sku: 'DA-002', quantity: 40, purchaseDate: formatDate(addDays(today, -30)), expiryDate: formatDate(addDays(today, 25)), supplier: 'Cheese Masters' },
    { id: 4, productName: 'Apples', category: 'Produce', sku: 'PR-001', quantity: 120, purchaseDate: formatDate(addDays(today, -5)), expiryDate: formatDate(addDays(today, 15)), supplier: 'Orchard Growers' },
    { id: 5, productName: 'Chicken Breast', category: 'Meat', sku: 'MT-001', quantity: 60, purchaseDate: formatDate(addDays(today, -3)), expiryDate: formatDate(addDays(today, 8)), supplier: 'Quality Meats' },
    { id: 6, productName: 'Yogurt', category: 'Dairy', sku: 'DA-003', quantity: 80, purchaseDate: formatDate(addDays(today, -10)), expiryDate: formatDate(addDays(today, 12)), supplier: 'Farm Fresh Inc.' },
    { id: 7, productName: 'Sourdough Bread', category: 'Bakery', sku: 'BK-002', quantity: 30, purchaseDate: formatDate(addDays(today, -1)), expiryDate: formatDate(addDays(today, 4)), supplier: 'Bakers Delight' },
];

export const MOCK_USERS: User[] = [
    { id: 1, name: 'Alice Admin', email: 'admin@wms.com', role: 'Admin' },
    { id: 2, name: 'Mike Manager', email: 'manager@wms.com', role: 'Manager' },
    { id: 3, name: 'Bob Worker', email: 'worker.bob@wms.com', role: 'Worker' },
    { id: 4, name: 'Charlie Worker', email: 'worker.charlie@wms.com', role: 'Worker' },
];

export const MOCK_TASKS: Task[] = [
    { id: 1, description: 'Pick 10x Organic Milk (DA-001) from Aisle 3, Shelf 2', assignedTo: 3, status: 'Pending' },
    { id: 2, description: 'Pack Order #WMS-1023 for shipment', assignedTo: 3, status: 'Pending' },
    { id: 3, description: 'Restock Apples (PR-001) in the cold storage area', assignedTo: 4, status: 'In Progress' },
    { id: 4, description: 'Quality check on incoming Cheddar Cheese (DA-002)', assignedTo: 4, status: 'Completed' },
    { id: 5, description: 'Perform cycle count for Bakery category', assignedTo: 3, status: 'In Progress' },
];


export const INVENTORY_BY_CATEGORY_DATA = [
    { name: 'Dairy', quantity: MOCK_INVENTORY_DATA.filter(i => i.category === 'Dairy').reduce((sum, item) => sum + item.quantity, 0) },
    { name: 'Bakery', quantity: MOCK_INVENTORY_DATA.filter(i => i.category === 'Bakery').reduce((sum, item) => sum + item.quantity, 0) },
    { name: 'Produce', quantity: MOCK_INVENTORY_DATA.filter(i => i.category === 'Produce').reduce((sum, item) => sum + item.quantity, 0) },
    { name: 'Meat', quantity: MOCK_INVENTORY_DATA.filter(i => i.category === 'Meat').reduce((sum, item) => sum + item.quantity, 0) },
    { name: 'Beverages', quantity: MOCK_INVENTORY_DATA.filter(i => i.category === 'Beverages').reduce((sum, item) => sum + item.quantity, 0) },
    { name: 'Seafood', quantity: MOCK_INVENTORY_DATA.filter(i => i.category === 'Seafood').reduce((sum, item) => sum + item.quantity, 0) },
];

export const DEMAND_FORECAST_DATA = [
    { month: 'Next Month', 'Organic Milk': 45, 'Apples': 110, 'Chicken Breast': 55 },
    { month: 'In 2 Months', 'Organic Milk': 55, 'Apples': 130, 'Chicken Breast': 65 },
    { month: 'In 3 Months', 'Organic Milk': 50, 'Apples': 125, 'Chicken Breast': 70 },
];