const { body, validationResult } = require('express-validator');

// Validate blog post
const validateBlogPost = [
    body('title').notEmpty().withMessage('Title is required').trim().isLength({ min: 5, max: 255 }),
    body('slug').notEmpty().withMessage('Slug is required').trim(),
    body('excerpt').notEmpty().withMessage('Excerpt is required').trim().isLength({ min: 20, max: 500 }),
    body('content').notEmpty().withMessage('Content is required').trim().isLength({ min: 50 }),
    body('category').notEmpty().withMessage('Category is required'),
    body('category_name').notEmpty().withMessage('Category name is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

// Validate contact message
const validateContactMessage = [
    body('name').notEmpty().withMessage('Name is required').trim().isLength({ min: 2, max: 100 }),
    body('email').notEmpty().withMessage('Email is required').isEmail(),
    body('subject').notEmpty().withMessage('Subject is required').trim().isLength({ min: 3, max: 255 }),
    body('message').notEmpty().withMessage('Message is required').trim().isLength({ min: 10, max: 5000 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

// Validate newsletter subscription
const validateNewsletter = [
    body('email').notEmpty().withMessage('Email is required').isEmail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

// Validate login
const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

// Validate register
const validateRegister = [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }),
    body('email').notEmpty().withMessage('Email is required').isEmail(),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateBlogPost,
    validateContactMessage,
    validateNewsletter,
    validateLogin,
    validateRegister
};