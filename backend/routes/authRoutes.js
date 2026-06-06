const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);

// Protected routes
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;