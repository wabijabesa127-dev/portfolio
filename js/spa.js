/* ============================================
   SINGLE PAGE APPLICATION WITH AUTO-SCROLL
   ============================================ */

// Page configuration
const pages = ['home', 'about', 'projects', 'blog', 'contact'];
let currentPageIndex = 0;
let autoScrollEnabled = true;
let autoScrollTimer = null;
let isScrolling = false;
let observer = null;

// Page titles
const pageTitles = {
    home: 'Wabi Jabesa | Home',
    about: 'Wabi Jabesa | About',
    projects: 'Wabi Jabesa | Projects',
    blog: 'Wabi Jabesa | Blog',
    contact: 'Wabi Jabesa | Contact'
};

// ============================================
// 1. LOAD PAGE CONTENT
// ============================================
async function loadPage(pageName, pushToHistory = true) {
    // Show loader
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.remove('hide');
    
    try {
        // Fetch page content from pages folder
        const response = await fetch(`pages/${pageName}.html`);
        
        if (!response.ok) {
            throw new Error(`Page ${pageName} not found`);
        }
        
        const content = await response.text();
        
        // Update content
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = content;
        }
        
        // Update page title
        document.title = pageTitles[pageName] || 'Wabi Jabesa';
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update active dot
        updateActiveDot(pageName);
        
        // Re-initialize animations for new content
        if (typeof initAnimations === 'function') {
            initAnimations();
        }
        
        // Update URL without reload
        if (pushToHistory) {
            const url = new URL(window.location);
            url.searchParams.set('page', pageName);
            window.history.pushState({ page: pageName }, '', url);
        }
        
        // Trigger reflow for scroll snap
        setTimeout(() => {
            setupSectionObserver();
        }, 100);
        
    } catch (error) {
        console.error('Error loading page:', error);
        // Fallback: show error message
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = `<div style="text-align:center;padding:100px;"><h2>Error loading page</h2><p>${error.message}</p></div>`;
        }
    } finally {
        // Hide loader
        setTimeout(() => {
            if (loader) loader.classList.add('hide');
        }, 300);
    }
}

// ============================================
// 2. SETUP SECTION OBSERVER FOR AUTO-SCROLL
// ============================================
function setupSectionObserver() {
    // Disconnect existing observer
    if (observer) {
        observer.disconnect();
    }
    
    // Get all page sections
    const sections = document.querySelectorAll('.page-section');
    
    if (sections.length === 0) return;
    
    // Create page dots
    createPageDots(sections.length);
    
    // Setup intersection observer
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isScrolling) {
                const index = Array.from(sections).indexOf(entry.target);
                if (index !== -1) {
                    currentPageIndex = index;
                    updateActiveDotByIndex(index);
                    
                    // Auto-scroll to next section when current is fully viewed
                    if (autoScrollEnabled && !isScrolling) {
                        // Check if we've been on this section for 3 seconds
                        if (autoScrollTimer) clearTimeout(autoScrollTimer);
                        autoScrollTimer = setTimeout(() => {
                            if (autoScrollEnabled && !isScrolling) {
                                scrollToNextSection();
                            }
                        }, 3000);
                    }
                }
            }
        });
    }, { threshold: 0.5 }); // 50% visible
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ============================================
// 3. SCROLL TO NEXT SECTION
// ============================================
function scrollToNextSection() {
    const sections = document.querySelectorAll('.page-section');
    if (currentPageIndex < sections.length - 1) {
        isScrolling = true;
        sections[currentPageIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Show notification
        showScrollNotification(`Scrolling to ${pages[currentPageIndex + 1].toUpperCase()}`);
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    } else if (currentPageIndex === sections.length - 1 && autoScrollEnabled) {
        // Loop back to first page
        isScrolling = true;
        sections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        showScrollNotification('Back to Home');
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

// ============================================
// 4. SCROLL TO PREVIOUS SECTION
// ============================================
function scrollToPrevSection() {
    const sections = document.querySelectorAll('.page-section');
    if (currentPageIndex > 0) {
        isScrolling = true;
        sections[currentPageIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        showScrollNotification(`Scrolling to ${pages[currentPageIndex - 1].toUpperCase()}`);
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

// ============================================
// 5. SCROLL TO SPECIFIC PAGE
// ============================================
function scrollToPage(pageName) {
    const sections = document.querySelectorAll('.page-section');
    const pageIndex = pages.indexOf(pageName);
    
    if (pageIndex !== -1 && sections[pageIndex]) {
        isScrolling = true;
        sections[pageIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

// ============================================
// 6. CREATE PAGE INDICATOR DOTS
// ============================================
function createPageDots(count) {
    const dotsContainer = document.getElementById('pageDots');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'page-dot';
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => {
            const sections = document.querySelectorAll('.page-section');
            if (sections[i]) {
                isScrolling = true;
                sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
        dotsContainer.appendChild(dot);
    }
}

// ============================================
// 7. UPDATE ACTIVE DOT
// ============================================
function updateActiveDot(pageName) {
    const pageIndex = pages.indexOf(pageName);
    updateActiveDotByIndex(pageIndex);
}

function updateActiveDotByIndex(index) {
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ============================================
// 8. SHOW SCROLL NOTIFICATION
// ============================================
function showScrollNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.scroll-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'scroll-notification';
    notification.innerHTML = `<i class="fas fa-arrow-right"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification) notification.remove();
    }, 3000);
}

// ============================================
// 9. TOGGLE AUTO-SCROLL
// ============================================
function toggleAutoScroll() {
    autoScrollEnabled = !autoScrollEnabled;
    const toggleBtn = document.getElementById('autoScrollToggle');
    
    if (autoScrollEnabled) {
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
        showScrollNotification('Auto-scroll ON - Page will advance automatically');
        
        // Restart timer
        if (autoScrollTimer) clearTimeout(autoScrollTimer);
        autoScrollTimer = setTimeout(() => {
            if (autoScrollEnabled && !isScrolling) {
                scrollToNextSection();
            }
        }, 3000);
    } else {
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
        showScrollNotification('Auto-scroll OFF - Use navigation to move');
        
        if (autoScrollTimer) clearTimeout(autoScrollTimer);
    }
}

// ============================================
// 10. HANDLE BROWSER BACK/FORWARD
// ============================================
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        loadPage(event.state.page, false);
        scrollToPage(event.state.page);
    }
});

// ============================================
// 11. INITIALIZE SPA
// ============================================
async function initSPA() {
    // Check URL for initial page
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || 'home';
    
    // Load initial page
    await loadPage(initialPage);
    
    // Setup scroll container listener
    const scrollContainer = document.getElementById('scrollContainer');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            if (autoScrollTimer) clearTimeout(autoScrollTimer);
        });
    }
    
    // Setup scroll progress button
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        scrollProgress.addEventListener('click', () => {
            scrollToNextSection();
        });
        
        // Double-click for previous
        scrollProgress.addEventListener('dblclick', () => {
            scrollToPrevSection();
        });
    }
    
    // Setup auto-scroll toggle
    const autoScrollToggle = document.getElementById('autoScrollToggle');
    if (autoScrollToggle) {
        autoScrollToggle.addEventListener('click', toggleAutoScroll);
        autoScrollToggle.classList.add('active');
    }
    
    // Setup navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.getAttribute('data-page');
            if (pageName) {
                loadPage(pageName);
                scrollToPage(pageName);
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });
    
    console.log('SPA with auto-scroll initialized!');
}

// Start the SPA when DOM is ready
document.addEventListener('DOMContentLoaded', initSPA);