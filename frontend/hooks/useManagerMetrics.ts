import { useMemo } from 'react';
import { MOCK_TASKS, MOCK_INVENTORY_DATA, MOCK_USERS } from '../constants';

// Mock data for top sellers as requested
const MOCK_TOP_SELLERS = [
    { id: 2, productName: 'Whole Wheat Bread', unitsSold: 320, category: 'Bakery' },
    { id: 4, productName: 'Apples', unitsSold: 280, category: 'Produce' },
    { id: 1, productName: 'Organic Milk', unitsSold: 250, category: 'Dairy' },
    { id: 5, productName: 'Chicken Breast', unitsSold: 190, category: 'Meat' },
];

// Helper function to calculate date differences
const getDaysUntilExpiry = (expiryDate: string) => {
    const expDate = new Date(expiryDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const useManagerMetrics = () => {
    const metrics = useMemo(() => {
        // Task KPIs
        const totalTasks = MOCK_TASKS.length;
        const completedTasks = MOCK_TASKS.filter(t => t.status === 'Completed').length;
        const pendingTasks = MOCK_TASKS.filter(t => t.status === 'Pending').length;
        const orderCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : '0';

        // Inventory KPIs
        const totalItems = MOCK_INVENTORY_DATA.reduce((sum, item) => sum + item.quantity, 0);

        // User KPIs
        const workersOnline = MOCK_USERS.filter(u => u.role === 'Worker').length;

        // Alert KPIs & Data
        const lowStockThreshold = 20;
        const expiryThresholdDays = 7;

        const lowStockItems = MOCK_INVENTORY_DATA
            .filter(i => i.quantity <= lowStockThreshold)
            .sort((a, b) => a.quantity - b.quantity);
            
        const expiringSoonItems = MOCK_INVENTORY_DATA
            .map(item => ({ ...item, daysLeft: getDaysUntilExpiry(item.expiryDate) }))
            .filter(i => i.daysLeft > 0 && i.daysLeft <= expiryThresholdDays)
            .sort((a, b) => a.daysLeft - b.daysLeft);
        
        const lowStockAlertCount = lowStockItems.length;
        const expiringSoonAlertCount = expiringSoonItems.length;

        // Top Sellers
        const topSellingItems = MOCK_TOP_SELLERS;

        return {
            pendingTasks: pendingTasks.toString(),
            totalItems: totalItems.toLocaleString(),
            workersOnline: workersOnline.toString(),
            orderCompletionRate: `${orderCompletionRate}%`,
            lowStockAlertCount: lowStockAlertCount.toString(),
            expiringSoonAlertCount: expiringSoonAlertCount.toString(),
            
            lowStockItems,
            expiringSoonItems,
            topSellingItems
        };
    }, []);

    return metrics;
};