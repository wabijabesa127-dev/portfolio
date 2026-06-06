const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/:slug', projectController.getProjectBySlug);
router.get('/category/:category', projectController.getProjectsByCategory);

// Admin routes
router.post('/', protect, adminOnly, projectController.createProject);
router.put('/:id', protect, adminOnly, projectController.updateProject);
router.delete('/:id', protect, adminOnly, projectController.deleteProject);

module.exports = router;