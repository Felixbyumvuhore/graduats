// Hero Section JavaScript Module
function initializeHero() {
    setupHeroAnimations();
    setupStatCounters();
    setupParticleSystem();
    setupHeroButtons();
}

// Hero animations
function setupHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');
    const heroStats = document.querySelector('.hero-stats');
    
    // Ensure hero elements are immediately visible
    if (heroTitle) {
        heroTitle.style.opacity = '1';
        heroTitle.style.visibility = 'visible';
        heroTitle.style.display = 'block';
        heroTitle.style.transform = 'translateY(0)';
        heroTitle.style.color = 'white';
        
        // Set gradient text color and styling
        const gradientText = heroTitle.querySelector('.text-gradient');
        if (gradientText) {
            gradientText.style.color = '#ffd700';
            gradientText.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffa500 100%)';
            gradientText.style.webkitBackgroundClip = 'text';
            gradientText.style.backgroundClip = 'text';
            gradientText.style.webkitTextFillColor = 'transparent';
            gradientText.style.fontWeight = '800';
            gradientText.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        }
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.visibility = 'visible';
        heroSubtitle.style.display = 'block';
        heroSubtitle.style.transform = 'translateY(0)';
        heroSubtitle.style.color = 'rgba(255, 255, 255, 0.9)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.8s ease-out';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (heroActions) {
        heroActions.style.opacity = '1';
        heroActions.style.visibility = 'visible';
        heroActions.style.display = 'flex';
        heroActions.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            heroActions.style.transition = 'all 0.8s ease-out';
            heroActions.style.opacity = '1';
            heroActions.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroStats) {
        heroStats.style.opacity = '1';
        heroStats.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroStats.style.transition = 'all 0.8s ease-out';
            heroStats.style.opacity = '1';
            heroStats.style.transform = 'translateY(0)';
            
            // Start counter animations after stats are visible
            setTimeout(() => {
                animateCounters();
            }, 500);
        }, 1200);
    }
}

// Animated counters for statistics
function setupStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        stat.textContent = '0';
        stat.dataset.current = '0';
    });
}

function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((stat, index) => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000 + (index * 200); // Stagger animations
        
        setTimeout(() => {
            if (typeof MainApp !== 'undefined' && MainApp.animateValue) {
                MainApp.animateValue(stat, 0, target, duration, (currentValue) => {
                    // Format numbers with appropriate suffixes
                    if (target >= 1000) {
                        stat.textContent = (currentValue / 1000).toFixed(1) + 'K';
                    } else if (target >= 100) {
                        stat.textContent = Math.round(currentValue);
                    } else {
                        stat.textContent = Math.round(currentValue) + '%';
                    }
                });
            } else {
                // Fallback: just set the target value
                if (target >= 1000) {
                    stat.textContent = (target / 1000).toFixed(1) + 'K';
                } else if (target >= 100) {
                    stat.textContent = target;
                } else {
                    stat.textContent = target + '%';
                }
            }
        }, index * 300);
    });
}

// Particle system for hero background
function setupParticleSystem() {
    const particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) return;
    
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        particles.push(particle);
        particlesContainer.appendChild(particle.element);
    }
    
    // Animate particles
    animateParticles(particles);
    
    // Handle window resize
    window.addEventListener('resize', MainApp.debounce(() => {
        updateParticleSystem(particles);
    }, 250));
}

