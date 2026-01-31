const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

// Get all tasks with filters
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build filter query
    const filter = { userId: req.userId };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskData = {
        ...req.body,
        userId: req.userId
      };

      const task = new Task(taskData);
      await task.save();

      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update task
router.put('/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    
    const stats = {
      total: tasks.length,
      byStatus: {
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
      },
      byPriority: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length
      },
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
