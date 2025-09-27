const mongoose = require('mongoose');
const { PRODUCT_CATEGORIES, TEMPERATURE_RANGES } = require('../config/constants');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: Object.values(PRODUCT_CATEGORIES)
    },
    subcategory: {
        type: String,
        trim: true
    },
    manufacturer: {
        type: String,
        required: [true, 'Manufacturer is required'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true
    },
    isPerishable: {
        type: Boolean,
        required: true,
        default: true
    },
    shelfLifeDays: {
        type: Number,
        required: function() {
            return this.isPerishable;
        },
        min: [1, 'Shelf life must be at least 1 day']
    },
    storageTemperature: {
        type: String,
        required: [true, 'Storage temperature requirement is required'],
        enum: Object.keys(TEMPERATURE_RANGES)
    },
    temperatureRange: {
        min: {
            type: Number,
            required: [true, 'Minimum temperature is required']
        },
        max: {
            type: Number,
            required: [true, 'Maximum temperature is required']
        }
    },
    unitOfMeasure: {
        type: String,
        required: [true, 'Unit of measure is required'],
        enum: ['pieces', 'kg', 'g', 'liters', 'ml', 'boxes', 'cartons']
    },
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        weight: { type: Number }
    },
    regulatoryInfo: {
        fda_approved: { type: Boolean, default: false },
        lotNumberRequired: { type: Boolean, default: true },
        serialNumberRequired: { type: Boolean, default: false },
        batchTrackingRequired: { type: Boolean, default: true },
        gmpRequired: { type: Boolean, default: false },
        haccp_required: { type: Boolean, default: false }
    },
    pricing: {
        costPrice: {
            type: Number,
            required: [true, 'Cost price is required'],
            min: [0, 'Cost price cannot be negative']
        },
        sellingPrice: {
            type: Number,
            required: [true, 'Selling price is required'],
            min: [0, 'Selling price cannot be negative']
        },
        currency: {
            type: String,
            default: 'INR',
            enum: ['INR', 'USD', 'EUR']
        }
    },
    supplierInfo: {
        supplierId: {
            type: String,
            required: [true, 'Supplier ID is required']
        },
        supplierName: {
            type: String,
            required: [true, 'Supplier name is required']
        },
        leadTimeDays: {
            type: Number,
            default: 7
        }
    },
    qualityParameters: {
        ph_range: {
            min: { type: Number },
            max: { type: Number }
        },
        moisture_content: {
            min: { type: Number },
            max: { type: Number }
        },
        color_specification: { type: String },
        texture_requirement: { type: String }
    },
    images: [{
        url: { type: String },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false }
    }],
    documents: [{
        name: { type: String },
        url: { type: String },
        type: { type: String, enum: ['certificate', 'specification', 'msds', 'coa'] }
    }],
    barcode: {
        type: String,
        unique: true,
        sparse: true
    },
    qrCode: {
        type: String,
        unique: true,
        sparse: true
    },
    minimumStock: {
        type: Number,
        required: [true, 'Minimum stock level is required'],
        min: [0, 'Minimum stock cannot be negative']
    },
    maximumStock: {
        type: Number,
        required: [true, 'Maximum stock level is required'],
        min: [0, 'Maximum stock cannot be negative']
    },
    reorderPoint: {
        type: Number,
        required: [true, 'Reorder point is required'],
        min: [0, 'Reorder point cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ sku: 1 });
productSchema.index({ category: 1, isPerishable: 1 });
productSchema.index({ manufacturer: 1, brand: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ 'supplierInfo.supplierId': 1 });

// Virtual for total inventory across all warehouses
productSchema.virtual('totalInventory', {
    ref: 'Inventory',
    localField: '_id',
    foreignField: 'productId',
    count: false
});

// Pre-save middleware to set temperature range based on storage temperature
productSchema.pre('save', function(next) {
    if (this.storageTemperature && TEMPERATURE_RANGES[this.storageTemperature]) {
        this.temperatureRange = TEMPERATURE_RANGES[this.storageTemperature];
    }
    next();
});

// Validation for maximum stock greater than minimum stock
productSchema.pre('save', function(next) {
    if (this.maximumStock <= this.minimumStock) {
        return next(new Error('Maximum stock must be greater than minimum stock'));
    }
    if (this.reorderPoint < this.minimumStock) {
        return next(new Error('Reorder point cannot be less than minimum stock'));
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