function createParticle() {
    const element = document.createElement('div');
    element.className = 'hero-particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const opacity = Math.random() * 0.5 + 0.1;
    const speed = Math.random() * 2 + 0.5;
    const direction = Math.random() * Math.PI * 2;
    
    // Apply styles
    element.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${opacity});
        border-radius: 50%;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
    `;
    
    return {
        element,
        x,
        y,
        size,
        opacity,
        speed,
        direction,
        vx: Math.cos(direction) * speed,
        vy: Math.sin(direction) * speed
    };
}

function animateParticles(particles) {
    function updateParticles() {
        particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen edges
            if (particle.x < -particle.size) {
                particle.x = window.innerWidth + particle.size;
            } else if (particle.x > window.innerWidth + particle.size) {
                particle.x = -particle.size;
            }
            
            if (particle.y < -particle.size) {
                particle.y = window.innerHeight + particle.size;
            } else if (particle.y > window.innerHeight + particle.size) {
                particle.y = -particle.size;
            }
            
            // Apply position
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            
            // Subtle opacity animation
            const time = Date.now() * 0.001;
            const newOpacity = particle.opacity + Math.sin(time + particle.x * 0.01) * 0.1;
            particle.element.style.opacity = Math.max(0.05, Math.min(0.6, newOpacity));
        });
        
        requestAnimationFrame(updateParticles);
    }
    
    updateParticles();
}

function updateParticleSystem(particles) {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    particles.forEach(particle => {
        // Adjust particle positions for new screen size
        if (particle.x > newWidth) {
            particle.x = newWidth - particle.size;
        }
        if (particle.y > newHeight) {
            particle.y = newHeight - particle.size;
        }
    });
}

// Hero button interactions
function setupHeroButtons() {
    const buildProfileBtn = document.getElementById('buildProfileBtn');
    const exploreOpportunitiesBtn = document.getElementById('exploreOpportunitiesBtn');
    
    if (buildProfileBtn) {
        buildProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof showNotification === 'function') {
                showNotification('Redirecting to profile builder...', 'info');
            }
            setTimeout(() => {
                window.location.href = 'profile-builder.html';
            }, 500);
        });
        
        // Add hover effect
        buildProfileBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        buildProfileBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    if (exploreOpportunitiesBtn) {
        exploreOpportunitiesBtn.addEventListener('click', () => {
            window.location.href = 'opportunities.html';
        });
        
        // Add hover effect
        exploreOpportunitiesBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        exploreOpportunitiesBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Add ripple effect to buttons
    document.querySelectorAll('.hero-actions .btn').forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

function handleBuildProfile() {
    // Check if user is logged in
    const isLoggedIn = checkUserLogin();
    
    if (isLoggedIn) {
        // Redirect to profile builder
        window.location.href = 'profile-builder.html';
    } else {
        // Show login modal or redirect to login
        showLoginPrompt('Please log in to build your profile');
    }
}

function handleExploreOpportunities() {
    // Add loading state
    const button = document.getElementById('exploreOpportunitiesBtn');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<div class="loading"></div> Loading...';
    button.disabled = true;
    
    // Simulate loading and redirect
    setTimeout(() => {
        window.location.href = 'opportunities.html';
    }, 1000);
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
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
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Utility functions
function checkUserLogin() {
    // Check if user is logged in (mock implementation)
    if (typeof MainApp !== 'undefined' && MainApp.loadFromLocalStorage) {
        return MainApp.loadFromLocalStorage('userToken') !== null;
    }
    // Fallback to localStorage directly
    try {
        return localStorage.getItem('userToken') !== null;
    } catch (e) {
        return false;
    }
}

function showLoginPrompt(message) {
    // Create and show login modal
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Login Required</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="redirectToLogin()">
                        <i class="fas fa-sign-in-alt"></i>
                        Login
                    </button>
                    <button class="btn btn-secondary" onclick="redirectToSignup()">
                        <i class="fas fa-user-plus"></i>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close modal handlers
    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        closeModal(modal);
    });
    
    // ESC key handler
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function redirectToSignup() {
    window.location.href = 'signup.html';
}

// Scroll-triggered animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.feature-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', setupScrollAnimations);

// CSS for ripple animation (inject into head)
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .login-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .login-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 1rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        max-width: 400px;
        width: 90%;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .modal-actions .btn {
        flex: 1;
    }
    
    .hero-particle {
        will-change: transform, opacity;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .hero-particle {
            display: none;
        }
        
        .ripple {
            display: none;
        }
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
