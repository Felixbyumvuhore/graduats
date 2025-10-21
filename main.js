// Main JavaScript Entry Point
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core modules
    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }
    if (typeof initializeAnimations === 'function') {
        initializeAnimations();
    }
    if (typeof initializeNotifications === 'function') {
        initializeNotifications();
    }
    setupGlobalNavigation();
    
    // Initialize page-specific modules
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            if (typeof initializeHero === 'function') {
                initializeHero();
            }
            break;
        case 'dashboard':
            if (typeof initializeDashboard === 'function') {
                initializeDashboard();
            }
            break;
        case 'opportunities':
            if (typeof initializeOpportunities === 'function') {
                initializeOpportunities();
            }
            break;
        case 'skills':
            if (typeof initializeSkills === 'function') {
                initializeSkills();
            }
            break;
        case 'network':
            if (typeof initializeNetwork === 'function') {
                initializeNetwork();
            }
            break;
        case 'profile-builder':
            if (typeof initializeProfileBuilder === 'function') {
                initializeProfileBuilder();
            }
            break;
        case 'landing':
            if (typeof initializeLanding === 'function') {
                initializeLanding();
            }
            break;
    }
    
    // Initialize global features
    if (typeof setupScrollEffects === 'function') {
        setupScrollEffects();
    }
    if (typeof setupFormHandling === 'function') {
        setupFormHandling();
    }
    if (typeof setupLoadingStates === 'function') {
        setupLoadingStates();
    }
    
    // Global event listeners
    setupGlobalEventListeners();
});

// Utility function to get current page
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

// Setup global navigation for all buttons and links
function setupGlobalNavigation() {
    // Navigation links in header - allow normal navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.endsWith('.html')) {
                // Add loading state but don't prevent default navigation
                document.body.classList.add('page-loading');
            }
        });
    });
    
    // CTA buttons throughout the site
    const ctaButtons = document.querySelectorAll('[data-navigate]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-navigate');
            navigateToPage(target);
        });
    });
    
    // Logo click - allow normal navigation
    const logo = document.querySelector('.nav-brand');
    if (logo) {
        logo.addEventListener('click', function(e) {
            // Add loading state but allow normal navigation
            document.body.classList.add('page-loading');
        });
    }
}

// Navigate to page with loading animation
function navigateToPage(page) {
    // Add loading state
    document.body.classList.add('page-loading');
    
    // Small delay for smooth transition
    setTimeout(() => {
        window.location.href = page;
    }, 300);
}

// Global event listeners
function setupGlobalEventListeners() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });
    

    // Handle button clicks with loading states
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('btn-loading')) {
                e.preventDefault();
                return;
            }
            
            // Add loading state for async operations
            if (this.dataset.async === 'true') {
                addLoadingState(this);
            }
        });
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleWindowResize, 250));
    
    // Handle scroll events
    window.addEventListener('scroll', throttle(handleScroll, 16));
}

// Form submission handler
function handleFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Add loading state
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        addLoadingState(submitButton);
    }
    
    // Simulate API call
    setTimeout(() => {
        if (submitButton) {
            removeLoadingState(submitButton);
        }
        showNotification('Form submitted successfully!', 'success');
    }, 2000);
}

// Loading state management
function addLoadingState(button) {
    button.classList.add('btn-loading');
    button.disabled = true;
    
    const originalText = button.innerHTML;
    button.dataset.originalText = originalText;
    
    button.innerHTML = `
        <div class="loading"></div>
        Loading...
    `;
}

function removeLoadingState(button) {
    button.classList.remove('btn-loading');
    button.disabled = false;
    
    if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
        delete button.dataset.originalText;
    }
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    // ESC key handling
    if (e.key === 'Escape') {
        // Close any open modals, dropdowns, etc.
        closeAllOverlays();
    }
    
    // Tab navigation enhancements
    if (e.key === 'Tab') {
        // Add visual focus indicators
        document.body.classList.add('keyboard-navigation');
    }
}

// Window resize handler
function handleWindowResize() {
    // Update any size-dependent calculations
    updateLayoutCalculations();
    
    // Close mobile menu if window becomes large
    if (window.innerWidth >= 1024) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }
}

// Scroll handler
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Update navbar appearance
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Reveal animations on scroll
    revealOnScroll();
}

// Reveal elements on scroll
function revealOnScroll() {
    const elements = document.querySelectorAll('[data-reveal]');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Close all overlays
function closeAllOverlays() {
    // Close dropdowns
    document.querySelectorAll('.dropdown.active').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
    
    // Close modals
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Close notification panel
    const notificationPanel = document.querySelector('.notification-panel');
    if (notificationPanel && notificationPanel.classList.contains('active')) {
        notificationPanel.classList.remove('active');
    }
}

// Update layout calculations
function updateLayoutCalculations() {
    // Update CSS custom properties based on viewport
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update container calculations if needed
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        // Any dynamic container calculations
    });
}

// Notification system
function showNotification(message, type = 'info', duration = 5000) {
    const notification = createNotificationElement(message, type);
    const container = getNotificationContainer();
    
    container.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    return notification;
}

function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.info}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="removeNotification(this.parentElement)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    return notification;
}

function getNotificationContainer() {
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    return container;
}

function removeNotification(notification) {
    notification.classList.add('removing');
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Animation utilities
function animateValue(element, start, end, duration, callback) {
    const startTime = performance.now();
    const change = end - start;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + (change * easedProgress);
        
        if (callback) {
            callback(currentValue, progress);
        } else {
            element.textContent = Math.round(currentValue);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Local storage utilities
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// API utilities
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Export functions for use in other modules
window.MainApp = {
    showNotification,
    animateValue,
    saveToLocalStorage,
    loadFromLocalStorage,
    apiRequest,
    debounce,
    throttle
};
