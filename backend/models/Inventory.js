const mongoose = require('mongoose');
const { INVENTORY_STATUS, WAREHOUSE_ZONES } = require('../config/constants');

const inventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: [true, 'Warehouse ID is required']
    },
    batchNumber: {
        type: String,
        required: [true, 'Batch number is required'],
        trim: true,
        uppercase: true
    },
    lotNumber: {
        type: String,
        trim: true,
        uppercase: true
    },
    serialNumbers: [{
        type: String,
        trim: true
    }],
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    reservedQuantity: {
        type: Number,
        default: 0,
        min: [0, 'Reserved quantity cannot be negative']
    },
    availableQuantity: {
        type: Number,
        default: function() {
            return this.quantity - this.reservedQuantity;
        }
    },
    unitCost: {
        type: Number,
        required: [true, 'Unit cost is required'],
        min: [0, 'Unit cost cannot be negative']
    },
    totalValue: {
        type: Number,
        default: function() {
            return this.quantity * this.unitCost;
        }
    },
    manufactureDate: {
        type: Date,
        required: [true, 'Manufacture date is required']
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    receivedDate: {
        type: Date,
        required: [true, 'Received date is required'],
        default: Date.now
    },
    status: {
        type: String,
        enum: Object.values(INVENTORY_STATUS),
        default: INVENTORY_STATUS.AVAILABLE
    },
    location: {
        zone: {
            type: String,
            required: [true, 'Storage zone is required'],
            enum: Object.values(WAREHOUSE_ZONES)
        },
        aisle: {
            type: String,
            required: [true, 'Aisle is required']
        },
        rack: {
            type: String,
            required: [true, 'Rack is required']
        },
        shelf: {
            type: String,
            required: [true, 'Shelf is required']
        },
        bin: {
            type: String
        }
    },
    temperatureLog: [{
        temperature: {
            type: Number,
            required: true
        },
        humidity: {
            type: Number
        },
        recordedAt: {
            type: Date,
            default: Date.now
        },
        sensorId: {
            type: String
        }
    }],
    qualityChecks: [{
        checkType: {
            type: String,
            enum: ['incoming', 'periodic', 'outgoing', 'recall'],
            required: true
        },
        result: {
            type: String,
            enum: ['pass', 'fail', 'conditional'],
            required: true
        },
        parameters: [{
            name: { type: String, required: true },
            value: { type: String, required: true },
            acceptable: { type: Boolean, required: true }
        }],
        inspector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        checkedAt: {
            type: Date,
            default: Date.now
        },
        notes: { type: String }
    }],
    fefoRank: {
        type: Number,
        default: 0
    },
    daysToExpiry: {
        type: Number,
        default: function() {
            const today = new Date();
            const expiry = new Date(this.expiryDate);
            return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        }
    },
    isExpired: {
        type: Boolean,
        default: function() {
            return new Date() > new Date(this.expiryDate);
        }
    },
    quarantineInfo: {
        reason: { type: String },
        quarantinedAt: { type: Date },
        quarantinedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        expectedRelease: { type: Date },
        releaseApproval: {
            approved: { type: Boolean, default: false },
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            approvedAt: { type: Date }
        }
    },
    supplierInfo: {
        invoiceNumber: { type: String },
        poNumber: { type: String },
        supplierId: { type: String },
        supplierBatchNumber: { type: String }
    },
    lastMovement: {
        type: {
            type: String,
            enum: ['inbound', 'outbound', 'transfer', 'adjustment']
        },
        date: { type: Date },
        reference: { type: String },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
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

// Indexes for FEFO algorithm and queries
inventorySchema.index({ 
    productId: 1, 
    warehouseId: 1, 
    expiryDate: 1 
});
inventorySchema.index({ 
    expiryDate: 1, 
    status: 1 
});
inventorySchema.index({ 
    batchNumber: 1, 
    productId: 1 
});
inventorySchema.index({ 
    'location.zone': 1, 
    'location.aisle': 1 
});
inventorySchema.index({ 
    fefoRank: 1, 
    daysToExpiry: 1 
});

// Virtual for shelf life remaining percentage
inventorySchema.virtual('shelfLifeRemaining').get(function() {
    const totalShelfLife = (this.expiryDate - this.manufactureDate) / (1000 * 60 * 60 * 24);
    const remainingDays = this.daysToExpiry;
    return Math.max(0, (remainingDays / totalShelfLife) * 100);
});

// Pre-save middleware to calculate FEFO rank
inventorySchema.pre('save', function(next) {
    // Calculate days to expiry
    const today = new Date();
    const expiry = new Date(this.expiryDate);
    this.daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    // Set expired status
    this.isExpired = this.daysToExpiry < 0;
    
    // Calculate available quantity
    this.availableQuantity = Math.max(0, this.quantity - this.reservedQuantity);
    
    // Calculate total value
    this.totalValue = this.quantity * this.unitCost;
    
    // Calculate FEFO rank (lower number = higher priority)
    // Priority: expiry date (primary), manufacture date (secondary)
    this.fefoRank = this.daysToExpiry * 1000000 + 
                   (Date.now() - new Date(this.manufactureDate).getTime()) / 1000;
    
    next();
});

// Static method to get FEFO sorted inventory
inventorySchema.statics.getFEFOSorted = function(productId, warehouseId, requiredQuantity) {
    return this.find({
        productId,
        warehouseId,
        status: INVENTORY_STATUS.AVAILABLE,
        availableQuantity: { $gt: 0 },
        isExpired: false
    })
    .sort({ fefoRank: 1, expiryDate: 1 })
    .populate('productId', 'name sku')
    .exec();
};

// Static method to get expiring inventory
inventorySchema.statics.getExpiringInventory = function(daysThreshold = 7) {
    return this.find({
        daysToExpiry: { $lte: daysThreshold, $gt: 0 },
        status: { $in: [INVENTORY_STATUS.AVAILABLE, INVENTORY_STATUS.RESERVED] },
        quantity: { $gt: 0 }
    })
    .sort({ daysToExpiry: 1 })
    .populate('productId', 'name sku category')
    .populate('warehouseId', 'name location')
    .exec();
};

module.exports = mongoose.model('Inventory', inventorySchema);
