const { executeQuery } = require('../config/database');

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await executeQuery(
            `SELECT id, title, slug, description, category, technologies, image_url, github_url, live_url, featured
             FROM projects ORDER BY featured DESC, order_position ASC`
        );
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
};

// Get featured projects
const getFeaturedProjects = async (req, res) => {
    try {
        const projects = await executeQuery(
            `SELECT * FROM projects WHERE featured = TRUE ORDER BY order_position ASC LIMIT 3`
        );
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error('Get featured error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch featured projects' });
    }
};

// Get project by slug
const getProjectBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const projects = await executeQuery(`SELECT * FROM projects WHERE slug = ?`, [slug]);
        
        if (projects.length === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        
        res.status(200).json({ success: true, data: projects[0] });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch project' });
    }
};

// Get projects by category
const getProjectsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const projects = await executeQuery(
            `SELECT * FROM projects WHERE category = ? ORDER BY featured DESC`,
            [category]
        );
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error('Get by category error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
};

// Create project (admin)
const createProject = async (req, res) => {
    try {
        const { title, slug, description, full_description, category, technologies, image_url, github_url, live_url, featured } = req.body;
        
        const result = await executeQuery(
            `INSERT INTO projects (title, slug, description, full_description, category, technologies, image_url, github_url, live_url, featured)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, description, full_description, category, JSON.stringify(technologies || []), image_url, github_url, live_url, featured || false]
        );
        
        res.status(201).json({ success: true, message: 'Project created', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ success: false, message: 'Failed to create project' });
    }
};

// Update project (admin)
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (updates.technologies) {
            updates.technologies = JSON.stringify(updates.technologies);
        }
        
        const fields = [];
        const values = [];
        const allowedFields = ['title', 'slug', 'description', 'full_description', 'category', 'technologies', 'image_url', 'github_url', 'live_url', 'featured', 'order_position'];
        
        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
        
        if (fields.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }
        
        values.push(id);
        await executeQuery(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
        
        res.status(200).json({ success: true, message: 'Project updated' });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ success: false, message: 'Failed to update project' });
    }
};

// Delete project (admin)
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery(`DELETE FROM projects WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
};

module.exports = {
    getAllProjects, getFeaturedProjects, getProjectBySlug,
    getProjectsByCategory, createProject, updateProject, deleteProject
};