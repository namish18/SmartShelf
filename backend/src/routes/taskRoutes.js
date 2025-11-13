const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskCompletionRate
} = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Worker accessible routes
router.get('/my-tasks', getMyTasks);
router.patch('/:id/status', updateTaskStatus);

// Manager and Admin routes
router.get('/analytics/completion-rate', authorize('Manager', 'Admin'), getTaskCompletionRate);
router.get('/', authorize('Manager', 'Admin'), getAllTasks);
router.post('/', authorize('Manager', 'Admin'), createTask);
router.get('/:id', getTaskById);
router.put('/:id', authorize('Manager', 'Admin'), updateTask);
router.delete('/:id', authorize('Manager', 'Admin'), deleteTask);

module.exports = router;
