// Network Page JavaScript Module
function initializeNetwork() {
    setupNetworkTabs();
    setupConnectionButtons();
    setupSearchFunctionality();
    setupFilters();
    loadNetworkData();
}

// Setup network tabs
function setupNetworkTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            showNotification(`Switched to ${button.textContent} tab`, 'info');
        });
    });
}

// Setup connection buttons
function setupConnectionButtons() {
    const connectButtons = document.querySelectorAll('.btn-connect');
    const messageButtons = document.querySelectorAll('.btn-message');
    const followButtons = document.querySelectorAll('.btn-follow');
    
    connectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const personName = button.closest('.person-card').querySelector('.person-name').textContent;
            
            if (button.textContent.includes('Connected')) {
                button.innerHTML = '<i class="fas fa-user-plus"></i> Connect';
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
                showNotification(`Disconnected from ${personName}`, 'info');
            } else {
                button.innerHTML = '<i class="fas fa-check"></i> Connected';
                button.classList.remove('btn-primary');
                button.classList.add('btn-success');
                showNotification(`Connected with ${personName}!`, 'success');
            }
        });
    });
    
    messageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const personName = button.closest('.person-card').querySelector('.person-name').textContent;
            showNotification(`Opening message with ${personName}...`, 'info');
            // Here you would open a messaging modal or redirect to messages
        });
    });
    
    followButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const personName = button.closest('.person-card').querySelector('.person-name').textContent;
            
            if (button.textContent.includes('Following')) {
                button.innerHTML = '<i class="fas fa-plus"></i> Follow';
                button.classList.remove('btn-success');
                button.classList.add('btn-outline');
                showNotification(`Unfollowed ${personName}`, 'info');
            } else {
                button.innerHTML = '<i class="fas fa-check"></i> Following';
                button.classList.remove('btn-outline');
                button.classList.add('btn-success');
                showNotification(`Now following ${personName}!`, 'success');
            }
        });
    });
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.network-search input');
    const personCards = document.querySelectorAll('.person-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            personCards.forEach(card => {
                const name = card.querySelector('.person-name').textContent.toLowerCase();
                const title = card.querySelector('.person-title').textContent.toLowerCase();
                const company = card.querySelector('.person-company').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || title.includes(searchTerm) || company.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Setup filters
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            filterNetworkCards(filterType);
            showNotification(`Filtered by ${button.textContent}`, 'info');
        });
    });
}

// Filter network cards
function filterNetworkCards(filterType) {
    const personCards = document.querySelectorAll('.person-card');
    
    personCards.forEach(card => {
        if (filterType === 'all') {
            card.style.display = 'block';
        } else {
            const cardType = card.dataset.type || 'student';
            if (cardType === filterType) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Load network data
function loadNetworkData() {
    // Simulate loading network data
    const networkData = [
        {
            name: "Alice Uwimana",
            title: "Software Engineer",
            company: "Tech Solutions Rwanda",
            department: "Engineering",
            type: "alumni",
            image: "assets/images/avatar-1.jpg"
        },
        {
            name: "Jean Baptiste",
            title: "Medical Student",
            company: "INES - Health Sciences",
            department: "Health",
            type: "student",
            image: "assets/images/avatar-2.jpg"
        },
        {
            name: "Marie Claire",
            title: "Business Analyst",
            company: "Bank of Kigali",
            department: "Business",
            type: "alumni",
            image: "assets/images/avatar-3.jpg"
        }
    ];
    
    // You can use this data to populate the network cards dynamically
    console.log('Network data loaded:', networkData);
}

// Event handlers for specific network actions
function joinEvent(eventId) {
    showNotification('Successfully joined the event!', 'success');
    const button = document.querySelector(`[data-event-id="${eventId}"]`);
    if (button) {
        button.innerHTML = '<i class="fas fa-check"></i> Joined';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
    }
}

function bookMentorSession(mentorId) {
    showNotification('Mentor session booking request sent!', 'success');
    // Here you would open a booking modal or redirect to booking page
}

function viewProfile(userId) {
    showNotification('Opening profile...', 'info');
    // Here you would redirect to the user's profile page
    // window.location.href = `profile.html?id=${userId}`;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNetwork);
} else {
    initializeNetwork();
}
