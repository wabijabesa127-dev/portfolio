const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = await executeQuery(`SELECT id, username, email, role FROM users WHERE id = ?`, [decoded.id]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        req.user = users[0];
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin access required' });
    }
};

module.exports = { protect, adminOnly };