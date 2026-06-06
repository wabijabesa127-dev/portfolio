/* ============================================
   PROJECTS PAGE - COMPLETE JAVASCRIPT
   ============================================ */

// Project Database
const projectsData = {
    1: {
        title: "Modern Portfolio Website",
        category: "Web Development",
        description: "A fully responsive personal portfolio website showcasing my skills, projects, and experience. Features include smooth scrolling animations, typing effect, dark/light mode toggle, and a fully responsive design that works on all devices. Built with modern HTML5, CSS3, and vanilla JavaScript without any frameworks.",
        tech: "HTML5, CSS3, JavaScript",
        date: "January 2026",
        github: "#",
        live: "#",
        image: "https://via.placeholder.com/500x300/38bdf8/ffffff?text=Portfolio"
    },
    2: {
        title: "Advanced Java Calculator",
        category: "Java Application",
        description: "A feature-rich calculator application built with Java Swing. Performs basic arithmetic operations (addition, subtraction, multiplication, division), as well as advanced functions including square root, percentage, memory functions (M+, M-, MR, MC), and keyboard support. Features a clean, modern GUI with error handling.",
        tech: "Java, Swing, OOP",
        date: "December 2025",
        github: "#",
        live: "#",
        image: "https://via.placeholder.com/500x300/6366f1/ffffff?text=Java+Calculator"
    },
    3: {
        title: "Student Management System",
        category: "Java & Database",
        description: "A complete student record management system using Java and MySQL. Features include student registration, course enrollment, grade tracking, attendance management, fee payment tracking, and report generation. Implements CRUD operations, search functionality, and data validation.",
        tech: "Java, MySQL, JDBC",
        date: "February 2026",
        github: "#",
        live: "#",
        image: "https://via.placeholder.com/500x300/10b981/ffffff?text=Student+System"
    },
    4: {
        title: "Real-Time Weather App",
        category: "Web Development",
        description: "A weather application that fetches real-time weather data from OpenWeatherMap API. Features include current weather conditions, 5-day forecast, search by city name, geolocation support, temperature unit conversion (°C/°F), and dynamic weather icons. Built with vanilla JavaScript and CSS.",
        tech: "JavaScript, API, CSS",
        date: "January 2026",
        github: "#",
        live: "#",
        image: "https://via.placeholder.com/500x300/ef4444/ffffff?text=Weather+App"
    },
    5: {
        title: "Task Manager App",
        category: "Web Development",
        description: "An elegant task management application with local storage support. Features include add/edit/delete tasks, task categories (Work, Personal, Shopping), priority levels (High, Medium, Low), due dates, search and filter functionality, and dark mode toggle. Data persists using browser's localStorage.",
        tech: "HTML5, CSS3, JavaScript",
        date: "December 2025",
        github: "#",
        live: "#",
        image: "https://via.placeholder.com/500x300/f59e0b/ffffff?text=Task+Manager"
    },
    6: {
        title: "Library Management System",
        category: "Database",
        description: "A MySQL database project for managing library operations. Includes tables for books, members, staff, loans, and reservations. Features include book search by title/author/genre, member management, check-in/check-out system, overdue tracking, fine calculation, and comprehensive reporting with complex SQL queries.",
        tech: "MySQL, SQL, Database Design",
        date: "January 2026",
        github: "#",
        live: "#",
        image: "https://via.placeholder.com/500x300/8b5cf6/ffffff?text=Library+System"
    },
    7: {
        title: "E-commerce Landing Page",
        category: "Web Development",
        description: "A modern product landing page for an e-commerce brand. Features include responsive design, animated product cards, testimonial slider, newsletter signup form, countdown timer for sales, and smooth scroll animations. Built with CSS Grid and Flexbox for layout.",
        tech: "HTML5, CSS3, Flexbox/Grid",
        date: "February 2026",
        github: "#",
        live: "#",
        image: "https://via.placeholder.com/500x300/06b6d4/ffffff?text=E-commerce"
    },
    8: {
        title: "Banking Console Application",
        category: "Java Application",
        description: "A console-based banking system with full account management. Features include account creation, login authentication, deposit/withdrawal, fund transfer between accounts, transaction history, balance inquiry, and data persistence using file handling. Implements OOP principles including inheritance and polymorphism.",
        tech: "Java, OOP, File Handling",
        date: "November 2025",
        github: "#",
        live: "#",
        image: "https://via.placeholder.com/500x300/ec4899/ffffff?text=Banking+App"
    }
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // ============================================
    // 2. FILTER FUNCTIONALITY
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // ============================================
    // 3. STATS COUNTER ANIMATION
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    function animateStats() {
        if (statsAnimated) return;
        
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !statsAnimated) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 30);
            });
            statsAnimated = true;
        }
    }
    
    window.addEventListener('scroll', animateStats);
    animateStats();
    
    // ============================================
    // 4. NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(2, 6, 23, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(2, 6, 23, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // ============================================
    // 5. SCROLL REVEAL FOR PROJECTS
    // ============================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    projectCards.forEach(card => {
        observer.observe(card);
    });
    
    // ============================================
    // 6. HOVER EFFECT FOR PROJECT CARDS
    // ============================================
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
    
    // ============================================
    // 7. UPDATE FOOTER YEAR
    // ============================================
    const footerYear = document.querySelector('.footer-content p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', currentYear);
    }
    
    // ============================================
    // 8. ADD CSS FOR CUSTOM SCROLLBAR
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #020617;
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #38bdf8, #6366f1);
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
    
});

// ============================================
// 9. MODAL FUNCTIONS
// ============================================

function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalDate = document.getElementById('modalDate');
    const modalTech = document.getElementById('modalTech');
    const modalGithub = document.getElementById('modalGithub');
    const modalLive = document.getElementById('modalLive');
    
    modalTitle.textContent = project.title;
    modalCategory.textContent = project.category;
    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalDescription.textContent = project.description;
    modalDate.textContent = project.date;
    modalTech.textContent = project.tech;
    modalGithub.href = project.github;
    modalLive.href = project.live;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeProjectModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProjectModal();
    }
});

// ============================================
// 10. RESIZE HANDLER
// ============================================
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
    }
});

console.log('Projects page loaded successfully!');