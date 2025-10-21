// Navigation JavaScript Module
function initializeNavigation() {
    setupMobileMenu();
    setupSearchFunctionality();
    setupProfileDropdown();
    setupNotificationPanel();
    setupMegaMenu();
}

// Mobile menu functionality
function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) {
        // Silently return if elements don't exist (they may not be on all pages)
        return;
    }
    
    console.log('Mobile menu initialized');
    
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Hamburger clicked');
        
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close mobile menu when clicking on backdrop
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    
    console.log('Opening mobile menu');
    
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    
    // Show backdrop if it exists
    if (mobileBackdrop) {
        mobileBackdrop.classList.add('active');
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Animate menu items
    const menuItems = navMenu.querySelectorAll('.nav-link');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animationDelay = `${index * 0.05}s`;
            item.classList.add('slide-in');
        }, 50);
    });
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    
    if (!navMenu || !navToggle) return;
    
    console.log('Closing mobile menu');
    
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    
    // Hide backdrop if it exists
    if (mobileBackdrop) {
        mobileBackdrop.classList.remove('active');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Remove animation classes
    const menuItems = navMenu.querySelectorAll('.nav-link');
    menuItems.forEach(item => {
        item.style.animationDelay = '';
        item.classList.remove('slide-in');
    });
}

// Search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            hideSuggestions();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            showSuggestions();
        }
    });
    
    searchInput.addEventListener('blur', function() {
        // Delay hiding to allow clicking on suggestions
        setTimeout(() => {
            hideSuggestions();
        }, 200);
    });
    
    // Handle keyboard navigation in search
    searchInput.addEventListener('keydown', function(e) {
        if (!searchSuggestions || !searchSuggestions.style.display === 'block') return;
        
        const suggestions = searchSuggestions.querySelectorAll('.search-suggestion');
        const currentActive = searchSuggestions.querySelector('.search-suggestion.active');
        let activeIndex = -1;
        
        if (currentActive) {
            activeIndex = Array.from(suggestions).indexOf(currentActive);
        }
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, suggestions.length - 1);
                updateActiveSuggestion(suggestions, activeIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, -1);
                updateActiveSuggestion(suggestions, activeIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentActive) {
                    selectSuggestion(currentActive);
                } else {
                    performSearch(this.value);
                }
                break;
            case 'Escape':
                hideSuggestions();
                this.blur();
                break;
        }
    });
}

function performSearch(query) {
    // Simulate API call for search suggestions
    const mockSuggestions = [
        { type: 'opportunity', title: 'Frontend Developer at Tech Corp', icon: 'fas fa-briefcase' },
        { type: 'skill', title: 'React.js Development', icon: 'fas fa-code' },
        { type: 'company', title: 'Tech Solutions Rwanda', icon: 'fas fa-building' },
        { type: 'mentor', title: 'John Doe - Senior Developer', icon: 'fas fa-user' }
    ];
    
    const filteredSuggestions = mockSuggestions.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySuggestions(filteredSuggestions);
}

