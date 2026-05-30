const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate =
    require('../middleware/authMiddleware');

const authorize =
    require('../middleware/roleMiddleware');

const router = express.Router();
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), taskController.createTask);
router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), taskController.getTasks);

module.exports = router;