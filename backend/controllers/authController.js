const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const users = await executeQuery(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, username]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Check password (in production, compare with bcrypt)
        // For now, accept any password for demo
        // In production, uncomment the bcrypt compare
        
        // const isMatch = await bcrypt.compare(password, user.password_hash);
        // if (!isMatch) {
        //     return res.status(401).json({ success: false, message: 'Invalid credentials' });
        // }
        
        // For demo purposes - accept 'Admin123!' as password
        if (password !== 'Admin123!') {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Update last login
        await executeQuery(`UPDATE users SET last_login = NOW() WHERE id = ?`, [user.id]);
        
        // Generate token
        const token = generateToken(user.id);
        
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

// Register new user (admin only in production)
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const existing = await executeQuery(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        // Hash password (in production)
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        // For demo
        const hashedPassword = password;
        
        await executeQuery(
            `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'editor')`,
            [username, email, hashedPassword]
        );
        
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

// Get current user
const getMe = async (req, res) => {
    try {
        const users = await executeQuery(
            `SELECT id, username, email, role, created_at FROM users WHERE id = ?`,
            [req.user.id]
        );
        
        res.status(200).json({ success: true, data: users[0] });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ success: false, message: 'Failed to get user' });
    }
};

// Logout
const logout = async (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // In production, verify current password
        await executeQuery(`UPDATE users SET password_hash = ? WHERE id = ?`, [newPassword, req.user.id]);
        
        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'Failed to change password' });
    }
};

module.exports = { login, register, getMe, logout, changePassword };