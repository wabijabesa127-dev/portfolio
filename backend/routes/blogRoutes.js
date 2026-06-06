const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { validateBlogPost } = require('../middleware/validation');
const { protect, adminOnly } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all blog posts
router.get('/', blogController.getAllPosts);

// Get featured post
router.get('/featured', blogController.getFeaturedPost);

// Get single post by slug
router.get('/:slug', blogController.getPostBySlug);

// Get posts by category
router.get('/category/:category', blogController.getPostsByCategory);

// Search posts
router.get('/search/:query', blogController.searchPosts);

// Get comments for a post
router.get('/:postId/comments', blogController.getComments);

// Add comment to a post (public)
router.post('/:postId/comments', blogController.addComment);

// ============================================
// ADMIN ROUTES (Protected)
// ============================================

// Create new post
router.post('/', protect, adminOnly, validateBlogPost, blogController.createPost);

// Update post
router.put('/:id', protect, adminOnly, validateBlogPost, blogController.updatePost);

// Delete post
router.delete('/:id', protect, adminOnly, blogController.deletePost);

// Toggle featured status
router.patch('/:id/featured', protect, adminOnly, blogController.toggleFeatured);

// Approve comment
router.patch('/comments/:commentId/approve', protect, adminOnly, blogController.approveComment);

// Delete comment
router.delete('/comments/:commentId', protect, adminOnly, blogController.deleteComment);

module.exports = router;