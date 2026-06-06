const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { validateNewsletter } = require('../middleware/validation');

// Public route - Subscribe
router.post('/subscribe', validateNewsletter, newsletterController.subscribe);

// Public route - Unsubscribe
router.delete('/unsubscribe/:email', newsletterController.unsubscribe);

// Admin routes
router.get('/', newsletterController.getAllSubscribers);
router.delete('/:id', newsletterController.deleteSubscriber);

module.exports = router;