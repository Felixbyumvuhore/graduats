// Skills Page JavaScript Module
function initializeSkills() {
    setupSkillFilters();
    setupSkillCards();
    setupProgressAnimations();
    setupSkillActions();
    loadSkillsData();
    animateCounters();
}

// Skill filtering functionality
function setupSkillFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            // Filter skill cards
            skillCards.forEach(card => {
                const cardCategory = card.dataset.category;
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.classList.add('animate-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animate-in');
                }
            });
        });
    });
    
    // Set first button as active by default
    if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
    }
}

// Setup skill card interactions
function setupSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Setup skill action buttons
        const learnBtn = card.querySelector('.skill-btn.primary');
        const detailsBtn = card.querySelector('.skill-btn:not(.primary)');
        
        if (learnBtn) {
            learnBtn.addEventListener('click', function() {
                const skillName = card.querySelector('h3').textContent;
                startLearning(skillName);
            });
        }
        
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function() {
                const skillName = card.querySelector('h3').textContent;
                showSkillDetails(skillName);
            });
        }
    });
}

// Animate progress bars
function setupProgressAnimations() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.dataset.progress || '0';
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth + '%';
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Setup skill action handlers
function setupSkillActions() {
    const mySkillsBtn = document.getElementById('mySkillsBtn');
    const addSkillBtn = document.getElementById('addSkillBtn');
    
    if (mySkillsBtn) {
        mySkillsBtn.addEventListener('click', function() {
            showMySkills();
        });
    }
    
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            showAddSkillModal();
        });
    }
}

// Load and display skills data
function loadSkillsData() {
    const skillsData = [
        // Engineering Skills
        {
            name: 'Civil Engineering Design',
            category: 'engineering',
            description: 'Master structural design and construction principles',
            progress: 75,
            icon: 'fas fa-building',
            difficulty: 'Advanced'
        },
        {
            name: 'Water Systems Management',
            category: 'engineering',
            description: 'Design and manage water treatment and distribution systems',
            progress: 60,
            icon: 'fas fa-tint',
            difficulty: 'Intermediate'
        },
        {
            name: 'Programming & Software Development',
            category: 'engineering',
            description: 'Master modern programming languages and frameworks',
            progress: 85,
            icon: 'fas fa-code',
            difficulty: 'Intermediate'
        },
        {
            name: 'Architectural Design',
            category: 'engineering',
            description: 'Create innovative and sustainable building designs',
            progress: 70,
            icon: 'fas fa-drafting-compass',
            difficulty: 'Advanced'
        },
        
        // Health Sciences Skills
        {
            name: 'Laboratory Diagnostics',
            category: 'health',
            description: 'Master biomedical laboratory techniques and analysis',
            progress: 80,
            icon: 'fas fa-microscope',
            difficulty: 'Advanced'
        },
        {
            name: 'Patient Care & Nursing',
            category: 'health',
            description: 'Provide comprehensive patient care and support',
            progress: 90,
            icon: 'fas fa-user-nurse',
            difficulty: 'Intermediate'
        },
        {
            name: 'Pharmaceutical Sciences',
            category: 'health',
            description: 'Understand drug development and medication management',
            progress: 65,
            icon: 'fas fa-pills',
            difficulty: 'Advanced'
        },
        {
            name: 'Anesthesia Techniques',
            category: 'health',
            description: 'Master anesthesia administration and patient monitoring',
            progress: 55,
            icon: 'fas fa-heartbeat',
            difficulty: 'Expert'
        },
        
        // Business & Economics Skills
        {
            name: 'Economic Analysis',
            category: 'business',
            description: 'Analyze market trends and economic indicators',
            progress: 70,
            icon: 'fas fa-chart-line',
            difficulty: 'Intermediate'
        },
        {
            name: 'Enterprise Management',
            category: 'business',
            description: 'Lead organizations and manage business operations',
            progress: 60,
            icon: 'fas fa-briefcase',
            difficulty: 'Advanced'
        },
        {
            name: 'Land Valuation',
            category: 'business',
            description: 'Assess property values and real estate markets',
            progress: 45,
            icon: 'fas fa-map-marked-alt',
            difficulty: 'Intermediate'
        },
        {
            name: 'Statistical Analysis',
            category: 'business',
            description: 'Apply statistical methods to economic data',
            progress: 75,
            icon: 'fas fa-calculator',
            difficulty: 'Intermediate'
        },
        
        // Applied Sciences Skills
        {
            name: 'Biotechnology Research',
            category: 'sciences',
            description: 'Conduct research in biological and technological applications',
            progress: 50,
            icon: 'fas fa-dna',
            difficulty: 'Advanced'
        },
        {
            name: 'Land Surveying',
            category: 'sciences',
            description: 'Measure and map land boundaries and features',
            progress: 65,
            icon: 'fas fa-map',
            difficulty: 'Intermediate'
        },
        {
            name: 'Information Management',
            category: 'sciences',
            description: 'Organize and manage information systems and libraries',
            progress: 70,
            icon: 'fas fa-database',
            difficulty: 'Intermediate'
        },
        
        // Languages & Communication Skills
        {
            name: 'Multilingual Communication',
            category: 'languages',
            description: 'Master French, English, and Kinyarwanda communication',
            progress: 85,
            icon: 'fas fa-globe',
            difficulty: 'Intermediate'
        },
        {
            name: 'Professional Writing',
            category: 'languages',
            description: 'Develop advanced writing and documentation skills',
            progress: 75,
            icon: 'fas fa-pen',
            difficulty: 'Intermediate'
        },
        {
            name: 'Public Speaking',
            category: 'languages',
            description: 'Master presentation and public communication skills',
            progress: 60,
            icon: 'fas fa-microphone',
            difficulty: 'Beginner'
        }
    ];
    
    renderSkillCards(skillsData);
    createFilterButtons(skillsData);
}

