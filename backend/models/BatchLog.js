const mongoose = require('mongoose');
const { TRANSACTION_TYPES } = require('../config/constants');

const batchLogSchema = new mongoose.Schema({
    batchNumber: {
        type: String,
        required: [true, 'Batch number is required'],
        trim: true,
        uppercase: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    inventoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: [true, 'Inventory ID is required']
    },
    transactionType: {
        type: String,
        enum: Object.values(TRANSACTION_TYPES),
        required: [true, 'Transaction type is required']
    },
    quantityBefore: {
        type: Number,
        required: [true, 'Quantity before is required'],
        min: [0, 'Quantity cannot be negative']
    },
    quantityAfter: {
        type: Number,
        required: [true, 'Quantity after is required'],
        min: [0, 'Quantity cannot be negative']
    },
    quantityChanged: {
        type: Number,
        required: [true, 'Quantity changed is required']
    },
    reason: {
        type: String,
        required: [true, 'Transaction reason is required'],
        trim: true
    },
    reference: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User performing action is required']
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalRequired: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvalDate: {
        type: Date
    },
    metadata: {
        ipAddress: { type: String },
        userAgent: { type: String },
        location: {
            zone: { type: String },
            aisle: { type: String },
            rack: { type: String },
            shelf: { type: String }
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
batchLogSchema.index({ batchNumber: 1, productId: 1 });
batchLogSchema.index({ inventoryId: 1, createdAt: -1 });
batchLogSchema.index({ transactionType: 1, createdAt: -1 });
batchLogSchema.index({ performedBy: 1, createdAt: -1 });

module.exports = mongoose.model('BatchLog', batchLogSchema);
