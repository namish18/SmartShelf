const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: [true, 'Action is required'],
        trim: true
    },
    entityType: {
        type: String,
        required: [true, 'Entity type is required'],
        enum: ['user', 'product', 'inventory', 'warehouse', 'alert', 'transaction', 'batch']
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Entity ID is required']
    },
    changes: {
        before: { type: mongoose.Schema.Types.Mixed },
        after: { type: mongoose.Schema.Types.Mixed }
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User performing action is required']
    },
    ipAddress: {
        type: String,
        required: [true, 'IP address is required']
    },
    userAgent: {
        type: String
    },
    sessionId: {
        type: String
    },
    success: {
        type: Boolean,
        default: true
    },
    errorMessage: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

// TTL index to auto-delete old audit logs after 2 years
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
