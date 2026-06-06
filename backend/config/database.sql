-- CREATE DATABASE
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- ============================================
-- TABLE: blog_posts
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    author VARCHAR(100) DEFAULT 'Wabi Jabesa',
    read_time INT DEFAULT 5,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_is_published (is_published),
    INDEX idx_is_featured (is_featured),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX ft_search (title, excerpt, content)
);

-- ============================================
-- TABLE: blog_comments
-- ============================================
CREATE TABLE IF NOT EXISTS blog_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_is_approved (is_approved),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- TABLE: contact_messages
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_replied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- TABLE: newsletter_subscribers
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
);

-- ============================================
-- TABLE: projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    full_description LONGTEXT,
    category VARCHAR(50) NOT NULL,
    technologies JSON,
    image_url VARCHAR(500),
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    order_position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_featured (featured),
    INDEX idx_order (order_position)
);

-- ============================================
-- TABLE: users (Admin)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert sample admin user (password: Admin123!)
-- Password hash is for 'Admin123!' - you can change it
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@wabijabesa.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, category_name, image_url, read_time, is_featured, tags) VALUES
('Getting Started with Web Development', 
 'getting-started-web-development', 
 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for absolute beginners.', 
 '<h2>Introduction</h2><p>Web development is an exciting field that combines creativity with technical skills. In this post, we''ll cover everything you need to get started...</p><h3>What You''ll Learn</h3><ul><li>HTML basics</li><li>CSS styling</li><li>JavaScript interactivity</li></ul>', 
 'web-dev', 
 'Web Development', 
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', 
 5, 
 TRUE, 
 '["HTML", "CSS", "JavaScript", "Beginner"]'),

('Java OOP Concepts Explained', 
 'java-oop-concepts-explained', 
 'Understanding Object-Oriented Programming in Java: Classes, Objects, Inheritance, Polymorphism, and more.', 
 '<h2>What is OOP?</h2><p>Object-Oriented Programming is a programming paradigm that uses objects and classes...</p>', 
 'java', 
 'Java', 
 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 
 8, 
 FALSE, 
 '["Java", "OOP", "Programming"]');

-- Insert sample projects
INSERT INTO projects (title, slug, description, full_description, category, technologies, image_url, github_url, live_url, featured) VALUES
('Modern Portfolio Website', 
 'modern-portfolio-website', 
 'A fully responsive personal portfolio website built with HTML, CSS, and JavaScript.', 
 '<p>This portfolio website features smooth animations, typing effect, and responsive design...</p>', 
 'Web Development', 
 '["HTML5", "CSS3", "JavaScript"]', 
 'https://via.placeholder.com/400x250/38bdf8/ffffff?text=Portfolio', 
 'https://github.com/wabi/portfolio', 
 'https://wabijabesa.com', 
 TRUE);

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Get featured blog post
CREATE PROCEDURE GetFeaturedPost()
BEGIN
    SELECT * FROM blog_posts 
    WHERE is_featured = TRUE AND is_published = TRUE 
    LIMIT 1;
END //

-- Increment blog post views
CREATE PROCEDURE IncrementPostViews(IN post_id INT)
BEGIN
    UPDATE blog_posts SET views = views + 1 WHERE id = post_id;
    SELECT views FROM blog_posts WHERE id = post_id;
END //

DELIMITER ;