// Notifications JavaScript Module
function initializeNotifications() {
    setupNotificationPanel();
    setupNotificationBadges();
    createNotificationContainer();
}

// Notification panel functionality
function setupNotificationPanel() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.querySelector('.notification-panel');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleNotificationPanel();
        });
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (notificationPanel && !notificationPanel.contains(e.target)) {
            closeNotificationPanel();
        }
    });
    
    // Load initial notifications
    loadNotifications();
}

// Notification badges
function setupNotificationBadges() {
    updateNotificationBadge();
    updateMessageBadge();
}

// Toggle notification panel
function toggleNotificationPanel() {
    const panel = document.querySelector('.notification-panel');
    if (panel) {
        panel.classList.toggle('active');
        
        if (panel.classList.contains('active')) {
            markNotificationsAsRead();
        }
    }
}

function closeNotificationPanel() {
    const panel = document.querySelector('.notification-panel');
    if (panel) {
        panel.classList.remove('active');
    }
}

// Load notifications
function loadNotifications() {
    const notifications = [
        {
            id: 1,
            type: 'opportunity',
            title: 'New Internship Opportunity',
            message: 'Software Developer Intern at TechCorp Rwanda',
            time: '2 hours ago',
            read: false,
            icon: 'fas fa-briefcase'
        },
        {
            id: 2,
            type: 'connection',
            title: 'New Connection Request',
            message: 'John Doe wants to connect with you',
            time: '4 hours ago',
            read: false,
            icon: 'fas fa-user-plus'
        },
        {
            id: 3,
            type: 'event',
            title: 'Career Fair Tomorrow',
            message: 'Don\'t forget about the virtual career fair',
            time: '1 day ago',
            read: true,
            icon: 'fas fa-calendar'
        }
    ];
    
    renderNotifications(notifications);
}

function renderNotifications(notifications) {
    const container = document.querySelector('.notification-content');
    if (!container) return;
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
            <div class="notification-icon">
                <i class="${notification.icon}"></i>
            </div>
            <div class="notification-content-text">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
            <button class="notification-close" onclick="removeNotification(${notification.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        // Simulate unread count
        const unreadCount = 3;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

// Update message badge
function updateMessageBadge() {
    const badge = document.querySelector('.message-badge');
    if (badge) {
        // Simulate unread messages
        const unreadCount = 2;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

// Mark notifications as read
function markNotificationsAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
        notification.classList.add('read');
    });
    
    // Update badge
    setTimeout(() => {
        updateNotificationBadge();
    }, 500);
}

// Remove notification
function removeNotification(id) {
    const notification = document.querySelector(`[data-id="${id}"]`);
    if (notification) {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
            updateNotificationBadge();
        }, 300);
    }
}

// Create notification container for toast notifications
function createNotificationContainer() {
    if (document.querySelector('.toast-container')) return;
    
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
    `;
    
    document.body.appendChild(container);
}

// Show toast notification
function showToast(message, type = 'info', duration = 5000) {
    const container = document.querySelector('.toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toast.style.cssText = `
        background: var(--color-white);
        border: 1px solid var(--color-gray-200);
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        pointer-events: auto;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

// Global notification function (used by other modules)
window.showNotification = function(message, type = 'info', duration = 5000) {
    showToast(message, type, duration);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNotifications);
} else {
    initializeNotifications();
}
