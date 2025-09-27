// Application constants for AI Powered Inventory Management System

// Alert types for expiry management
const ALERT_TYPES = {
    EXPIRY_WARNING: 'EXPIRY_WARNING',          // 7 days before expiry
    EXPIRY_CRITICAL: 'EXPIRY_CRITICAL',        // 3 days before expiry
    EXPIRY_URGENT: 'EXPIRY_URGENT',            // 1 day before expiry
    EXPIRED: 'EXPIRED',                         // Already expired
    LOW_STOCK: 'LOW_STOCK',                     // Stock below minimum level
    OUT_OF_STOCK: 'OUT_OF_STOCK',              // No stock available
    BATCH_RECALL: 'BATCH_RECALL',              // Product recall alert
    TEMPERATURE_BREACH: 'TEMPERATURE_BREACH',   // Cold chain violation
    COMPLIANCE_VIOLATION: 'COMPLIANCE_VIOLATION' // Regulatory compliance issue
};

// Alert priority levels
const ALERT_PRIORITIES = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};

// Alert status
const ALERT_STATUS = {
    ACTIVE: 'ACTIVE',
    ACKNOWLEDGED: 'ACKNOWLEDGED',
    RESOLVED: 'RESOLVED',
    DISMISSED: 'DISMISSED'
};

// Product categories for perishable goods
const PRODUCT_CATEGORIES = {
    PHARMACEUTICALS: 'PHARMACEUTICALS',
    FOOD_BEVERAGES: 'FOOD_BEVERAGES',
    CHEMICALS: 'CHEMICALS',
    COSMETICS: 'COSMETICS',
    BIOLOGICS: 'BIOLOGICS',
    MEDICAL_DEVICES: 'MEDICAL_DEVICES',
    DAIRY: 'DAIRY',
    MEAT: 'MEAT',
    PRODUCE: 'PRODUCE',
    FROZEN: 'FROZEN'
};

// Transaction types for inventory movements
const TRANSACTION_TYPES = {
    INBOUND: 'INBOUND',          // Goods received
    OUTBOUND: 'OUTBOUND',        // Goods shipped
    ADJUSTMENT: 'ADJUSTMENT',     // Stock adjustment
    TRANSFER: 'TRANSFER',         // Inter-warehouse transfer
    RETURN: 'RETURN',            // Product return
    DISPOSAL: 'DISPOSAL',        // Expired product disposal
    DAMAGED: 'DAMAGED',          // Damaged goods write-off
    CYCLE_COUNT: 'CYCLE_COUNT'   // Cycle counting adjustment
};

// User roles and permissions
const USER_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
    INVENTORY_CLERK: 'INVENTORY_CLERK',
    QC_INSPECTOR: 'QC_INSPECTOR',
    ANALYST: 'ANALYST',
    VIEWER: 'VIEWER'
};

// Permission levels
const PERMISSIONS = {
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    APPROVE: 'APPROVE',
    EXPORT: 'EXPORT'
};

// Inventory status
const INVENTORY_STATUS = {
    AVAILABLE: 'AVAILABLE',
    RESERVED: 'RESERVED',
    QUARANTINE: 'QUARANTINE',
    DAMAGED: 'DAMAGED',
    EXPIRED: 'EXPIRED',
    ON_HOLD: 'ON_HOLD'
};

// Warehouse zones for FEFO implementation
const WAREHOUSE_ZONES = {
    RECEIVING: 'RECEIVING',
    STORAGE: 'STORAGE',
    PICKING: 'PICKING',
    PACKING: 'PACKING',
    SHIPPING: 'SHIPPING',
    QUARANTINE: 'QUARANTINE',
    COLD_STORAGE: 'COLD_STORAGE',
    FREEZER: 'FREEZER'
};

// Temperature requirements for cold chain
const TEMPERATURE_RANGES = {
    FROZEN: { min: -25, max: -15 },        // Frozen products
    REFRIGERATED: { min: 2, max: 8 },      // Refrigerated products
    COOL: { min: 8, max: 15 },             // Cool storage
    AMBIENT: { min: 15, max: 25 },         // Room temperature
    CONTROLLED: { min: 20, max: 25 }       // Controlled room temperature
};

// Expiry alert thresholds (in days)
const EXPIRY_THRESHOLDS = {
    WARNING_DAYS: 7,     // Warning alert 7 days before expiry
    CRITICAL_DAYS: 3,    // Critical alert 3 days before expiry
    URGENT_DAYS: 1       // Urgent alert 1 day before expiry
};

// API response codes and messages
const RESPONSE_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
};

const RESPONSE_MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Access denied',
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error'
};

// Cache keys for Redis
const CACHE_KEYS = {
    USER_SESSION: 'user:session:',
    INVENTORY_SUMMARY: 'inventory:summary:',
    EXPIRY_ALERTS: 'alerts:expiry:',
    DASHBOARD_DATA: 'dashboard:data:',
    ANALYTICS_DATA: 'analytics:data:',
    QR_CODE: 'qr:code:',
    FEFO_LIST: 'fefo:list:'
};

// Cache expiry times (in seconds)
const CACHE_EXPIRY = {
    SHORT: 300,      // 5 minutes
    MEDIUM: 1800,    // 30 minutes
    LONG: 3600,      // 1 hour
    DAILY: 86400     // 24 hours
};

// Email templates
const EMAIL_TEMPLATES = {
    EXPIRY_ALERT: 'expiry-alert',
    LOW_STOCK: 'low-stock',
    BATCH_RECALL: 'batch-recall',
    DAILY_REPORT: 'daily-report',
    WELCOME: 'welcome'
};

// QR Code configuration
const QR_CONFIG = {
    SIZE: 200,
    MARGIN: 2,
    COLOR: {
        DARK: '#000000',
        LIGHT: '#FFFFFF'
    },
    ERROR_CORRECTION_LEVEL: 'M'
};

// File upload limits
const UPLOAD_LIMITS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf', 'text/csv'],
    MAX_FILES: 10
};

// FEFO algorithm configuration
const FEFO_CONFIG = {
    BATCH_SIZE: 100,              // Process batches of 100 items
    SORT_CRITERIA: 'expiryDate',  // Primary sort field
    SECONDARY_SORT: 'createdAt',   // Secondary sort field
    MIN_SHELF_LIFE: 2             // Minimum days before expiry to allow picking
};

// Report types
const REPORT_TYPES = {
    EXPIRY_REPORT: 'EXPIRY_REPORT',
    INVENTORY_SUMMARY: 'INVENTORY_SUMMARY',
    TRANSACTION_LOG: 'TRANSACTION_LOG',
    ALERT_SUMMARY: 'ALERT_SUMMARY',
    COMPLIANCE_REPORT: 'COMPLIANCE_REPORT',
    WASTE_ANALYSIS: 'WASTE_ANALYSIS',
    FEFO_PERFORMANCE: 'FEFO_PERFORMANCE'
};

module.exports = {
    ALERT_TYPES,
    ALERT_PRIORITIES,
    ALERT_STATUS,
    PRODUCT_CATEGORIES,
    TRANSACTION_TYPES,
    USER_ROLES,
    PERMISSIONS,
    INVENTORY_STATUS,
    WAREHOUSE_ZONES,
    TEMPERATURE_RANGES,
    EXPIRY_THRESHOLDS,
    RESPONSE_CODES,
    RESPONSE_MESSAGES,
    CACHE_KEYS,
    CACHE_EXPIRY,
    EMAIL_TEMPLATES,
    QR_CONFIG,
    UPLOAD_LIMITS,
    FEFO_CONFIG,
    REPORT_TYPES
};