function displaySuggestions(suggestions) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchSuggestions) return;
    
    if (suggestions.length === 0) {
        searchSuggestions.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>No results found</p>
            </div>
        `;
    } else {
        searchSuggestions.innerHTML = suggestions.map(suggestion => `
            <div class="search-suggestion" data-type="${suggestion.type}">
                <i class="${suggestion.icon}"></i>
                <span>${suggestion.title}</span>
                <span class="suggestion-type">${suggestion.type}</span>
            </div>
        `).join('');
        
        // Add click handlers to suggestions
        searchSuggestions.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => selectSuggestion(suggestion));
        });
    }
    
    showSuggestions();
}

function updateActiveSuggestion(suggestions, activeIndex) {
    suggestions.forEach((suggestion, index) => {
        suggestion.classList.toggle('active', index === activeIndex);
    });
}

function selectSuggestion(suggestion) {
    const searchInput = document.querySelector('.search-input');
    const title = suggestion.querySelector('span').textContent;
    
    searchInput.value = title;
    hideSuggestions();
    
    // Navigate based on suggestion type
    const type = suggestion.dataset.type;
    switch(type) {
        case 'opportunity':
            window.location.href = 'opportunities.html';
            break;
        case 'skill':
            window.location.href = 'skills.html';
            break;
        case 'company':
            window.location.href = 'companies.html';
            break;
        case 'mentor':
            window.location.href = 'network.html';
            break;
    }
}

function showSuggestions() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (searchSuggestions) {
        searchSuggestions.style.display = 'block';
        searchSuggestions.classList.add('fade-in');
    }
}

function hideSuggestions() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (searchSuggestions) {
        searchSuggestions.style.display = 'none';
        searchSuggestions.classList.remove('fade-in');
    }
}

// Profile dropdown functionality
function setupProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    if (!profileDropdown) return;
    
    profileDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleProfileDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        closeProfileDropdown();
    });
}

function toggleProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    const isActive = profileDropdown.classList.contains('active');
    
    if (isActive) {
        closeProfileDropdown();
    } else {
        openProfileDropdown();
    }
}

function openProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    
    // Create dropdown menu if it doesn't exist
    let dropdownMenu = profileDropdown.querySelector('.dropdown-menu');
    if (!dropdownMenu) {
        dropdownMenu = createProfileDropdownMenu();
        profileDropdown.appendChild(dropdownMenu);
    }
    
    profileDropdown.classList.add('active');
}

function closeProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) {
        profileDropdown.classList.remove('active');
    }
}

function createProfileDropdownMenu() {
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    menu.innerHTML = `
        <a href="profile.html" class="dropdown-item">
            <i class="fas fa-user"></i>
            My Profile
        </a>
        <a href="settings.html" class="dropdown-item">
            <i class="fas fa-cog"></i>
            Settings
        </a>
        <a href="help.html" class="dropdown-item">
            <i class="fas fa-question-circle"></i>
            Help & Support
        </a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item" onclick="handleLogout()">
            <i class="fas fa-sign-out-alt"></i>
            Sign Out
        </a>
    `;
    return menu;
}

// Notification panel functionality
function setupNotificationPanel() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.getElementById('closeNotifications');
    
    if (!notificationBtn || !notificationPanel) return;
    
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleNotificationPanel();
    });
    
    if (closeNotifications) {
        closeNotifications.addEventListener('click', function() {
            closeNotificationPanel();
        });
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
            closeNotificationPanel();
        }
    });
    
    // Load notifications
    loadNotifications();
}

function toggleNotificationPanel() {
    const notificationPanel = document.getElementById('notificationPanel');
    const isActive = notificationPanel.classList.contains('active');
    
    if (isActive) {
        closeNotificationPanel();
    } else {
        openNotificationPanel();
    }
}

function openNotificationPanel() {
    const notificationPanel = document.getElementById('notificationPanel');
    notificationPanel.classList.add('active');
    
    // Mark notifications as read
    setTimeout(() => {
        markNotificationsAsRead();
    }, 1000);
}

function closeNotificationPanel() {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) {
        notificationPanel.classList.remove('active');
    }
}

function loadNotifications() {
    // Mock notifications data
    const notifications = [
        {
            id: 1,
            type: 'application',
            title: 'Application Update',
            message: 'Your application for Frontend Developer has been reviewed',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            type: 'match',
            title: 'New Job Match',
            message: 'We found 3 new opportunities that match your profile',
            time: '1 day ago',
            read: false
        },
        {
            id: 3,
            type: 'message',
            title: 'New Message',
            message: 'John Doe sent you a message about mentorship',
            time: '2 days ago',
            read: true
        }
    ];
    
    displayNotifications(notifications);
    updateNotificationBadge(notifications);
}

function displayNotifications(notifications) {
    const notificationContent = document.querySelector('.notification-content');
    if (!notificationContent) return;
    
    if (notifications.length === 0) {
        notificationContent.innerHTML = `
            <div class="no-notifications">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications</p>
            </div>
        `;
        return;
    }
    
    notificationContent.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                <i class="${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content-text">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
            ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        application: 'fas fa-paper-plane',
        match: 'fas fa-heart',
        message: 'fas fa-envelope',
        system: 'fas fa-info-circle'
    };
    return icons[type] || icons.system;
}

function updateNotificationBadge(notifications) {
    const badge = document.querySelector('.notification-badge');
    if (!badge) return;
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function markNotificationsAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
        notification.classList.add('read');
        
        const indicator = notification.querySelector('.unread-indicator');
        if (indicator) {
            indicator.remove();
        }
    });
    
    // Update badge
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'none';
    }
}

// Mega menu functionality
function setupMegaMenu() {
    const menuItems = document.querySelectorAll('.nav-link[data-mega]');
    
    menuItems.forEach(item => {
        let megaMenu;
        let showTimeout;
        let hideTimeout;
        
        item.addEventListener('mouseenter', function() {
            clearTimeout(hideTimeout);
            
            showTimeout = setTimeout(() => {
                if (!megaMenu) {
                    megaMenu = createMegaMenu(this.dataset.mega);
                    this.appendChild(megaMenu);
                }
                megaMenu.classList.add('active');
            }, 200);
        });
        
        item.addEventListener('mouseleave', function() {
            clearTimeout(showTimeout);
            
            hideTimeout = setTimeout(() => {
                if (megaMenu) {
                    megaMenu.classList.remove('active');
                }
            }, 200);
        });
    });
}

function createMegaMenu(type) {
    const megaMenu = document.createElement('div');
    megaMenu.className = 'mega-menu';
    
    // Different mega menu content based on type
    switch(type) {
        case 'opportunities':
            megaMenu.innerHTML = createOpportunitiesMegaMenu();
            break;
        case 'skills':
            megaMenu.innerHTML = createSkillsMegaMenu();
            break;
        default:
            megaMenu.innerHTML = '<div class="mega-menu-content">Coming soon...</div>';
    }
    
    return megaMenu;
}

function createOpportunitiesMegaMenu() {
    return `
        <div class="mega-menu-content">
            <div class="mega-menu-section">
                <h3>Job Types</h3>
                <a href="#"><i class="fas fa-briefcase"></i> Full-time</a>
                <a href="#"><i class="fas fa-clock"></i> Part-time</a>
                <a href="#"><i class="fas fa-graduation-cap"></i> Internships</a>
                <a href="#"><i class="fas fa-handshake"></i> Freelance</a>
            </div>
            <div class="mega-menu-section">
                <h3>Industries</h3>
                <a href="#"><i class="fas fa-laptop-code"></i> Technology</a>
                <a href="#"><i class="fas fa-chart-line"></i> Finance</a>
                <a href="#"><i class="fas fa-heartbeat"></i> Healthcare</a>
                <a href="#"><i class="fas fa-graduation-cap"></i> Education</a>
            </div>
        </div>
    `;
}

function createSkillsMegaMenu() {
    return `
        <div class="mega-menu-content">
            <div class="mega-menu-section">
                <h3>Technical Skills</h3>
                <a href="#"><i class="fab fa-js"></i> JavaScript</a>
                <a href="#"><i class="fab fa-react"></i> React</a>
                <a href="#"><i class="fab fa-python"></i> Python</a>
                <a href="#"><i class="fas fa-database"></i> SQL</a>
            </div>
            <div class="mega-menu-section">
                <h3>Soft Skills</h3>
                <a href="#"><i class="fas fa-users"></i> Leadership</a>
                <a href="#"><i class="fas fa-comments"></i> Communication</a>
                <a href="#"><i class="fas fa-lightbulb"></i> Problem Solving</a>
                <a href="#"><i class="fas fa-project-diagram"></i> Project Management</a>
            </div>
        </div>
    `;
}

// Logout functionality
function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear local storage
        localStorage.clear();
        
        // Show loading state
        MainApp.showNotification('Signing out...', 'info');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}
