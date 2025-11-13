const User = require('../models/User');
const { generateToken } = require('../utils/jwtHelper');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendErrorResponse(res, 'Please provide all required fields', 400);
    }

    if (password.length < 6) {
      return sendErrorResponse(res, 'Password must be at least 6 characters long', 400);
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
      role: role || 'Worker' // Default to Worker if no role provided
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Set token in cookie
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', token, cookieOptions);

    sendSuccessResponse(res, 'User registered successfully', {
      user: user.toSafeObject(),
      token
    }, 201);

  } catch (error) {
    console.error('Register Error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return sendErrorResponse(res, 'User with this email already exists', 400);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Error registering user', 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendErrorResponse(res, 'Please provide email and password', 400);
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return sendErrorResponse(res, 'Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return sendErrorResponse(res, 'Your account has been deactivated. Please contact admin.', 403);
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return sendErrorResponse(res, 'Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set token in cookie
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', token, cookieOptions);

    sendSuccessResponse(res, 'Login successful', {
      user: user.toSafeObject(),
      token
    });

  } catch (error) {
    console.error('Login Error:', error);
    sendErrorResponse(res, 'Error during login', 500);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Clear cookie
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true
    });

    sendSuccessResponse(res, 'Logout successful', null);
  } catch (error) {
    console.error('Logout Error:', error);
    sendErrorResponse(res, 'Error during logout', 500);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    sendSuccessResponse(res, 'User profile fetched successfully', {
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Get Me Error:', error);
    sendErrorResponse(res, 'Error fetching user profile', 500);
  }
};

// @desc    Update user profile (name, email)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    // Update fields
    if (name) user.name = name;
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

    sendSuccessResponse(res, 'Profile updated successfully', {
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendErrorResponse(res, messages.join(', '), 400);
    }
    
    sendErrorResponse(res, 'Error updating profile', 500);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return sendErrorResponse(res, 'Please provide current and new password', 400);
    }

    if (newPassword.length < 6) {
      return sendErrorResponse(res, 'New password must be at least 6 characters long', 400);
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    // Check current password
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return sendErrorResponse(res, 'Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccessResponse(res, 'Password changed successfully', null);

  } catch (error) {
    console.error('Change Password Error:', error);
    sendErrorResponse(res, 'Error changing password', 500);
  }
};
