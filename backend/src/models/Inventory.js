const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{2}-\d{3,}$/, 'SKU must follow format: XX-000 (e.g., DA-001)']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required'],
      validate: {
        validator: function(value) {
          return value <= new Date();
        },
        message: 'Purchase date cannot be in the future'
      }
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
      validate: {
        validator: function(value) {
          return value > this.purchaseDate;
        },
        message: 'Expiry date must be after purchase date'
      },
      index: true
    },
    supplier: {
      type: String,
      required: [true, 'Supplier is required'],
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient querying
inventorySchema.index({ sku: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ expiryDate: 1 });
inventorySchema.index({ quantity: 1 });
inventorySchema.index({ supplier: 1 });

// Compound index for category-based queries with expiry
inventorySchema.index({ category: 1, expiryDate: 1 });

// Virtual: Days until expiry
inventorySchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiryDate) return null;
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual: Is expired
inventorySchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date(this.expiryDate) < new Date();
});

// Virtual: Is low stock (threshold: 10)
inventorySchema.virtual('isLowStock').get(function () {
  return this.quantity > 0 && this.quantity < 10;
});

// Virtual: Stock status
inventorySchema.virtual('stockStatus').get(function () {
  if (this.quantity === 0) return 'Out of Stock';
  if (this.quantity < 10) return 'Low Stock';
  if (this.quantity < 50) return 'Medium Stock';
  return 'In Stock';
});

// Pre-save middleware to update lastModifiedBy
inventorySchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this._updateUser || this.lastModifiedBy;
  }
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
