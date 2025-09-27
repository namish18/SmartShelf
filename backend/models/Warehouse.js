const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Warehouse name is required'],
        trim: true,
        maxlength: [100, 'Warehouse name cannot exceed 100 characters']
    },
    code: {
        type: String,
        required: [true, 'Warehouse code is required'],
        unique: true,
        trim: true,
        uppercase: true,
        maxlength: [10, 'Warehouse code cannot exceed 10 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            default: 'India'
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
        },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    capacity: {
        totalArea: {
            type: Number,
            required: [true, 'Total area is required'],
            min: [0, 'Total area cannot be negative']
        },
        storageArea: {
            type: Number,
            required: [true, 'Storage area is required'],
            min: [0, 'Storage area cannot be negative']
        },
        unit: {
            type: String,
            enum: ['sqft', 'sqm'],
            default: 'sqft'
        }
    },
    zones: [{
        name: {
            type: String,
            required: [true, 'Zone name is required']
        },
        code: {
            type: String,
            required: [true, 'Zone code is required']
        },
        type: {
            type: String,
            enum: ['RECEIVING', 'STORAGE', 'PICKING', 'PACKING', 'SHIPPING', 'QUARANTINE', 'COLD_STORAGE', 'FREEZER'],
            required: [true, 'Zone type is required']
        },
        temperatureControl: {
            required: { type: Boolean, default: false },
            minTemp: { type: Number },
            maxTemp: { type: Number },
            sensors: [{
                sensorId: { type: String },
                location: { type: String },
                isActive: { type: Boolean, default: true }
            }]
        },
        layout: {
            aisles: [{
                aisleCode: { type: String, required: true },
                racks: [{
                    rackCode: { type: String, required: true },
                    shelves: [{
                        shelfCode: { type: String, required: true },
                        bins: [{ type: String }]
                    }]
                }]
            }]
        }
    }],
    contactInfo: {
        managerName: {
            type: String,
            required: [true, 'Manager name is required']
        },
        managerEmail: {
            type: String,
            required: [true, 'Manager email is required'],
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
        },
        managerPhone: {
            type: String,
            required: [true, 'Manager phone is required'],
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
        },
        alternateContact: {
            name: { type: String },
            email: { type: String },
            phone: { type: String }
        }
    },
    operatingHours: {
        weekdays: {
            open: { type: String, default: '09:00' },
            close: { type: String, default: '18:00' }
        },
        weekends: {
            open: { type: String, default: '09:00' },
            close: { type: String, default: '15:00' }
        },
        timezone: {
            type: String,
            default: 'Asia/Kolkata'
        }
    },
    certifications: [{
        name: {
            type: String,
            required: true
        },
        certifyingBody: { type: String },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        certificateNumber: { type: String },
        isActive: { type: Boolean, default: true }
    }],
    complianceRequirements: {
        gmp: { type: Boolean, default: false },
        haccp: { type: Boolean, default: false },
        iso22000: { type: Boolean, default: false },
        fda: { type: Boolean, default: false },
        fssai: { type: Boolean, default: false }
    },
    equipment: [{
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['forklift', 'conveyor', 'scanner', 'scale', 'printer', 'refrigeration', 'monitoring'],
            required: true
        },
        serialNumber: { type: String },
        manufacturer: { type: String },
        installationDate: { type: Date },
        lastMaintenanceDate: { type: Date },
        nextMaintenanceDate: { type: Date },
        isActive: { type: Boolean, default: true }
    }],
    settings: {
        defaultExpiryAlertDays: {
            type: Number,
            default: 7
        },
        autoFefoEnabled: {
            type: Boolean,
            default: true
        },
        temperatureMonitoringEnabled: {
            type: Boolean,
            default: true
        },
        qrScanningEnabled: {
            type: Boolean,
            default: true
        },
        batchTrackingEnabled: {
            type: Boolean,
            default: true
        }
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

// Indexes
warehouseSchema.index({ code: 1 });
warehouseSchema.index({ 'location.city': 1, 'location.state': 1 });
warehouseSchema.index({ isActive: 1 });

// Virtual for total inventory value
warehouseSchema.virtual('totalInventoryValue', {
    ref: 'Inventory',
    localField: '_id',
    foreignField: 'warehouseId',
    count: false
});

// Virtual for active zones count
warehouseSchema.virtual('activeZonesCount').get(function() {
    return this.zones ? this.zones.length : 0;
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
