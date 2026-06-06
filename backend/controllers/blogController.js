const { executeQuery } = require('../config/database');

// Get all blog posts with pagination
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const category = req.query.category || null;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT id, title, slug, excerpt, category, category_name, 
                   image_url, author, read_time, is_featured, views, 
                   comments_count, tags, created_at
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
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch posts', error: error.message });
    }
};

// Get featured post
const getFeaturedPost = async (req, res) => {
    try {
        const posts = await executeQuery(
            `SELECT * FROM blog_posts WHERE is_featured = TRUE AND is_published = TRUE LIMIT 1`
        );
        
        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: 'No featured post found' });
        }
        
        res.status(200).json({ success: true, data: posts[0] });
    } catch (error) {
        console.error('Get featured error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch featured post' });
    }
};

// Get single post by slug
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Increment view count
        await executeQuery(`UPDATE blog_posts SET views = views + 1 WHERE slug = ?`, [slug]);
        
        const posts = await executeQuery(
            `SELECT * FROM blog_posts WHERE slug = ? AND is_published = TRUE`,
            [slug]
        );
        
        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        
        // Get comments for this post
        const comments = await executeQuery(
            `SELECT id, name, comment, created_at FROM blog_comments 
             WHERE post_id = ? AND is_approved = TRUE ORDER BY created_at DESC`,
            [posts[0].id]
        );
        
        res.status(200).json({ success: true, data: posts[0], comments });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch post' });
    }
};

// Get comments for a post
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        
        const comments = await executeQuery(
            `SELECT id, name, comment, created_at FROM blog_comments 
             WHERE post_id = ? AND is_approved = TRUE ORDER BY created_at DESC`,
            [postId]
        );
        
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch comments' });
    }
};

// Add comment to post
const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { name, email, comment } = req.body;
        
        // Check if post exists
        const post = await executeQuery(`SELECT id FROM blog_posts WHERE id = ?`, [postId]);
        if (post.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        
        // Add comment
        await executeQuery(
            `INSERT INTO blog_comments (post_id, name, email, comment) VALUES (?, ?, ?, ?)`,
            [postId, name, email, comment]
        );
        
        // Update comments count
        await executeQuery(
            `UPDATE blog_posts SET comments_count = comments_count + 1 WHERE id = ?`,
            [postId]
        );
        
        res.status(201).json({ success: true, message: 'Comment added successfully. Awaiting approval.' });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ success: false, message: 'Failed to add comment' });
    }
};

// Get posts by category
const getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        
        const posts = await executeQuery(
            `SELECT id, title, slug, excerpt, category, category_name, image_url, author, read_time, created_at
             FROM blog_posts WHERE category = ? AND is_published = TRUE ORDER BY created_at DESC`,
            [category]
        );
        
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        console.error('Get by category error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch posts' });
    }
};

// Search posts
const searchPosts = async (req, res) => {
    try {
        const { query } = req.params;
        const searchTerm = `%${query}%`;
        
        const posts = await executeQuery(
            `SELECT id, title, slug, excerpt, category, category_name, image_url, author, read_time, created_at
             FROM blog_posts WHERE is_published = TRUE 
             AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
             ORDER BY CASE WHEN title LIKE ? THEN 1 WHEN excerpt LIKE ? THEN 2 ELSE 3 END
             LIMIT 20`,
            [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
        );
        
        res.status(200).json({ success: true, count: posts.length, data: posts, searchTerm: query });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: 'Failed to search posts' });
    }
};

// Create new post (admin)
const createPost = async (req, res) => {
    try {
        const { title, slug, excerpt, content, category, category_name, image_url, read_time, is_featured, tags } = req.body;
        
        const result = await executeQuery(
            `INSERT INTO blog_posts (title, slug, excerpt, content, category, category_name, image_url, read_time, is_featured, tags)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, excerpt, content, category, category_name, image_url, read_time || 5, is_featured || false, JSON.stringify(tags || [])]
        );
        
        res.status(201).json({ success: true, message: 'Blog post created successfully', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ success: false, message: 'Failed to create post' });
    }
};

// Update post (admin)
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const fields = [];
        const values = [];
        const allowedFields = ['title', 'slug', 'excerpt', 'content', 'category', 'category_name', 'image_url', 'read_time', 'is_featured', 'tags'];
        
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(field === 'tags' ? JSON.stringify(updates[field]) : updates[field]);
            }
        }
        
        if (fields.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }
        
        values.push(id);
        await executeQuery(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`, values);
        
        res.status(200).json({ success: true, message: 'Blog post updated successfully' });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ success: false, message: 'Failed to update post' });
    }
};

// Delete post (admin)
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        await executeQuery(`DELETE FROM blog_posts WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete post' });
    }
};

// Toggle featured status
const toggleFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await executeQuery(`SELECT is_featured FROM blog_posts WHERE id = ?`, [id]);
        
        if (post.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        
        const newStatus = !post[0].is_featured;
        await executeQuery(`UPDATE blog_posts SET is_featured = ? WHERE id = ?`, [newStatus, id]);
        
        res.status(200).json({ success: true, message: `Post ${newStatus ? 'featured' : 'unfeatured'}`, is_featured: newStatus });
    } catch (error) {
        console.error('Toggle featured error:', error);
        res.status(500).json({ success: false, message: 'Failed to toggle featured status' });
    }
};

// Approve comment
const approveComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        await executeQuery(`UPDATE blog_comments SET is_approved = TRUE WHERE id = ?`, [commentId]);
        res.status(200).json({ success: true, message: 'Comment approved' });
    } catch (error) {
        console.error('Approve comment error:', error);
        res.status(500).json({ success: false, message: 'Failed to approve comment' });
    }
};

// Delete comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        
        // Get post_id to update count
        const comment = await executeQuery(`SELECT post_id FROM blog_comments WHERE id = ?`, [commentId]);
        if (comment.length > 0) {
            await executeQuery(`UPDATE blog_posts SET comments_count = comments_count - 1 WHERE id = ?`, [comment[0].post_id]);
        }
        
        await executeQuery(`DELETE FROM blog_comments WHERE id = ?`, [commentId]);
        res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete comment' });
    }
};

module.exports = {
    getAllPosts, getFeaturedPost, getPostBySlug, getComments, addComment,
    getPostsByCategory, searchPosts, createPost, updatePost, deletePost,
    toggleFeatured, approveComment, deleteComment
};