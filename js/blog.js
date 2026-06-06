/* ============================================
   BLOG PAGE - COMPLETE JAVASCRIPT
   ============================================ */

// ============================================
// BLOG DATA - All posts stored here
// ============================================

const blogPosts = [
    {
        id: 1,
        title: "Getting Started with Web Development: A Beginner's Guide",
        excerpt: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for absolute beginners who want to start their coding journey.",
        content: "Full content here...",
        category: "web-dev",
        categoryName: "Web Development",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        date: "2026-01-15",
        readTime: 5,
        author: "Wabi Jabesa",
        featured: true,
        tags: ["HTML", "CSS", "JavaScript", "Beginner"]
    },
    {
        id: 2,
        title: "Java OOP Concepts Explained with Examples",
        excerpt: "Understanding Object-Oriented Programming in Java: Classes, Objects, Inheritance, Polymorphism, Encapsulation, and Abstraction.",
        content: "Full content here...",
        category: "java",
        categoryName: "Java",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        date: "2026-01-28",
        readTime: 8,
        author: "Wabi Jabesa",
        featured: false,
        tags: ["Java", "OOP", "Programming"]
    },
    {
        id: 3,
        title: "Building Your First Responsive Website with Flexbox & Grid",
        excerpt: "A step-by-step tutorial on creating modern, responsive layouts using CSS Flexbox and Grid. Perfect for creating beautiful websites.",
        content: "Full content here...",
        category: "tutorial",
        categoryName: "Tutorial",
        image: "https://images.unsplash.com/photo-1507721999474-8f4421c3c6e2?w=800",
        date: "2026-02-05",
        readTime: 6,
        author: "Wabi Jabesa",
        featured: false,
        tags: ["CSS", "Flexbox", "Grid", "Responsive"]
    },
    {
        id: 4,
        title: "5 Tips for Student Developers Starting Their Career",
        excerpt: "Practical advice for student developers on building skills, finding internships, networking, and landing your first job in tech.",
        content: "Full content here...",
        category: "career",
        categoryName: "Career",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
        date: "2026-02-12",
        readTime: 4,
        author: "Wabi Jabesa",
        featured: false,
        tags: ["Career", "Students", "Advice"]
    },
    {
        id: 5,
        title: "Understanding Java Data Structures: Arrays, Lists, and Maps",
        excerpt: "Deep dive into essential Java data structures. Learn when and how to use Arrays, ArrayLists, HashMaps, and more for efficient coding.",
        content: "Full content here...",
        category: "programming",
        categoryName: "Programming",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
        date: "2026-02-18",
        readTime: 7,
        author: "Wabi Jabesa",
        featured: false,
        tags: ["Java", "Data Structures", "Algorithms"]
    },
    {
        id: 6,
        title: "How to Stay Motivated While Learning to Code",
        excerpt: "Tips and strategies to maintain motivation, overcome frustration, and enjoy your programming journey as a student developer.",
        content: "Full content here...",
        category: "career",
        categoryName: "Career",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
        date: "2026-02-25",
        readTime: 5,
        author: "Wabi Jabesa",
        featured: false,
        tags: ["Motivation", "Student", "Learning"]
    },
    {
        id: 7,
        title: "JavaScript ES6+ Features Every Developer Should Know",
        excerpt: "Modern JavaScript features including arrow functions, destructuring, spread operators, async/await, and modules explained with examples.",
        content: "Full content here...",
        category: "web-dev",
        categoryName: "Web Development",
        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
        date: "2026-03-02",
        readTime: 6,
        author: "Wabi Jabesa",
        featured: false,
        tags: ["JavaScript", "ES6", "Modern JS"]
    },
    {
        id: 8,
        title: "Mastering SQL: Essential Queries for Beginners",
        excerpt: "Learn the most important SQL commands including SELECT, INSERT, UPDATE, DELETE, JOINs, and aggregate functions with practical examples.",
        content: "Full content here...",
        category: "tutorial",
        categoryName: "Tutorial",
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
        date: "2026-03-08",
        readTime: 7,
        author: "Wabi Jabesa",
        featured: false,
        tags: ["SQL", "Database", "MySQL"]
    },
    {
        id: 9,
        title: "My Journey as a Self-Taught Developer",
        excerpt: "Sharing my personal experience, challenges, lessons learned, and advice for others on the self-taught programming path.",
        content: "Full content here...",
        category: "career",
        categoryName: "Career",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
        date: "2026-03-12",
        readTime: 6,
        author: "Wabi Jabesa",
        featured: false,
        tags: ["Journey", "Self-Taught", "Experience"]
    }
];

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentPosts = [...blogPosts];
let currentPage = 1;
const postsPerPage = 6;
let currentCategory = "all";
let currentSearch = "";

