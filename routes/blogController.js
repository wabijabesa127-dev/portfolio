const { executeQuery } = require('../config/database');

// Get all blog posts with pagination
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category || null;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT id, title, slug, excerpt, category, category_name, 
                   image_url, author, read_time, is_featured, views, 
                   likes, tags, created_at
            FROM blog_posts 
            WHERE is_published = TRUE
        `;
        
        let countQuery = `SELECT COUNT(*) as total FROM blog_posts WHERE is_published = TRUE`;
        const params = [];
        
        if (category && category !== 'all') {
            query += ` AND category = ?`;
            countQuery += ` AND category = ?`;
            params.push(category);
        }
        
        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        
        const posts = await executeQuery(query, params);
        
        const countParams = category && category !== 'all' ? [category] : [];
        const totalResult = await executeQuery(countQuery, countParams);
        const total = totalResult[0].total;
        
        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts',
            error: error.message
        });
    }
};

// Get featured post
const getFeaturedPost = async (req, res) => {
    try {
        const query = `
            SELECT * FROM blog_posts 
            WHERE is_featured = TRUE AND is_published = TRUE 
            LIMIT 1
        `;
        
        const posts = await executeQuery(query);
        
        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No featured post found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: posts[0]
        });
    } catch (error) {
        console.error('Get featured post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured post',
            error: error.message
        });
    }
};

// Get single post by slug
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Increment view count
        await executeQuery(`UPDATE blog_posts SET views = views + 1 WHERE slug = ?`, [slug]);
        
        const query = `SELECT * FROM blog_posts WHERE slug = ? AND is_published = TRUE`;
        const posts = await executeQuery(query, [slug]);
        
        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: posts[0]
        });
    } catch (error) {
        console.error('Get post by slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
            error: error.message
        });
    }
};

// Get posts by category
const getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        
        const query = `
            SELECT id, title, slug, excerpt, category, category_name, 
                   image_url, author, read_time, created_at
            FROM blog_posts 
            WHERE category = ? AND is_published = TRUE
            ORDER BY created_at DESC
        `;
        
        const posts = await executeQuery(query, [category]);
        
        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        console.error('Get posts by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts by category',
            error: error.message
        });
    }
};

// Search posts
const searchPosts = async (req, res) => {
    try {
        const { query } = req.params;
        
        const searchQuery = `
            SELECT id, title, slug, excerpt, category, category_name, 
                   image_url, author, read_time, created_at
            FROM blog_posts 
            WHERE is_published = TRUE 
            AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
            ORDER BY 
                CASE 
                    WHEN title LIKE ? THEN 1
                    WHEN excerpt LIKE ? THEN 2
                    ELSE 3
                END
            LIMIT 20
        `;
        
        const searchTerm = `%${query}%`;
        const posts = await executeQuery(searchQuery, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);
        
        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
            searchTerm: query
        });
    } catch (error) {
        console.error('Search posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search posts',
            error: error.message
        });
    }
};

// Create new post (admin)
const createPost = async (req, res) => {
    try {
        const {
            title, slug, excerpt, content, category,
            category_name, image_url, read_time, is_featured, tags
        } = req.body;
        
        const query = `
            INSERT INTO blog_posts 
            (title, slug, excerpt, content, category, category_name, 
             image_url, read_time, is_featured, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await executeQuery(query, [
            title, slug, excerpt, content, category,
            category_name, image_url, read_time || 5, is_featured || false,
            JSON.stringify(tags || [])
        ]);
        
        res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create post',
            error: error.message
        });
    }
};

// Update post (admin)
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const fields = [];
        const values = [];
        
        const allowedFields = ['title', 'slug', 'excerpt', 'content', 'category', 
                               'category_name', 'image_url', 'read_time', 'is_featured', 'tags'];
        
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(field === 'tags' ? JSON.stringify(updates[field]) : updates[field]);
            }
        }
        
        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }
        
        values.push(id);
        const query = `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`;
        
        await executeQuery(query, values);
        
        res.status(200).json({
            success: true,
            message: 'Blog post updated successfully'
        });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update post',
            error: error.message
        });
    }
};

// Delete post (admin)
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        
        await executeQuery('DELETE FROM blog_posts WHERE id = ?', [id]);
        
        res.status(200).json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete post',
            error: error.message
        });
    }
};

// Toggle featured status
const toggleFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        
        const post = await executeQuery('SELECT is_featured FROM blog_posts WHERE id = ?', [id]);
        if (post.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
        
        const newStatus = !post[0].is_featured;
        await executeQuery('UPDATE blog_posts SET is_featured = ? WHERE id = ?', [newStatus, id]);
        
        res.status(200).json({
            success: true,
            message: `Post ${newStatus ? 'featured' : 'unfeatured'} successfully`,
            is_featured: newStatus
        });
    } catch (error) {
        console.error('Toggle featured error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle featured status',
            error: error.message
        });
    }
};

module.exports = {
    getAllPosts,
    getFeaturedPost,
    getPostBySlug,
    getPostsByCategory,
    searchPosts,
    createPost,
    updatePost,
    deletePost,
    toggleFeatured
};