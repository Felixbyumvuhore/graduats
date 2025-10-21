// Animations JavaScript Module
function initializeAnimations() {
    setupScrollAnimations();
    setupHoverAnimations();
    setupLoadingAnimations();
    setupParticleEffect();
}

// Scroll-based animations
function setupScrollAnimations() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger effect for multiple elements
                const siblings = entry.target.parentElement?.querySelectorAll('.animate-on-scroll');
                if (siblings && siblings.length > 1) {
                    Array.from(siblings).forEach((sibling, index) => {
                        if (sibling === entry.target) return;
                        setTimeout(() => {
                            sibling.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Hover animations
function setupHoverAnimations() {
    // Card hover effects
    document.querySelectorAll('.card, .opportunity-card, .person-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Button ripple effect
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

// Loading animations
function setupLoadingAnimations() {
    // Page load animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero elements
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroActions = document.querySelector('.hero-actions');
        
        if (heroTitle) {
            setTimeout(() => heroTitle.classList.add('animate-in'), 300);
        }
        if (heroSubtitle) {
            setTimeout(() => heroSubtitle.classList.add('animate-in'), 600);
        }
        if (heroActions) {
            setTimeout(() => heroActions.classList.add('animate-in'), 900);
        }
    });
}

// Particle effect for hero section
function setupParticleEffect() {
    const heroParticles = document.getElementById('heroParticles');
    if (!heroParticles) return;
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        createParticle(heroParticles);
    }
}

function createParticle(container) {
    if (!container) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and animation
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = 3 + Math.random() * 4;
    const delay = Math.random() * 2;
    
    particle.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        animation: float ${duration}s ease-in-out infinite ${delay}s;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

// Ripple effect for buttons
function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Counter animation
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (range * easedProgress));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Typing animation
function typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Smooth scroll to element
function smoothScrollTo(target, duration = 1000) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}
