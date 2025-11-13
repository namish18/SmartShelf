const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getWorkers,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Routes accessible by Manager and Admin
router.get('/workers', authorize('Manager', 'Admin'), getWorkers);

// Admin only routes
router.get('/stats', authorize('Admin'), getUserStats);
router.get('/', authorize('Admin'), getAllUsers);
router.post('/', authorize('Admin'), createUser);
router.get('/:id', authorize('Admin'), getUserById);
router.put('/:id', authorize('Admin'), updateUser);
router.delete('/:id', authorize('Admin'), deleteUser);

module.exports = router;
