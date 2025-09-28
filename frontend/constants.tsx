
import React from 'react';
import { InventoryItem, Page } from './types';

export const ICONS = {
    Dashboard: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Inventory: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    Reports: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Settings: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Logout: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    Sun: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Moon: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    Edit: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Delete: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Close: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Menu: ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    AiLogo: ({ className }: { className?: string }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10,0,0,0,2,12A10,10,0,0,0,12,22A10,10,0,0,0,22,12A10,10,0,0,0,12,2M16.2,16.2L12,14.8L7.8,16.2L9.2,11.4L5.9,8.5L10.7,8.2L12,3.5L13.3,8.2L18.1,8.5L14.8,11.4L16.2,16.2Z" /></svg>,
};


export const NAV_ITEMS = [
    { id: Page.Dashboard, label: 'Dashboard', icon: ICONS.Dashboard },
    { id: Page.Inventory, label: 'Inventory', icon: ICONS.Inventory },
    { id: Page.Reports, label: 'Reports', icon: ICONS.Reports },
    { id: Page.Settings, label: 'Settings', icon: ICONS.Settings },
];

const today = new Date();
const addDays = (date: Date, days: number) => {
    // FIX: Corrected a typo from `new D<ctrl61>ata(date)` to `new Date(date)`.
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
    { id: 8, productName: 'Orange Juice', category: 'Beverages', sku: 'BV-001', quantity: 100, purchaseDate: formatDate(addDays(today, -15)), expiryDate: formatDate(addDays(today, 45)), supplier: 'Juice World' },
    { id: 9, productName: 'Ground Beef', category: 'Meat', sku: 'MT-002', quantity: 45, purchaseDate: formatDate(addDays(today, -2)), expiryDate: formatDate(addDays(today, 6)), supplier: 'Quality Meats' },
    { id: 10, productName: 'Tomatoes', category: 'Produce', sku: 'PR-002', quantity: 90, purchaseDate: formatDate(addDays(today, -4)), expiryDate: formatDate(addDays(today, 10)), supplier: 'Green Farms' },
    { id: 11, productName: 'Eggs', category: 'Dairy', sku: 'DA-004', quantity: 150, purchaseDate: formatDate(addDays(today, -6)), expiryDate: formatDate(addDays(today, 20)), supplier: 'Happy Hens Farm' },
    { id: 12, productName: 'Salmon Fillet', category: 'Seafood', sku: 'SF-001', quantity: 25, purchaseDate: formatDate(addDays(today, -1)), expiryDate: formatDate(addDays(today, 2)), supplier: 'Ocean Fresh' },
    { id: 13, productName: 'Expired Yogurt', category: 'Dairy', sku: 'DA-005', quantity: 10, purchaseDate: formatDate(addDays(today, -40)), expiryDate: formatDate(addDays(today, -5)), supplier: 'Farm Fresh Inc.' },
    { id: 14, productName: 'Expired Bread', category: 'Bakery', sku: 'BK-003', quantity: 5, purchaseDate: formatDate(addDays(today, -10)), expiryDate: formatDate(addDays(today, -2)), supplier: 'Bakers Delight' },
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
    { month: 'Next Month', 'Organic Milk': 45, 'Apples': 110, 'Chicken Breast': 55, 'Orange Juice': 90, 'Eggs': 160 },
    { month: 'In 2 Months', 'Organic Milk': 55, 'Apples': 130, 'Chicken Breast': 65, 'Orange Juice': 95, 'Eggs': 150 },
    { month: 'In 3 Months', 'Organic Milk': 50, 'Apples': 125, 'Chicken Breast': 70, 'Orange Juice': 105, 'Eggs': 170 },
];

export const DEMAND_PRODUCT_KEYS = [
    { key: 'Organic Milk', color: '#8884d8' },
    { key: 'Apples', color: '#82ca9d' },
    { key: 'Chicken Breast', color: '#ffc658' },
    { key: 'Orange Juice', color: '#ff8042' },
    { key: 'Eggs', color: '#0088FE' },
];