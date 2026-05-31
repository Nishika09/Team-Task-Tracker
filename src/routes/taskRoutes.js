const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate =
    require('../middleware/authMiddleware');

const authorize =
    require('../middleware/roleMiddleware');

const router = express.Router();
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), taskController.createTask);
router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), taskController.getTasks);
router.patch('/:id/status', authenticate, taskController.updateTaskStatus);
router.get('/:id', authenticate, taskController.getTaskById);
router.delete('/:id', authenticate, authorize('ADMIN', 'MANAGER'), taskController.deleteTask);
router.patch(
    '/:id/assign',
    authenticate,
    authorize(
        'ADMIN',
        'MANAGER'
    ),
    taskController.assignTask
);
module.exports = router;