const User = require('../models/User');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    // Filter by role if provided
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    sendSuccessResponse(res, 'Users fetched successfully', {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        limit
      }
    });

  } catch (error) {
    console.error('Get All Users Error:', error);
    sendErrorResponse(res, 'Error fetching users', 500);
  }
};

// @desc    Get single user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    sendSuccessResponse(res, 'User fetched successfully', { user });

  } catch (error) {
    console.error('Get User By ID Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid user ID', 400);
    }
    
    sendErrorResponse(res, 'Error fetching user', 500);
  }
};

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return sendErrorResponse(res, 'Please provide all required fields', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendErrorResponse(res, 'User with this email already exists', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role
    });

    sendSuccessResponse(res, 'User created successfully', {
      user: user.toSafeObject()
    }, 201);

  } catch (error) {
    console.error('Create User Error:', error);
    
    if (error.code === 11000) {
      return sendErrorResponse(res, 'User with this email already exists', 400);
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Error creating user', 500);
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    // Update fields
    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });
      
      if (existingUser) {
        return sendErrorResponse(res, 'Email already in use', 400);
      }
      
      user.email = email.toLowerCase();
    }

    await user.save();

    sendSuccessResponse(res, 'User updated successfully', {
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Update User Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid user ID', 400);
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Error updating user', 500);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return sendErrorResponse(res, 'You cannot delete your own account', 400);
    }

    await user.deleteOne();

    sendSuccessResponse(res, 'User deleted successfully', null);

  } catch (error) {
    console.error('Delete User Error:', error);
    
    if (error.kind === 'ObjectId') {
      return sendErrorResponse(res, 'Invalid user ID', 400);
    }
    
    sendErrorResponse(res, 'Error deleting user', 500);
  }
};

// @desc    Get all workers (for task assignment)
// @route   GET /api/users/workers
// @access  Private (Manager/Admin)
exports.getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ 
      role: 'Worker',
      isActive: true 
    })
    .select('name email')
    .sort({ name: 1 });

    sendSuccessResponse(res, 'Workers fetched successfully', {
      workers,
      count: workers.length
    });

  } catch (error) {
    console.error('Get Workers Error:', error);
    sendErrorResponse(res, 'Error fetching workers', 500);
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    sendSuccessResponse(res, 'User statistics fetched successfully', { stats });

  } catch (error) {
    console.error('Get User Stats Error:', error);
    sendErrorResponse(res, 'Error fetching user statistics', 500);
  }
};
