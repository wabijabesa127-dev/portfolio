/* ============================================
   ABOUT PAGE - COMPLETE JAVASCRIPT
   ============================================ */

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
    // 2. TIMELINE SCROLL ANIMATION
    // ============================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function checkTimelineVisibility() {
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                item.classList.add('animate');
            }
        });
    }
    
    // Check on scroll
    window.addEventListener('scroll', checkTimelineVisibility);
    checkTimelineVisibility(); // Initial check
    
    // ============================================
    // 3. SKILL BAR ANIMATION
    // ============================================
    const progressBars = document.querySelectorAll('.progress');
    let animated = false;
    
    function animateSkillBars() {
        if (animated) return;
        
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;
        
        const rect = skillsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !animated) {
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            animated = true;
        }
    }
    
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Initial check
    
    // ============================================
    // 4. SCROLL REVEAL FOR ALL SECTIONS
    // ============================================
    const revealElements = document.querySelectorAll('.skill-category, .edu-card, .fact-item, .timeline-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ============================================
    // 5. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // 6. NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(2, 6, 23, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(2, 6, 23, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // 7. TYPEWRITER EFFECT FOR PAGE HEADER (Optional)
    // ============================================
    const headerTitle = document.querySelector('.header-content h1');
    if (headerTitle && !headerTitle.hasAttribute('data-typed')) {
        headerTitle.setAttribute('data-typed', 'true');
        
        const originalText = headerTitle.innerHTML;
        const words = originalText.split(' ');
        const highlightWord = words.find(w => w.includes('<span'));
        
        // Store original content
        headerTitle.setAttribute('data-original', originalText);
    }
    
    // ============================================
    // 8. PRELOADER (Optional - just for effect)
    // ============================================
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // ============================================
    // 9. DYNAMIC YEAR IN FOOTER
    // ============================================
    const yearElement = document.querySelector('.footer-content p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2026', currentYear);
    }
    
    // ============================================
    // 10. ADD HOVER EFFECT ON STATS COUNTERS
    // ============================================
    const statNumbers = document.querySelectorAll('.exp-number');
    let counted = false;
    
    function animateStats() {
        if (counted) return;
        
        const badge = document.querySelector('.experience-badge');
        if (!badge) return;
        
        const rect = badge.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !counted) {
            const numberElement = document.querySelector('.exp-number');
            if (numberElement) {
                const target = parseInt(numberElement.textContent);
                let current = 0;
                const increment = target / 30;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        numberElement.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        numberElement.textContent = Math.floor(current) + '+';
                    }
                }, 30);
            }
            counted = true;
        }
    }
    
    window.addEventListener('scroll', animateStats);
    animateStats();
    
    // ============================================
    // 11. ADD CSS FOR SCROLLBAR (Custom styling)
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
        ::-webkit-scrollbar-thumb:hover {
            background: #38bdf8;
        }
    `;
    document.head.appendChild(style);
    
});


window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
    }
});

// ============================================
// 13. PREVENT DOUBLE SCROLL ON MODAL (if any)
// ============================================
// (Reserved for future modal functionality)

console.log('About page loaded successfully!');

// Mouse move glow effect for timeline cards
const timelineCards = document.querySelectorAll('.timeline-content');

timelineCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Animate achievement progress bars on scroll
const progressBars = document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.getAttribute('data-width') || '75';
            bar.style.width = width + '%';
            progressObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});