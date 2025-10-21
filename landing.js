// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLanding();
});

function initializeLanding() {
    setupLoadingScreen();
    setupNavigation();
    setupHeroAnimations();
    setupDepartmentsCarousel();
    setupScrollAnimations();
    setupCTAButtons();
    setupVideoModal();
}

// Loading Screen
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }, 3000);
}

// Navigation
function setupNavigation() {
    const nav = document.getElementById('landingNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Toggle backdrop
            if (mobileBackdrop) {
                mobileBackdrop.classList.toggle('active');
            }
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close menu when clicking on backdrop
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            mobileBackdrop.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            if (mobileBackdrop) {
                mobileBackdrop.classList.remove('active');
            }
            document.body.style.overflow = 'auto';
        }
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only prevent default for anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
            }
            const mobileBackdrop = document.getElementById('mobileBackdrop');
            if (mobileBackdrop) {
                mobileBackdrop.classList.remove('active');
            }
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu on window resize to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
            }
            if (mobileBackdrop) {
                mobileBackdrop.classList.remove('active');
            }
            document.body.style.overflow = 'auto';
        }
    });
}

// Hero Animations
function setupHeroAnimations() {
    // Animate counter numbers
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const current = parseInt(counter.textContent);
            const increment = target / 100;
            
            if (current < target) {
                counter.textContent = Math.ceil(current + increment);
                setTimeout(animateCounters, 20);
            } else {
                counter.textContent = target;
            }
        });
    };
    
    // Start animation when hero is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

// Departments Carousel
function setupDepartmentsCarousel() {
    const slides = document.querySelectorAll('.department-slide');
    const buttons = document.querySelectorAll('.carousel-btn');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        buttons.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }
    
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-rotate carousel
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
}

// Scroll Animations
function setupScrollAnimations() {
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
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .about-features .feature-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// CTA Buttons
function setupCTAButtons() {
    const exploreBtn = document.getElementById('exploreBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const joinNowBtn = document.getElementById('joinNowBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    // Navigate to main platform
    [exploreBtn, getStartedBtn, joinNowBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    });
    
    // Login functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // For now, redirect to main platform
            window.location.href = 'index.html';
        });
    }
}

// Video Modal
function setupVideoModal() {
    const watchVideoBtn = document.getElementById('watchVideoBtn');
    const videoModal = document.getElementById('videoModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    if (watchVideoBtn) {
        watchVideoBtn.addEventListener('click', () => {
            videoModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Load demo video (placeholder)
            const iframe = videoModal.querySelector('iframe');
            iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        });
    }
    
    [modalClose, modalBackdrop].forEach(element => {
        if (element) {
            element.addEventListener('click', () => {
                videoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Stop video
                const iframe = videoModal.querySelector('iframe');
                iframe.src = '';
            });
        }
    });
}