// Render skill cards
function renderSkillCards(skills) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;
    
    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card animate-in" data-category="${skill.category}">
            <div class="skill-header">
                <div class="skill-icon">
                    <i class="${skill.icon}"></i>
                </div>
                <div class="skill-info">
                    <h3>${skill.name}</h3>
                    <span class="skill-category">${skill.difficulty}</span>
                </div>
            </div>
            
            <p class="skill-description">${skill.description}</p>
            
            <div class="skill-progress">
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${skill.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" data-progress="${skill.progress}"></div>
                </div>
            </div>
            
            <div class="skill-actions">
                <button class="skill-btn">View Details</button>
                <button class="skill-btn primary">Start Learning</button>
            </div>
        </div>
    `).join('');
    
    // Re-setup interactions for new cards
    setupSkillCards();
    setupProgressAnimations();
}

// Create filter buttons
function createFilterButtons(skills) {
    const categories = [...new Set(skills.map(skill => skill.category))];
    const filtersContainer = document.querySelector('.category-filters');
    
    if (!filtersContainer) return;
    
    const filterHTML = `
        <button class="filter-btn active" data-category="all">All Skills</button>
        ${categories.map(category => `
            <button class="filter-btn" data-category="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
        `).join('')}
    `;
    
    filtersContainer.innerHTML = filterHTML;
    setupSkillFilters();
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 30);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Action handlers
function startLearning(skillName) {
    showNotification(`Starting ${skillName} learning path!`, 'success');
    
    // Simulate navigation to learning content
    setTimeout(() => {
        const modal = createLearningModal(skillName);
        document.body.appendChild(modal);
    }, 500);
}

function showSkillDetails(skillName) {
    const modal = createSkillDetailsModal(skillName);
    document.body.appendChild(modal);
}

function showMySkills() {
    showNotification('Loading your personal skills dashboard...', 'info');
    
    // Filter to show only skills with progress > 0
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const progress = card.querySelector('.progress-fill').dataset.progress;
        if (parseInt(progress) > 0) {
            card.style.display = 'block';
            card.classList.add('highlight');
        } else {
            card.style.display = 'none';
        }
    });
}

function showAddSkillModal() {
    const modal = createAddSkillModal();
    document.body.appendChild(modal);
}

// Modal creators
function createLearningModal(skillName) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Start Learning ${skillName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="learning-options">
                    <div class="option-card">
                        <i class="fas fa-video"></i>
                        <h3>Video Course</h3>
                        <p>Interactive video lessons with hands-on projects</p>
                        <button class="btn btn-primary">Start Course</button>
                    </div>
                    <div class="option-card">
                        <i class="fas fa-users"></i>
                        <h3>Study Group</h3>
                        <p>Join peers learning the same skill</p>
                        <button class="btn btn-secondary">Join Group</button>
                    </div>
                    <div class="option-card">
                        <i class="fas fa-user-tie"></i>
                        <h3>Find Mentor</h3>
                        <p>Get guidance from experienced professionals</p>
                        <button class="btn btn-secondary">Find Mentor</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add close functionality
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function createSkillDetailsModal(skillName) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${skillName} Details</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="skill-details">
                    <div class="detail-section">
                        <h3>What you'll learn</h3>
                        <ul>
                            <li>Core concepts and fundamentals</li>
                            <li>Practical applications and projects</li>
                            <li>Industry best practices</li>
                            <li>Advanced techniques and optimization</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h3>Prerequisites</h3>
                        <p>Basic understanding of programming concepts recommended</p>
                    </div>
                    <div class="detail-section">
                        <h3>Duration</h3>
                        <p>4-6 weeks with 2-3 hours per week</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary">Start Learning</button>
                    <button class="btn btn-secondary">Add to Wishlist</button>
                </div>
            </div>
        </div>
    `;
    
    // Add close functionality
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function createAddSkillModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Skill</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="add-skill-form">
                    <div class="form-group">
                        <label>Skill Name</label>
                        <input type="text" placeholder="e.g., Machine Learning" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select required>
                            <option value="">Select category</option>
                            <option value="programming">Programming</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="analytics">Analytics</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Current Level</label>
                        <select required>
                            <option value="">Select level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Learning Goal</label>
                        <textarea placeholder="What do you want to achieve with this skill?"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Add Skill</button>
                        <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add close functionality
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
        });
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submission
    modal.querySelector('.add-skill-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Skill added successfully!', 'success');
        modal.remove();
    });
    
    return modal;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSkills);
} else {
    initializeSkills();
}
