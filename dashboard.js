// Dashboard JavaScript Module
function initializeDashboard() {
    setupProfileCompletion();
    setupQuickStats();
    setupRecommendationsFeed();
    setupSkillsVisualization();
    setupActivityTimeline();
    setupDashboardAnimations();
    loadDashboardData();
}

// Profile completion functionality
function setupProfileCompletion() {
    const progressRing = document.querySelector('.progress-ring-circle');
    const completionPercentage = document.querySelector('.completion-percentage');
    const completeProfileBtn = document.querySelector('.completion-info .btn');
    
    if (progressRing && completionPercentage) {
        const percentage = parseInt(completionPercentage.textContent);
        animateProgressRing(progressRing, percentage);
    }
    
    if (completeProfileBtn) {
        completeProfileBtn.addEventListener('click', function() {
            window.location.href = 'profile-builder.html';
        });
    }
}

function animateProgressRing(ring, percentage) {
    const radius = ring.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
    ring.style.strokeDashoffset = circumference;
    
    // Animate the progress
    setTimeout(() => {
        ring.style.transition = 'stroke-dashoffset 1s ease-in-out';
        ring.style.strokeDashoffset = offset;
    }, 500);
}

// Quick stats functionality
function setupQuickStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click handlers for navigation
        card.addEventListener('click', function() {
            const statType = this.querySelector('.stat-icon i').className;
            navigateToStatDetail(statType);
        });
        
        // Animate stats on load
        setTimeout(() => {
            card.classList.add('dashboard-animate');
        }, index * 100);
    });
}

function navigateToStatDetail(iconClass) {
    const navigationMap = {
        'fas fa-paper-plane': 'applications.html',
        'fas fa-eye': 'profile.html',
        'fas fa-heart': 'saved-jobs.html',
        'fas fa-handshake': 'interviews.html'
    };
    
    const destination = navigationMap[iconClass];
    if (destination) {
        window.location.href = destination;
    }
}

// Recommendations feed functionality
function setupRecommendationsFeed() {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    const viewAllBtn = document.querySelector('.recommendations-feed .btn-text');
    
    opportunityCards.forEach(card => {
        setupOpportunityCard(card);
    });
    
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'opportunities.html';
        });
    }
    
    // Auto-refresh recommendations
    setInterval(refreshRecommendations, 300000); // 5 minutes
}

function setupOpportunityCard(card) {
    const quickApplyBtn = card.querySelector('.btn-primary');
    const bookmarkBtn = card.querySelector('.btn-secondary');
    const skillTags = card.querySelectorAll('.skill-tag');
    
    // Quick apply functionality
    if (quickApplyBtn) {
        quickApplyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleQuickApply(card);
        });
    }
    
    // Bookmark functionality
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleBookmark(card, this);
        });
    }
    
    // Skill tag interactions
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const skill = this.textContent.trim();
            searchBySkill(skill);
        });
    });
    
    // Card hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = 'var(--shadow-lg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-base)';
    });
}

function handleQuickApply(card) {
    const jobTitle = card.querySelector('.opportunity-title').textContent;
    const company = card.querySelector('.company-name').textContent;
    
    // Show confirmation modal
    showQuickApplyModal(jobTitle, company, card);
}

