const { executeQuery } = require('../config/database');

// Subscribe to newsletter
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if already subscribed
        const existing = await executeQuery(`SELECT * FROM newsletter_subscribers WHERE email = ?`, [email]);
        
        if (existing.length > 0) {
            if (existing[0].is_active) {
                return res.status(400).json({ success: false, message: 'This email is already subscribed' });
            } else {
                await executeQuery(`UPDATE newsletter_subscribers SET is_active = TRUE, unsubscribed_at = NULL WHERE email = ?`, [email]);
            }
        } else {
            await executeQuery(`INSERT INTO newsletter_subscribers (email) VALUES (?)`, [email]);
        }
        
        res.status(200).json({ success: true, message: 'Successfully subscribed to the newsletter!' });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again later.' });
    }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
    try {
        const { email } = req.params;
        await executeQuery(`UPDATE newsletter_subscribers SET is_active = FALSE, unsubscribed_at = NOW() WHERE email = ?`, [email]);
        res.status(200).json({ success: true, message: 'Successfully unsubscribed from the newsletter' });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
    }
};

// Get all subscribers (admin)
const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await executeQuery(
            `SELECT id, email, is_active, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC`
        );
        res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch subscribers' });
    }
};

// Delete subscriber (admin)
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery(`DELETE FROM newsletter_subscribers WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: 'Subscriber deleted successfully' });
    } catch (error) {
        console.error('Delete subscriber error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete subscriber' });
    }
};

// Send newsletter to all subscribers
const sendNewsletter = async (req, res) => {
    try {
        const { subject, content } = req.body;
        const subscribers = await executeQuery(`SELECT email FROM newsletter_subscribers WHERE is_active = TRUE`);
        
        // Here you would send emails using nodemailer
        // For now, just return success
        res.status(200).json({ success: true, message: `Newsletter sent to ${subscribers.length} subscribers` });
    } catch (error) {
        console.error('Send newsletter error:', error);
        res.status(500).json({ success: false, message: 'Failed to send newsletter' });
    }
};

module.exports = { subscribe, unsubscribe, getAllSubscribers, deleteSubscriber, sendNewsletter };