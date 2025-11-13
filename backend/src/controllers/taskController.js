const Task = require('../models/Task');
const User = require('../models/User');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private (Manager/Admin)
exports.getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by assigned worker
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    // Search by description
    if (req.query.search) {
      query.description = { $regex: req.query.search, $options: 'i' };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.order === 'asc' ? 1 : -1;
      sortOption = { [sortField]: sortOrder };
    }

    // Get tasks with pagination
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    sendSuccessResponse(res, 'Tasks fetched successfully', {
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        limit
      }
    });

  } catch (error) {
    console.error('Get All Tasks Error:', error);
    sendErrorResponse(res, 'Error fetching tasks', 500);
  }
};

// @desc    Get logged-in worker's tasks
// @route   GET /api/tasks/my-tasks
// @access  Private (Worker)
exports.getMyTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query for current user's tasks
    const query = { assignedTo: req.user.id };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Get tasks
    const tasks = await Task.find(query)
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    sendSuccessResponse(res, 'Your tasks fetched successfully', {
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        limit
      }
    });

  } catch (error) {
    console.error('Get My Tasks Error:', error);
    sendErrorResponse(res, 'Error fetching your tasks', 500);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role');

    if (!task) {
      return sendErrorResponse(res, 'Task not found', 404);
    }

    // Workers can only view their own tasks
    if (req.user.role === 'Worker' && task.assignedTo._id.toString() !== req.user.id) {
      return sendErrorResponse(res, 'Not authorized to view this task', 403);
    }

    sendSuccessResponse(res, 'Task fetched successfully', { task });

  } catch (error) {
    console.error('Get Task By ID Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid task ID', 400);
    }
    
    sendErrorResponse(res, 'Error fetching task', 500);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Manager/Admin)
exports.createTask = async (req, res) => {
  try {
    const { description, assignedTo } = req.body;

    // Validation
    if (!description || !assignedTo) {
      return sendErrorResponse(res, 'Please provide description and assignedTo', 400);
    }

    // Verify the assignedTo user exists and is a Worker
    const worker = await User.findById(assignedTo);
    if (!worker) {
      return sendErrorResponse(res, 'Assigned user not found', 404);
    }

    if (worker.role !== 'Worker') {
      return sendErrorResponse(res, 'Tasks can only be assigned to Workers', 400);
    }

    if (!worker.isActive) {
      return sendErrorResponse(res, 'Cannot assign task to inactive worker', 400);
    }

    // Create task
    const task = await Task.create({
      description,
      assignedTo,
      assignedBy: req.user.id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    sendSuccessResponse(res, 'Task created successfully', {
      task: populatedTask
    }, 201);

  } catch (error) {
    console.error('Create Task Error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Error creating task', 500);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Manager/Admin)
exports.updateTask = async (req, res) => {
  try {
    const { description, assignedTo, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return sendErrorResponse(res, 'Task not found', 404);
    }

    // Update fields
    if (description) task.description = description;
    if (status) task.status = status;
    
    if (assignedTo) {
      // Verify the new assignedTo user exists and is a Worker
      const worker = await User.findById(assignedTo);
      if (!worker) {
        return sendErrorResponse(res, 'Assigned user not found', 404);
      }
      if (worker.role !== 'Worker') {
        return sendErrorResponse(res, 'Tasks can only be assigned to Workers', 400);
      }
      task.assignedTo = assignedTo;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    sendSuccessResponse(res, 'Task updated successfully', {
      task: updatedTask
    });

  } catch (error) {
    console.error('Update Task Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid task ID', 400);
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Error updating task', 500);
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private (Worker for own tasks, Manager/Admin for all)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return sendErrorResponse(res, 'Please provide status', 400);
    }

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return sendErrorResponse(res, 'Invalid status value', 400);
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return sendErrorResponse(res, 'Task not found', 404);
    }

    // Workers can only update their own tasks
    if (req.user.role === 'Worker' && task.assignedTo.toString() !== req.user.id) {
      return sendErrorResponse(res, 'Not authorized to update this task', 403);
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    sendSuccessResponse(res, 'Task status updated successfully', {
      task: updatedTask
    });

  } catch (error) {
    console.error('Update Task Status Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid task ID', 400);
    }
    
    sendErrorResponse(res, 'Error updating task status', 500);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Manager/Admin)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return sendErrorResponse(res, 'Task not found', 404);
    }

    await task.deleteOne();

    sendSuccessResponse(res, 'Task deleted successfully', null);

  } catch (error) {
    console.error('Delete Task Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid task ID', 400);
    }
    
    sendErrorResponse(res, 'Error deleting task', 500);
  }
};

// @desc    Get task completion analytics
// @route   GET /api/tasks/analytics/completion-rate
// @access  Private (Manager/Admin)
exports.getTaskCompletionRate = async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'Pending' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const completed = await Task.countDocuments({ status: 'Completed' });

    const completionRate = total === 0 ? 0 : ((completed / total) * 100).toFixed(2);

    // Get completion by worker
    const byWorker = await Task.aggregate([
      {
        $group: {
          _id: { 
            worker: '$assignedTo',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.worker',
          foreignField: '_id',
          as: 'workerInfo'
        }
      },
      {
        $unwind: '$workerInfo'
      },
      {
        $group: {
          _id: '$_id.worker',
          name: { $first: '$workerInfo.name' },
          email: { $first: '$workerInfo.email' },
          tasks: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          }
        }
      }
    ]);

    const analytics = {
      overall: {
        total,
        pending,
        inProgress,
        completed,
        completionRate: parseFloat(completionRate)
      },
      byWorker
    };

    sendSuccessResponse(res, 'Task completion analytics fetched successfully', { analytics });

  } catch (error) {
    console.error('Get Task Completion Rate Error:', error);
    sendErrorResponse(res, 'Error fetching task analytics', 500);
  }
};
