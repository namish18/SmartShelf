const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters long'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be assigned to a worker'],
      validate: {
        validator: async function(value) {
          const User = mongoose.model('User');
          const user = await User.findById(value);
          return user && user.role === 'Worker';
        },
        message: 'Task can only be assigned to users with Worker role'
      }
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have an assigner']
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Pending'
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient querying
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ assignedTo: 1, status: 1 }); // Compound index

// Virtual: Task duration (time between creation and completion)
taskSchema.virtual('duration').get(function () {
  if (this.status !== 'Completed' || !this.completedAt) {
    return null;
  }
  const diffMs = this.completedAt - this.createdAt;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  return `${diffHours} hours`;
});

// Virtual: Is overdue (tasks pending for more than 48 hours)
taskSchema.virtual('isOverdue').get(function () {
  if (this.status === 'Completed') return false;
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours > 48;
});

// Pre-save middleware to set completedAt when status changes to Completed
taskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'Completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Clear completedAt if status changes from Completed to something else
  if (this.isModified('status') && this.status !== 'Completed' && this.completedAt) {
    this.completedAt = null;
  }
  
  next();
});

// Static method to get tasks by worker
taskSchema.statics.getTasksByWorker = function(workerId) {
  return this.find({ assignedTo: workerId })
    .populate('assignedBy', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to get pending tasks count
taskSchema.statics.getPendingCount = function() {
  return this.countDocuments({ status: 'Pending' });
};

// Static method to get completion rate
taskSchema.statics.getCompletionRate = async function() {
  const total = await this.countDocuments();
  const completed = await this.countDocuments({ status: 'Completed' });
  return total === 0 ? 0 : ((completed / total) * 100).toFixed(2);
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
