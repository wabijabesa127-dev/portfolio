const { executeQuery } = require('../config/database');

// Submit contact message
const submitMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        await executeQuery(
            `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`,
            [name, email, phone || null, subject, message]
        );
        
        res.status(201).json({ success: true, message: 'Message sent successfully! I will get back to you soon.' });
    } catch (error) {
        console.error('Submit message error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
};

// Get all messages (admin)
const getAllMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        const messages = await executeQuery(
            `SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        const totalResult = await executeQuery(`SELECT COUNT(*) as total FROM contact_messages`);
        const total = totalResult[0].total;
        
        res.status(200).json({
            success: true,
            data: messages,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
};

// Get message by ID (admin)
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await executeQuery(`SELECT * FROM contact_messages WHERE id = ?`, [id]);
        
        if (messages.length === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        
        res.status(200).json({ success: true, data: messages[0] });
    } catch (error) {
        console.error('Get message error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch message' });
    }
};

// Mark message as read (admin)
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery(`UPDATE contact_messages SET is_read = TRUE WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: 'Message marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ success: false, message: 'Failed to update message' });
    }
};

// Delete message (admin)
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery(`DELETE FROM contact_messages WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete message' });
    }
};

module.exports = { submitMessage, getAllMessages, getMessageById, markAsRead, deleteMessage };