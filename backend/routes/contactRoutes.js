const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContactMessage } = require('../middleware/validation');
const { protect, adminOnly } = require('../middleware/auth');

// Public route - Submit contact message
router.post('/', validateContactMessage, contactController.submitMessage);

// ============================================
// ADMIN ROUTES (Protected)
// ============================================

// Get all messages
router.get('/', protect, adminOnly, contactController.getAllMessages);

// Get message by ID
router.get('/:id', protect, adminOnly, contactController.getMessageById);

// Mark message as read
router.patch('/:id/read', protect, adminOnly, contactController.markAsRead);

// Delete message
router.delete('/:id', protect, adminOnly, contactController.deleteMessage);

module.exports = router;