// ============================================
// DOM ELEMENTS
// ============================================
const blogGrid = document.getElementById('blogGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const filterTabs = document.querySelectorAll('.filter-tab');
const featuredPostContainer = document.getElementById('featuredPost');

// ============================================
// 1. DARK/LIGHT MODE TOGGLE
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// ============================================
// 2. MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// 3. RENDER FEATURED POST
// ============================================
function renderFeaturedPost() {
    const featured = blogPosts.find(post => post.featured === true);
    
    if (!featured) return;
    
    const formattedDate = new Date(featured.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const html = `
        <div class="featured-content">
            <div class="featured-image">
                <img src="${featured.image}" alt="${featured.title}">
            </div>
            <div class="featured-info">
                <span class="featured-category">⭐ Featured</span>
                <h2>${featured.title}</h2>
                <div class="featured-meta">
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-clock"></i> ${featured.readTime} min read</span>
                    <span><i class="fas fa-tag"></i> ${featured.categoryName}</span>
                </div>
                <p>${featured.excerpt}</p>
                <a href="#" class="btn-primary" onclick="openPostModal(${featured.id}); return false;">Read Article →</a>
            </div>
        </div>
    `;
    
    featuredPostContainer.innerHTML = html;
}

// ============================================
// 4. RENDER BLOG POSTS
// ============================================
function renderBlogPosts() {
    // Filter posts
    let filteredPosts = [...blogPosts];
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
    }
    
    // Filter by search
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchLower) ||
            post.excerpt.toLowerCase().includes(searchLower) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }
    
    currentPosts = filteredPosts;
    
    // Pagination
    const startIndex = 0;
    const endIndex = currentPage * postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredPosts.length;
    
    // Show/hide load more button
    loadMoreContainer.style.display = hasMore ? 'block' : 'none';
    
    // Show/hide no results
    if (paginatedPosts.length === 0) {
        blogGrid.style.display = 'none';
        noResults.style.display = 'block';
        loadingSpinner.style.display = 'none';
        return;
    }
    
    blogGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Render posts with staggered animation
    blogGrid.innerHTML = '';
    paginatedPosts.forEach((post, index) => {
        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.innerHTML = `
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="blog-category">${post.categoryName}</span>
            </div>
            <div class="blog-info">
                <div class="blog-meta">
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-clock"></i> ${post.readTime} min read</span>
                </div>
                <h3><a href="#" onclick="openPostModal(${post.id}); return false;">${post.title}</a></h3>
                <p class="blog-excerpt">${post.excerpt.substring(0, 120)}...</p>
                <a href="#" class="read-more" onclick="openPostModal(${post.id}); return false;">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        blogGrid.appendChild(card);
    });
    
    loadingSpinner.style.display = 'none';
}

// ============================================
// 5. LOAD MORE POSTS
// ============================================
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderBlogPosts();
    });
}

// ============================================
// 6. SEARCH FUNCTIONALITY
// ============================================
function initSearch() {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        currentPage = 1;
        
        if (currentSearch) {
            clearSearch.style.display = 'block';
        } else {
            clearSearch.style.display = 'none';
        }
        
        renderBlogPosts();
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        clearSearch.style.display = 'none';
        currentPage = 1;
        renderBlogPosts();
    });
}

// ============================================
// 7. CATEGORY FILTER
// ============================================
function initCategoryFilter() {
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update filter
            currentCategory = tab.getAttribute('data-category');
            currentPage = 1;
            renderBlogPosts();
        });
    });
}

// ============================================
// 8. RESET FILTERS
// ============================================
function initResetFilters() {
    const resetBtn = document.getElementById('resetFilters');
    
    resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSearch = '';
        currentPage = 1;
        searchInput.value = '';
        clearSearch.style.display = 'none';
        
        filterTabs.forEach(tab => {
            if (tab.getAttribute('data-category') === 'all') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        renderBlogPosts();
    });
}

// ============================================
// 9. POST MODAL
// ============================================
function openPostModal(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    const modal = document.getElementById('postModal');
    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalReadTime = document.getElementById('modalReadTime');
    const modalExcerpt = document.getElementById('modalExcerpt');
    const modalReadMore = document.getElementById('modalReadMore');
    
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    modalImage.src = post.image;
    modalImage.alt = post.title;
    modalCategory.textContent = post.categoryName;
    modalTitle.textContent = post.title;
    modalDate.textContent = formattedDate;
    modalReadTime.textContent = post.readTime;
    modalExcerpt.textContent = post.excerpt;
    modalReadMore.href = `post.html?id=${post.id}`;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePostModal() {
    const modal = document.getElementById('postModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================
// 10. NEWSLETTER SUBSCRIPTION
// ============================================
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterStatus = document.getElementById('newsletterStatus');
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('newsletterEmail').value;
        
        newsletterStatus.textContent = 'Subscribing...';
        newsletterStatus.style.color = '#38bdf8';
        
        // Simulate API call
        setTimeout(() => {
            newsletterStatus.textContent = '✅ Successfully subscribed! Check your email.';
            newsletterStatus.style.color = '#10b981';
            newsletterForm.reset();
            
            setTimeout(() => {
                newsletterStatus.textContent = '';
            }, 5000);
        }, 1000);
    });
}

// ============================================
// 11. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// 12. NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(2, 6, 23, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(2, 6, 23, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // Light mode navbar scroll
        if (document.body.classList.contains('light-mode')) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        }
    });
}

// ============================================
// 13. UPDATE FOOTER YEAR
// ============================================
function updateFooterYear() {
    const footerYear = document.querySelector('.footer-content p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', currentYear);
    }
}

// ============================================
// 14. RESIZE HANDLER
// ============================================
function initResizeHandler() {
    window.addEventListener('resize', () => {
        const navMenu = document.querySelector('.nav-menu');
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
        }
    });
}

// ============================================
// 15. INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    renderFeaturedPost();
    renderBlogPosts();
    initLoadMore();
    initSearch();
    initCategoryFilter();
    initResetFilters();
    initNewsletter();
    initSmoothScroll();
    initNavbarScroll();
    updateFooterYear();
    initResizeHandler();
    
    // Make modal functions global
    window.openPostModal = openPostModal;
    window.closePostModal = closePostModal;
    
    console.log('Blog page loaded successfully!');
});

window.onclick = (event) => {
    const modal = document.getElementById('postModal');
    if (event.target === modal) {
        closePostModal();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closePostModal();
    }
});


async function fetchBlogPosts() {
    try {
        const response = await fetch('http://localhost:5000/api/blog');
        const data = await response.json();
        
        if (data.success) {
            renderBlogPostsFromAPI(data.data);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Fallback to local data
        renderBlogPosts();
    }
}