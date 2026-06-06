const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { validateNewsletter } = require('../middleware/validation');
const { protect, adminOnly } = require('../middleware/auth');

// Public route - Subscribe
router.post('/subscribe', validateNewsletter, newsletterController.subscribe);

// Public route - Unsubscribe
router.delete('/unsubscribe/:email', newsletterController.unsubscribe);

// ============================================
// ADMIN ROUTES (Protected)
// ============================================

// Get all subscribers
router.get('/', protect, adminOnly, newsletterController.getAllSubscribers);

// Delete subscriber
router.delete('/:id', protect, adminOnly, newsletterController.deleteSubscriber);

// Send newsletter to all subscribers
router.post('/send', protect, adminOnly, newsletterController.sendNewsletter);

module.exports = router;