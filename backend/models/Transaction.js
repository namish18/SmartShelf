const mongoose = require('mongoose');
const { TRANSACTION_TYPES } = require('../config/constants');

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: [true, 'Transaction ID is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    type: {
        type: String,
        enum: Object.values(TRANSACTION_TYPES),
        required: [true, 'Transaction type is required']
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
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: [0, 'Unit price cannot be negative']
    },
    totalValue: {
        type: Number,
        required: [true, 'Total value is required'],
        min: [0, 'Total value cannot be negative']
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
        required: [true, 'User performing transaction is required']
    },
    location: {
        zone: { type: String },
        aisle: { type: String },
        rack: { type: String },
        shelf: { type: String },
        bin: { type: String }
    },
    fefoCompliant: {
        type: Boolean,
        default: true
    },
    fefoRank: {
        type: Number
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ type: 1, createdAt: -1 });
transactionSchema.index({ productId: 1, batchNumber: 1 });
transactionSchema.index({ warehouseId: 1, createdAt: -1 });
transactionSchema.index({ performedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
