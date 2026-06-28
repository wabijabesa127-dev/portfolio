/* ============================================
   MAIN JAVASCRIPT - DARK/LIGHT MODE + ANIMATIONS
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('JavaScript loaded - Theme toggle ready');
    
    // ============================================
    // DARK/LIGHT MODE TOGGLE
    // ============================================
    
    // Get the theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    
    // Function to apply theme based on saved preference
    function applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            console.log('Applied Light Mode from storage');
        } else {
            document.body.classList.remove('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            console.log('Applied Dark Mode from storage');
        }
    }
    
    // Function to toggle theme
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            console.log('Switched to Light Mode');
        } else {
            localStorage.setItem('theme', 'dark');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            console.log('Switched to Dark Mode');
        }
    }
    
    // Initialize theme on page load
    if (themeToggle) {
        console.log('Theme toggle button found');
        applyTheme();
        themeToggle.addEventListener('click', toggleTheme);
    } else {
        console.log('Theme toggle button NOT found - check your HTML');
    }
    
    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            console.log('Mobile menu toggled');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    
 const typedWords = ['Developer', 'Problem Solver', 'Student', 'Creative Thinker'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.querySelector('.typed-text');

function typeEffect() {
    if (!typedTextElement) return;
    
    const currentWord = typedWords[wordIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 3000);  // Pause 3 seconds before deleting
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typedWords.length;
        setTimeout(typeEffect, 1000);  // Pause 1 second before next word
        return;
    }
    
    const speed = isDeleting ? 100 : 150;  // Slower typing
    setTimeout(typeEffect, speed);
}

if (typedTextElement) {
    setTimeout(typeEffect, 1000);
}
    
    
    const counters = document.querySelectorAll('.counter-number, .stat-number, .exp-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || counter.innerText);
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.innerText = target;
                        clearInterval(timer);
                    } else {
                        counter.innerText = Math.floor(current);
                    }
                }, 30);
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-scale, .stagger-container');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(2, 6, 23, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'rgba(2, 6, 23, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
            
            // For light mode
            if (document.body.classList.contains('light-mode')) {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                }
            }
        }
    });

    
    const yearElement = document.querySelector('.footer-bottom-content p, .footer-content p, footer p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2026', currentYear);
    }
    
    // ============================================
    // PROGRESS BAR ANIMATION (for about page)
    // ============================================
    
    const progressBars = document.querySelectorAll('.progress');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
    
    // ============================================
    // CLOSE MOBILE MENU ON WINDOW RESIZE
    // ============================================
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
        }
    });
    
    console.log('All animations and features initialized successfully!');
    
});