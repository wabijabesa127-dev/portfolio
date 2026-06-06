
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;


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
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_is_published (is_published),
    INDEX idx_is_featured (is_featured),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX ft_search (title, excerpt, content)
);


CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_replied BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
);


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



-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, category_name, image_url, read_time, is_featured, tags) VALUES
('Getting Started with Web Development: A Beginner\'s Guide', 
 'getting-started-web-development', 
 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for absolute beginners.', 
 '<h2>Introduction</h2><p>Web development is an exciting field...</p>', 
 'web-dev', 
 'Web Development', 
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', 
 5, 
 TRUE, 
 '["HTML", "CSS", "JavaScript", "Beginner"]'),

('Java OOP Concepts Explained with Examples', 
 'java-oop-concepts-explained', 
 'Understanding Object-Oriented Programming in Java: Classes, Objects, Inheritance, Polymorphism, and more.', 
 '<h2>What is OOP?</h2><p>Object-Oriented Programming is a paradigm...</p>', 
 'java', 
 'Java', 
 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 
 8, 
 FALSE, 
 '["Java", "OOP", "Programming"]'),

('Building Your First Responsive Website with Flexbox & Grid', 
 'responsive-website-flexbox-grid', 
 'A step-by-step tutorial on creating modern, responsive layouts using CSS Flexbox and Grid.', 
 '<h2>Why Responsive Design?</h2><p>In today\'s world...</p>', 
 'tutorial', 
 'Tutorial', 
 'https://images.unsplash.com/photo-1507721999474-8f4421c3c6e2?w=800', 
 6, 
 FALSE, 
 '["CSS", "Flexbox", "Grid", "Responsive"]');

-- Insert sample projects
INSERT INTO projects (title, slug, description, full_description, category, technologies, image_url, github_url, live_url, featured) VALUES
('Modern Portfolio Website', 
 'modern-portfolio-website', 
 'A fully responsive personal portfolio website built with HTML, CSS, and JavaScript.', 
 '<p>This portfolio website features smooth animations, typing effect, and responsive design...</p>', 
 'Web Development', 
 '["HTML5", "CSS3", "JavaScript", "Responsive Design"]', 
 'https://via.placeholder.com/400x250/38bdf8/ffffff?text=Portfolio', 
 'https://github.com/wabi/portfolio', 
 'https://wabijabesa.com', 
 TRUE),

('Java Calculator Application', 
 'java-calculator-application', 
 'A graphical calculator application built with Java Swing.', 
 '<p>This calculator performs basic arithmetic operations with a clean GUI...</p>', 
 'Java', 
 '["Java", "Swing", "OOP"]', 
 'https://via.placeholder.com/400x250/6366f1/ffffff?text=Calculator', 
 'https://github.com/wabi/java-calculator', 
 NULL, 
 FALSE);

-- Insert sample admin user (password: Admin123!)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@wabijabesa.com', '$2a$10$YourHashedPasswordHere', 'admin');


-- Get featured blog post
DELIMITER //
CREATE PROCEDURE GetFeaturedPost()
BEGIN
    SELECT * FROM blog_posts 
    WHERE is_featured = TRUE AND is_published = TRUE 
    LIMIT 1;
END //
DELIMITER ;

-- Increment blog post views
DELIMITER //
CREATE PROCEDURE IncrementPostViews(IN post_id INT)
BEGIN
    UPDATE blog_posts SET views = views + 1 WHERE id = post_id;
    SELECT views FROM blog_posts WHERE id = post_id;
END //
DELIMITER ;

-- Get recent blog posts with pagination
DELIMITER //
CREATE PROCEDURE GetRecentPosts(
    IN page_num INT,
    IN page_size INT,
    IN cat VARCHAR(50)
)
BEGIN
    DECLARE offset_val INT;
    SET offset_val = (page_num - 1) * page_size;
    
    IF cat IS NULL OR cat = '' OR cat = 'all' THEN
        SELECT * FROM blog_posts 
        WHERE is_published = TRUE 
        ORDER BY created_at DESC 
        LIMIT page_size OFFSET offset_val;
    ELSE
        SELECT * FROM blog_posts 
        WHERE is_published = TRUE AND category = cat
        ORDER BY created_at DESC 
        LIMIT page_size OFFSET offset_val;
    END IF;
END //
DELIMITER ;