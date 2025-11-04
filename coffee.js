/* ===== COFFEE WEBSITE JAVASCRIPT ===== */

/* ===== CONFIGURATION ===== */
const CONFIG = {
    scrollDuration: 800,
    testimonialInterval: 5000,
    fadeInThreshold: 0.1,
    breakpoints: {
        mobile: 480,
        mobileLarge: 767,
        tablet: 1023,
        desktop: 1199,
        large: 1200
    },
    maxPersons: 10,
    minPersons: 1,
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

const VALIDATION = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[0-9\s\-\(\)]{10,}$/
};

/* ===== UTILITY FUNCTIONS ===== */
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

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

function getDeviceType() {
    const width = window.innerWidth;
    if (width <= CONFIG.breakpoints.mobile) return 'mobile';
    if (width <= CONFIG.breakpoints.mobileLarge) return 'mobile-large';
    if (width <= CONFIG.breakpoints.tablet) return 'tablet';
    if (width <= CONFIG.breakpoints.desktop) return 'desktop';
    return 'large';
}

function isMobile() {
    return window.innerWidth <= CONFIG.breakpoints.mobileLarge;
}

/* ===== MAIN INITIALIZATION ===== */
function initCoffeeWebsite() {
    console.log('🚀 Initializing Coffee Website...');
    try {
        initSmoothScrolling();
        initScrollAnimations();
        initHoverAnimations();
        initTestimonialSlider();
        initLoadingAnimation();
        initMobileMenu();
        handleResponsiveLayout();
        console.log('✅ Coffee Website initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing Coffee Website:', error);
    }
}

/* ===== SMOOTH SCROLLING ===== */
function initSmoothScrolling() {
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
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* ===== TESTIMONIAL SLIDER ===== */
function initTestimonialSlider() {
    const slider = $('.testimonials-grid');
    const dots = $$('.testimonial-dots .dot');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const testimonialItems = $$('.testimonial-item');
    
    if (!slider || !dots.length) return;
    
    let currentSlide = 0;
    let isPlaying = true;
    let autoPlayInterval;
    
    function getSlideWidth() {
        const item = testimonialItems[0];
        if (!item) return 390;
        const deviceType = getDeviceType();
        const itemWidth = item.offsetWidth;
        let gap;
        switch(deviceType) {
            case 'mobile': gap = 15; break;
            case 'mobile-large': gap = 20; break;
            case 'tablet': gap = 30; break;
            default: gap = 40;
        }
        return itemWidth + gap;
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (isPlaying) nextSlide();
        }, CONFIG.testimonialInterval);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function updateSlider() {
        const slideWidth = getSlideWidth();
        const translateX = -currentSlide * slideWidth;
        slider.style.transform = `translateX(${translateX}px)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === testimonialItems.length - 1;
    }
    
    function nextSlide() {
        if (currentSlide < testimonialItems.length - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlider();
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = testimonialItems.length - 1;
        }
        updateSlider();
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        setTimeout(startAutoPlay, 10000);
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        setTimeout(startAutoPlay, 10000);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000);
        });
    });
    
    slider.addEventListener('mouseenter', () => {
        if (isPlaying) stopAutoPlay();
    });
    
    slider.addEventListener('mouseleave', () => {
        if (isPlaying) startAutoPlay();
    });
    
    // Touch support
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
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        if (isPlaying) setTimeout(startAutoPlay, 10000);
    });
    
    window.addEventListener('resize', debounce(() => {
        updateSlider();
    }, 250));
    
    updateSlider();
    startAutoPlay();
}

/* ===== LOADING ANIMATION ===== */
function initLoadingAnimation() {
    document.body.classList.add('loading');
    
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });
    
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 500);
    });
    
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
}

/* ===== RESPONSIVE UTILITIES ===== */
function initMobileMenu() {
    const nav = $('nav');
    const navLinks = $('.nav-links');
    
    if (isMobile()) {
        let hamburger = $('.hamburger-menu');
        if (!hamburger) {
            hamburger = document.createElement('button');
            hamburger.className = 'hamburger-menu';
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            hamburger.style.cssText = `
                display: none;
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 10px;
            `;
            
            nav.appendChild(hamburger);
            
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
            });
        }
        
        if (window.innerWidth <= CONFIG.breakpoints.mobile) {
            hamburger.style.display = 'block';
            navLinks.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.9);
                flex-direction: column;
                padding: 20px;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            `;
        }
    }
}

function handleResponsiveLayout() {
    const deviceType = getDeviceType();
    const testimonialItems = $$('.testimonial-item');
    
    testimonialItems.forEach(item => {
        switch(deviceType) {
            case 'mobile':
                item.style.minWidth = '260px';
                item.style.flex = '0 0 260px';
                break;
            case 'mobile-large':
                item.style.minWidth = '280px';
                item.style.flex = '0 0 280px';
                break;
            case 'tablet':
                item.style.minWidth = '320px';
                item.style.flex = '0 0 320px';
                break;
            default:
                item.style.minWidth = '350px';
                item.style.flex = '0 0 350px';
        }
    });
    
    const heroContent = $('.hero-content');
    if (heroContent && isMobile()) {
        heroContent.style.padding = '0 20px';
    }
}

/* ===== PLACEHOLDER FUNCTIONS ===== */
function initFormValidation() {
    console.log('📝 Form validation ready');
}

function initBackToTop() {
    console.log('⬆️ Back to top ready');
}

function initBusinessHours() {
    console.log('🕒 Business hours ready');
}

function initNewsletterSignup() {
    console.log('📧 Newsletter signup ready');
}

/* ===== EVENT LISTENERS ===== */
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    initCoffeeWebsite();
});

window.addEventListener('resize', debounce(() => {
    handleResponsiveLayout();
    const currentDevice = getDeviceType();
    if (currentDevice === 'mobile' || currentDevice === 'mobile-large') {
        initMobileMenu();
    }
}, 250));

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👁️ Page hidden - pausing animations');
    } else {
        console.log('👁️ Page visible - resuming animations');
    }
});

console.log('📄 Coffee Website JavaScript loaded');