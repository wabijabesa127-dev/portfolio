const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { validateBlogPost } = require('../middleware/validation');

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all blog posts (with pagination & filtering)
router.get('/', blogController.getAllPosts);

// Get featured post
router.get('/featured', blogController.getFeaturedPost);

// Get single post by slug
router.get('/:slug', blogController.getPostBySlug);

// Get posts by category
router.get('/category/:category', blogController.getPostsByCategory);

// Search posts
router.get('/search/:query', blogController.searchPosts);

// ============================================
// ADMIN ROUTES (Protected)
// ============================================

// Create new post
router.post('/', validateBlogPost, blogController.createPost);

// Update post
router.put('/:id', validateBlogPost, blogController.updatePost);

// Delete post
router.delete('/:id', blogController.deletePost);

// Toggle featured status
router.patch('/:id/featured', blogController.toggleFeatured);

module.exports = router;