function showQuickApplyModal(jobTitle, company, card) {
    const modal = Utils.DOM.create('div', {
        className: 'quick-apply-modal'
    }, `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Quick Apply</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="job-info">
                    <h4>${jobTitle}</h4>
                    <p>at ${company}</p>
                </div>
                <p>Are you sure you want to apply for this position? Your profile and resume will be sent to the employer.</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" id="confirmApply">
                        <i class="fas fa-paper-plane"></i>
                        Apply Now
                    </button>
                    <button class="btn btn-secondary" id="cancelApply">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Event handlers
    modal.querySelector('#confirmApply').addEventListener('click', () => {
        processQuickApplication(jobTitle, company, card);
        closeModal(modal);
    });
    
    modal.querySelector('#cancelApply').addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        closeModal(modal);
    });
}

function processQuickApplication(jobTitle, company, card) {
    // Show loading state
    const quickApplyBtn = card.querySelector('.btn-primary');
    const originalText = quickApplyBtn.innerHTML;
    
    quickApplyBtn.innerHTML = '<div class="loading"></div> Applying...';
    quickApplyBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update button to applied state
        quickApplyBtn.innerHTML = '<i class="fas fa-check"></i> Applied';
        quickApplyBtn.classList.remove('btn-primary');
        quickApplyBtn.classList.add('btn-success');
        
        // Show success notification
        MainApp.showNotification(`Successfully applied to ${jobTitle} at ${company}!`, 'success');
        
        // Update application count
        updateApplicationCount();
        
        // Add to recent activity
        addToRecentActivity('application', `Applied to ${jobTitle}`, `at ${company}`);
        
    }, 2000);
}

function toggleBookmark(card, button) {
    const isBookmarked = button.classList.contains('bookmarked');
    const jobTitle = card.querySelector('.opportunity-title').textContent;
    
    if (isBookmarked) {
        button.classList.remove('bookmarked');
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
        MainApp.showNotification(`Removed ${jobTitle} from saved jobs`, 'info');
        updateSavedJobsCount(-1);
    } else {
        button.classList.add('bookmarked');
        button.innerHTML = '<i class="fas fa-bookmark" style="color: var(--color-secondary);"></i>';
        MainApp.showNotification(`Saved ${jobTitle} to your bookmarks`, 'success');
        updateSavedJobsCount(1);
    }
}

function searchBySkill(skill) {
    const searchUrl = `opportunities.html?skill=${encodeURIComponent(skill)}`;
    window.location.href = searchUrl;
}

// Skills visualization
function setupSkillsVisualization() {
    const skillsChart = document.getElementById('skillsChart');
    const manageSkillsBtn = document.querySelector('.skills-section .btn-text');
    
    if (skillsChart) {
        renderSkillsChart(skillsChart);
    }
    
    if (manageSkillsBtn) {
        manageSkillsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'skills.html';
        });
    }
    
    // Setup trending skills
    const trendingSkills = document.querySelectorAll('.trending-skill');
    trendingSkills.forEach(skill => {
        skill.addEventListener('click', function() {
            const skillName = this.textContent.trim().replace('↑', '').trim();
            window.location.href = `skills.html?learn=${encodeURIComponent(skillName)}`;
        });
    });
}

function renderSkillsChart(canvas) {
    const ctx = canvas.getContext('2d');
    const skills = [
        { name: 'JavaScript', level: 85 },
        { name: 'React', level: 78 },
        { name: 'CSS', level: 90 },
        { name: 'Node.js', level: 65 },
        { name: 'Python', level: 70 },
        { name: 'SQL', level: 60 }
    ];
    
    // Simple radar chart implementation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const angleStep = (2 * Math.PI) / skills.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid circles
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw grid lines
    skills.forEach((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    });
    
    // Draw skill levels
    ctx.fillStyle = 'rgba(30, 64, 175, 0.3)';
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const distance = (skill.level / 100) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw skill points
    ctx.fillStyle = '#1e40af';
    skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const distance = (skill.level / 100) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw skill labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const labelDistance = radius + 20;
        const x = centerX + Math.cos(angle) * labelDistance;
        const y = centerY + Math.sin(angle) * labelDistance;
        
        ctx.fillText(skill.name, x, y);
        ctx.fillText(`${skill.level}%`, x, y + 15);
    });
}

// Activity timeline functionality
function setupActivityTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // Animate timeline items
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
        
        // Add click handlers for expandable content
        item.addEventListener('click', function() {
            expandTimelineItem(this);
        });
    });
}

function expandTimelineItem(item) {
    const isExpanded = item.classList.contains('expanded');
    
    // Collapse all other items
    document.querySelectorAll('.timeline-item.expanded').forEach(expandedItem => {
        if (expandedItem !== item) {
            expandedItem.classList.remove('expanded');
        }
    });
    
    // Toggle current item
    item.classList.toggle('expanded');
    
    if (!isExpanded) {
        // Add detailed content
        const existingDetails = item.querySelector('.timeline-details');
        if (!existingDetails) {
            const details = Utils.DOM.create('div', {
                className: 'timeline-details'
            }, getTimelineItemDetails(item));
            
            item.querySelector('.timeline-content').appendChild(details);
        }
    }
}

function getTimelineItemDetails(item) {
    const type = item.querySelector('.timeline-icon').className;
    
    if (type.includes('application')) {
        return `
            <div class="timeline-detail-content">
                <p><strong>Application Status:</strong> Under Review</p>
                <p><strong>Applied via:</strong> Quick Apply</p>
                <p><strong>Resume:</strong> Software_Developer_Resume_2024.pdf</p>
                <div class="timeline-actions">
                    <button class="btn btn-small btn-secondary">View Application</button>
                    <button class="btn btn-small btn-text">Withdraw</button>
                </div>
            </div>
        `;
    } else if (type.includes('profile')) {
        return `
            <div class="timeline-detail-content">
                <p><strong>Changes made:</strong> Added new project "E-commerce Platform"</p>
                <p><strong>Skills updated:</strong> React, Node.js, MongoDB</p>
                <p><strong>Profile views:</strong> +12 since update</p>
                <div class="timeline-actions">
                    <button class="btn btn-small btn-secondary">View Profile</button>
                </div>
            </div>
        `;
    } else if (type.includes('skill')) {
        return `
            <div class="timeline-detail-content">
                <p><strong>Course Duration:</strong> 4 weeks</p>
                <p><strong>Final Score:</strong> 95%</p>
                <p><strong>Certificate ID:</strong> INES-REACT-2024-001</p>
                <div class="timeline-actions">
                    <button class="btn btn-small btn-secondary">View Certificate</button>
                    <button class="btn btn-small btn-text">Share Achievement</button>
                </div>
            </div>
        `;
    }
    
    return '<p>No additional details available.</p>';
}

// Dashboard animations
function setupDashboardAnimations() {
    // Animate sections on scroll
    const sections = document.querySelectorAll('.welcome-section, .quick-stats, .recommendations-feed, .skills-section, .activity-timeline');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('dashboard-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Stagger animation for opportunity cards
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    opportunityCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Data loading and management
function loadDashboardData() {
    // Load user profile data
    loadUserProfile();
    
    // Load recommendations
    loadRecommendations();
    
    // Load activity timeline
    loadActivityTimeline();
    
    // Load skills data
    loadSkillsData();
}

function loadUserProfile() {
    // Simulate API call
    const userData = {
        name: 'John Doe',
        profileCompletion: 70,
        stats: {
            applications: 12,
            profileViews: 48,
            savedJobs: 23,
            interviews: 5
        }
    };
    
    // Update UI with user data
    const userName = document.querySelector('.user-name');
    if (userName) {
        userName.textContent = userData.name;
    }
    
    // Update stats
    updateDashboardStats(userData.stats);
}

function loadRecommendations() {
    // This would typically fetch from an API
    // For now, we'll use the static content in HTML
    console.log('Loading recommendations...');
}

function loadActivityTimeline() {
    // This would typically fetch recent activities from an API
    console.log('Loading activity timeline...');
}

function loadSkillsData() {
    // This would typically fetch user's skills from an API
    console.log('Loading skills data...');
}

// Helper functions
function updateDashboardStats(stats) {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((statNumber, index) => {
        const values = Object.values(stats);
        if (values[index] !== undefined) {
            MainApp.animateValue(statNumber, 0, values[index], 1000);
        }
    });
}

function updateApplicationCount() {
    const applicationStat = document.querySelector('.stat-card .fa-paper-plane').closest('.stat-card').querySelector('.stat-number');
    if (applicationStat) {
        const currentCount = parseInt(applicationStat.textContent);
        MainApp.animateValue(applicationStat, currentCount, currentCount + 1, 500);
    }
}

function updateSavedJobsCount(change) {
    const savedJobsStat = document.querySelector('.stat-card .fa-heart').closest('.stat-card').querySelector('.stat-number');
    if (savedJobsStat) {
        const currentCount = parseInt(savedJobsStat.textContent);
        MainApp.animateValue(savedJobsStat, currentCount, currentCount + change, 500);
    }
}

function addToRecentActivity(type, title, description) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const iconMap = {
        application: 'fas fa-paper-plane',
        profile: 'fas fa-user-edit',
        skill: 'fas fa-graduation-cap'
    };
    
    const colorMap = {
        application: 'application',
        profile: 'profile',
        skill: 'skill'
    };
    
    const newActivity = Utils.DOM.create('div', {
        className: 'timeline-item'
    }, `
        <div class="timeline-icon ${colorMap[type]}">
            <i class="${iconMap[type]}"></i>
        </div>
        <div class="timeline-content">
            <h4>${title}</h4>
            <p>${description}</p>
            <span class="timeline-date">Just now</span>
        </div>
    `);
    
    // Insert at the beginning
    timeline.insertBefore(newActivity, timeline.firstChild);
    
    // Animate in
    newActivity.style.opacity = '0';
    newActivity.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        newActivity.style.transition = 'all 0.5s ease-out';
        newActivity.style.opacity = '1';
        newActivity.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove oldest item if more than 5
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    if (timelineItems.length > 5) {
        timeline.removeChild(timelineItems[timelineItems.length - 1]);
    }
}

function refreshRecommendations() {
    // This would typically fetch new recommendations from the API
    console.log('Refreshing recommendations...');
    
    // Show a subtle notification
    MainApp.showNotification('New job recommendations available!', 'info', 3000);
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
});
