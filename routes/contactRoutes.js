const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContactMessage } = require('../middleware/validation');

// Public route - Submit contact message
router.post('/', validateContactMessage, contactController.submitMessage);

// Admin routes (protected in production)
router.get('/', contactController.getAllMessages);
router.get('/:id', contactController.getMessageById);
router.patch('/:id/read', contactController.markAsRead);
router.delete('/:id', contactController.deleteMessage);

module.exports = router;