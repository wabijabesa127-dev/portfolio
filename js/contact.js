
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
    // 2. FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
    
    // ============================================
    // 3. FORM VALIDATION FUNCTIONS
    // ============================================
    function validateName(name) {
        return name.trim().length >= 2;
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validateSubject(subject) {
        return subject.trim().length >= 3;
    }
    
    function validateMessage(message) {
        return message.trim().length >= 10;
    }
    
    // Show error message
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Hide error message
    function hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // ============================================
    // 4. GET FORM ELEMENTS
    // ============================================
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // ============================================
    // 5. REAL-TIME VALIDATION
    // ============================================
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            if (validateName(nameInput.value)) {
                hideError('nameError');
                nameInput.style.borderColor = '#10b981';
            } else {
                nameInput.style.borderColor = '#ef4444';
                if (nameInput.value.length > 0) {
                    showError('nameError', 'Please enter a valid name (at least 2 characters)');
                }
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (validateEmail(emailInput.value)) {
                hideError('emailError');
                emailInput.style.borderColor = '#10b981';
            } else {
                emailInput.style.borderColor = '#ef4444';
                if (emailInput.value.length > 0) {
                    showError('emailError', 'Please enter a valid email address');
                }
            }
        });
    }
    
    if (subjectInput) {
        subjectInput.addEventListener('input', () => {
            if (validateSubject(subjectInput.value)) {
                hideError('subjectError');
                subjectInput.style.borderColor = '#10b981';
            } else {
                subjectInput.style.borderColor = '#ef4444';
                if (subjectInput.value.length > 0) {
                    showError('subjectError', 'Please enter a subject (at least 3 characters)');
                }
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            if (validateMessage(messageInput.value)) {
                hideError('messageError');
                messageInput.style.borderColor = '#10b981';
            } else {
                messageInput.style.borderColor = '#ef4444';
                if (messageInput.value.length > 0) {
                    showError('messageError', 'Please enter a message (at least 10 characters)');
                }
            }
        });
    }
    
    // ============================================
    // 6. SUCCESS MODAL FUNCTION
    // ============================================
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Auto close after 5 seconds
            setTimeout(() => {
                closeSuccessModal();
            }, 5000);
        }
    }
    
    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // ============================================
    // 7. FORM SUBMISSION WITH BACKEND API
    // ============================================
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get values
            const name = nameInput.value;
            const email = emailInput.value;
            const subject = subjectInput.value;
            const message = messageInput.value;
            const phone = document.getElementById('phone')?.value || '';
            const newsletter = document.getElementById('newsletter')?.checked || false;
            
            // Validate all fields
            let isValid = true;
            
            if (!validateName(name)) {
                showError('nameError', 'Please enter a valid name (at least 2 characters)');
                isValid = false;
            }
            
            if (!validateEmail(email)) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!validateSubject(subject)) {
                showError('subjectError', 'Please enter a subject (at least 3 characters)');
                isValid = false;
            }
            
            if (!validateMessage(message)) {
                showError('messageError', 'Please enter a message (at least 10 characters)');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-loader"><i class="fas fa-spinner fa-spin"></i> Sending...</span>';
            
            // Prepare form data
            const formData = {
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message
            };
            
            // API CALL TO BACKEND
            try {
                // Try to connect to backend, but don't fail if backend is not running
                let response;
                let data;
                let backendAvailable = true;
                
                try {
                    response = await fetch('http://localhost:5000/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });
                    data = await response.json();
                } catch (fetchError) {
                    console.warn('Backend not available, using local simulation:', fetchError);
                    backendAvailable = false;
                }
                
                if (backendAvailable && response.ok && data.success) {
                    // Success with backend
                    submitBtn.classList.remove('loading');
                    submitBtn.innerHTML = '<span class="btn-success"><i class="fas fa-check"></i> Sent!</span>';
                    form.reset();
                    
                    // Reset border colors
                    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                        if (input) input.style.borderColor = '';
                    });
                    
                    // Show success modal
                    showSuccessModal();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = '<span class="btn-text">Send Message</span>';
                        submitBtn.classList.remove('success', 'loading');
                        submitBtn.disabled = false;
                    }, 3000);
                    
                    // Also subscribe to newsletter if checked
                    if (newsletter) {
                        try {
                            await fetch('http://localhost:5000/api/newsletter/subscribe', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: email })
                            });
                            console.log('Newsletter subscription successful');
                        } catch (newsletterError) {
                            console.log('Newsletter subscription failed:', newsletterError);
                        }
                    }
                } else {
                    // Fallback: Simulate success (for when backend is not running)
                    console.log('Using local fallback - message saved locally');
                    
                    // Save to localStorage as fallback
                    const savedMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
                    savedMessages.push({
                        ...formData,
                        timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('contact_messages', JSON.stringify(savedMessages));
                    
                    submitBtn.classList.remove('loading');
                    submitBtn.innerHTML = '<span class="btn-success"><i class="fas fa-check"></i> Sent!</span>';
                    form.reset();
                    
                    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                        if (input) input.style.borderColor = '';
                    });
                    
                    showSuccessModal();
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = '<span class="btn-text">Send Message</span>';
                        submitBtn.classList.remove('success', 'loading');
                        submitBtn.disabled = false;
                    }, 3000);
                }
                
            } catch (error) {
                console.error('Error submitting form:', error);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="btn-text">Send Message</span>';
                formStatus.textContent = error.message || 'Something went wrong. Please try again later.';
                formStatus.className = 'form-status error';
                
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }
        });
    }
    

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
    

    const scrollLinks = document.querySelectorAll('.scroll-link');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const footerYear = document.querySelector('.footer-content p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', currentYear);
    }
    

    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const platform = this.getAttribute('data-platform');
            const colors = {
                github: '#333',
                linkedin: '#0077b5',
                twitter: '#1da1f2',
                instagram: '#e4405f'
            };
            if (colors[platform]) {
                this.style.backgroundColor = colors[platform];
                this.style.borderColor = colors[platform];
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.borderColor = '';
        });
    });
    

    const revealElements = document.querySelectorAll('.contact-info, .contact-form-wrapper, .faq-item, .map-wrapper');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navMenu) navMenu.classList.remove('active');
        }
    });
    

    window.onclick = function(event) {
        const modal = document.getElementById('successModal');
        if (event.target === modal) {
            closeSuccessModal();
        }
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSuccessModal();
        }
    });
    
    console.log('Contact page loaded successfully with API integration!');
});