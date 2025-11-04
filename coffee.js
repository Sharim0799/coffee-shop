/* ===== COFFEE WEBSITE JAVASCRIPT ===== */
/* Clean, organized, and beginner-friendly code */

/* ===== CONFIGURATION ===== */
const CONFIG = {
    // Animation settings
    scrollDuration: 800,
    testimonialInterval: 5000,
    fadeInThreshold: 0.1,
    mobileBreakpoint: 768,

    // Form validation settings
    maxPersons: 10,
    minPersons: 1,

    // Business hours (24-hour format)
    businessHours: {
        monday: { open: 8, close: 20 },
        tuesday: { open: 8, close: 20 },
        wednesday: { open: 8, close: 20 },
        thursday: { open: 8, close: 20 },
        friday: { open: 8, close: 20 },
        saturday: { open: 14, close: 20 },
        sunday: { open: 14, close: 20 }
    }
};

/* ===== VALIDATION PATTERNS ===== */
const VALIDATION = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[0-9\s\-\(\)]{10,}$/
};

/* ===== UTILITY FUNCTIONS ===== */

/**
 * Safely select a single DOM element
 */
function $(selector) {
    return document.querySelector(selector);
}

/**
 * Safely select multiple DOM elements
 */
function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Add event listener with error handling
 */
function addEventListenerSafe(element, event, handler) {
    if (element && typeof handler === 'function') {
        element.addEventListener(event, handler);
    }
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if device is mobile
 */
function isMobile() {
    return window.innerWidth <= CONFIG.mobileBreakpoint;
}

/**
 * Format time for display
 */
function formatTime(hours) {
    if (hours === 0) return '12:00 AM';
    if (hours < 12) return `${hours}:00 AM`;
    if (hours === 12) return '12:00 PM';
    return `${hours - 12}:00 PM`;
}

/* ===== MAIN INITIALIZATION ===== */

/**
 * Initialize all website features
 */
function initCoffeeWebsite() {
    console.log('🚀 Initializing Coffee Website...');

    try {
        // Initialize all features
        initSmoothScrolling();
        initScrollAnimations();
        initHoverAnimations();
        initTestimonialSlider();
        initLoadingAnimation();
        initMobileMenu();
        initFormValidation();
        initBackToTop();
        initBusinessHours();
        initNewsletterSignup();

        console.log('✅ Coffee Website initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing Coffee Website:', error);
    }
}

/* ===== SMOOTH SCROLLING ===== */

function initSmoothScrolling() {
    console.log('📍 Initializing smooth scrolling...');
    
    // Add smooth scrolling to navigation links
    const navLinks = $$('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = $(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ===== SCROLL ANIMATIONS ===== */

function initScrollAnimations() {
    console.log('✨ Initializing scroll animations...');
    
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = $$('.about-section, .services-section, .menu-section, .testimonial-section, .contact-section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });
}

/* ===== HOVER ANIMATIONS ===== */

function initHoverAnimations() {
    console.log('🎯 Initializing hover animations...');
    
    // Add ripple effect to buttons
    const buttons = $$('button, .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* ===== TESTIMONIAL SLIDER ===== */

function initTestimonialSlider() {
    console.log('💬 Initializing testimonial slider...');
    
    const slider = $('.testimonials-grid');
    const dots = $$('.testimonial-dots .dot');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const testimonialItems = $$('.testimonial-item');
    
    if (!slider || !dots.length) return;
    
    let currentSlide = 0;
    let isPlaying = true;
    let autoPlayInterval;
    
    // Calculate slide width dynamically
    function getSlideWidth() {
        const item = testimonialItems[0];
        if (!item) return 390;
        
        const itemWidth = item.offsetWidth;
        const gap = window.innerWidth <= 768 ? 20 : 40;
        return itemWidth + gap;
    }
    
    // Start autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (isPlaying) {
                nextSlide();
            }
        }, CONFIG.testimonialInterval);
    }
    
    // Stop autoplay
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Update slider position
    function updateSlider() {
        const slideWidth = getSlideWidth();
        const translateX = -currentSlide * slideWidth;
        slider.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === testimonialItems.length - 1;
    }
    
    // Go to next slide
    function nextSlide() {
        if (currentSlide < testimonialItems.length - 1) {
            currentSlide++;
            updateSlider();
        } else {
            // Loop back to first slide
            currentSlide = 0;
            updateSlider();
        }
    }
    
    // Go to previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        } else {
            // Loop to last slide
            currentSlide = testimonialItems.length - 1;
            updateSlider();
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        // Pause autoplay temporarily when user interacts
        stopAutoPlay();
        setTimeout(startAutoPlay, 10000); // Resume after 10 seconds
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        // Pause autoplay temporarily when user interacts
        stopAutoPlay();
        setTimeout(startAutoPlay, 10000); // Resume after 10 seconds
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            // Pause autoplay temporarily when user interacts
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000); // Resume after 10 seconds
        });
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        if (isPlaying) {
            stopAutoPlay();
        }
    });
    
    slider.addEventListener('mouseleave', () => {
        if (isPlaying) {
            startAutoPlay();
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        // Minimum swipe distance
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        if (isPlaying) {
            setTimeout(startAutoPlay, 10000);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        updateSlider();
    }, 250));
    
    // Initialize
    updateSlider();
    startAutoPlay();
    
    console.log('✅ Testimonial slider initialized');
}

/* ===== LOADING ANIMATION ===== */

function initLoadingAnimation() {
    console.log('⏳ Initializing loading animations...');
    
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Scroll to top on page load/refresh
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });
    
    // Also scroll to top when page loads
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 500);
    });
    
    // Scroll to top on page refresh (additional method)
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
}

/* ===== PLACEHOLDER FUNCTIONS ===== */
/* These will be implemented as needed */

function initMobileMenu() {
    console.log('📱 Mobile menu ready for implementation');
}

function initFormValidation() {
    console.log('📝 Form validation ready for implementation');
}

function initBackToTop() {
    console.log('⬆️ Back to top ready for implementation');
}

function initBusinessHours() {
    console.log('🕒 Business hours ready for implementation');
}

function initNewsletterSignup() {
    console.log('📧 Newsletter signup ready for implementation');
}

/* ===== EVENT LISTENERS ===== */

// Scroll to top immediately when DOM starts loading
window.scrollTo(0, 0);

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Ensure we're at the top
    window.scrollTo(0, 0);
    initCoffeeWebsite();
});

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    console.log('📱 Window resized, adjusting layout...');
    // Responsive adjustments will be added as features are implemented
}, 250));

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👁️ Page hidden - pausing animations');
        // Pause animations when page is not visible
    } else {
        console.log('👁️ Page visible - resuming animations');
        // Resume animations when page becomes visible
    }
});

console.log('📄 Coffee Website JavaScript loaded - waiting for DOM...');

/* ===== END OF JAVASCRIPT ===== */