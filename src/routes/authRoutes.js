const express = require('express');
const authController = require('../controllers/authController');
const authenticate =
require('../middleware/authMiddleware');

const authorize =
require('../middleware/roleMiddleware');

const router = express.Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh)

module.exports = router;