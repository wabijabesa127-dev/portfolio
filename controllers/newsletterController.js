const { executeQuery } = require('../config/database');
const { sendNewsletterWelcome } = require('../utils/emailService');

// Subscribe to newsletter
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if already subscribed
        const existing = await executeQuery(
            'SELECT * FROM newsletter_subscribers WHERE email = ?', 
            [email]
        );
        
        if (existing.length > 0) {
            if (existing[0].is_active) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already subscribed to the newsletter'
                });
            } else {
                // Reactivate subscription
                await executeQuery(
                    'UPDATE newsletter_subscribers SET is_active = TRUE, unsubscribed_at = NULL WHERE email = ?',
                    [email]
                );
            }
        } else {
            // New subscription
            await executeQuery(
                'INSERT INTO newsletter_subscribers (email) VALUES (?)',
                [email]
            );
        }
        
        // Send welcome email
        await sendNewsletterWelcome(email);
        
        res.status(200).json({
            success: true,
            message: 'Successfully subscribed to the newsletter! Check your email for confirmation.'
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again later.',
            error: error.message
        });
    }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
    try {
        const { email } = req.params;
        
        await executeQuery(
            'UPDATE newsletter_subscribers SET is_active = FALSE, unsubscribed_at = NOW() WHERE email = ?',
            [email]
        );
        
        res.status(200).json({
            success: true,
            message: 'Successfully unsubscribed from the newsletter'
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe',
            error: error.message
        });
    }
};

// Get all subscribers (admin)
const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await executeQuery(
            'SELECT id, email, is_active, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC'
        );
        
        res.status(200).json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers',
            error: error.message
        });
    }
};

// Delete subscriber (admin)
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        
        await executeQuery('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
        
        res.status(200).json({
            success: true,
            message: 'Subscriber deleted successfully'
        });
    } catch (error) {
        console.error('Delete subscriber error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete subscriber',
            error: error.message
        });
    }
};

module.exports = {
    subscribe,
    unsubscribe,
    getAllSubscribers,
    deleteSubscriber
};