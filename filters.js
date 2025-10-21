// Filters JavaScript Module for Opportunities Page
function initializeFilters() {
    setupFilterButtons();
    setupSearchFilter();
    setupLocationFilter();
    setupSalaryFilter();
    setupTypeFilter();
    setupSortOptions();
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            applyFilters();
        });
    });
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Setup search filter
function setupSearchFilter() {
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 300);
        });
    }
}

// Setup location filter
function setupLocationFilter() {
    const locationSelect = document.getElementById('locationFilter');
    
    if (locationSelect) {
        locationSelect.addEventListener('change', applyFilters);
    }
}

// Setup salary filter
function setupSalaryFilter() {
    const salaryRange = document.getElementById('salaryRange');
    const salaryValue = document.getElementById('salaryValue');
    
    if (salaryRange) {
        salaryRange.addEventListener('input', (e) => {
            if (salaryValue) {
                salaryValue.textContent = `${parseInt(e.target.value).toLocaleString()} RWF`;
            }
            applyFilters();
        });
    }
}

// Setup job type filter
function setupTypeFilter() {
    const typeCheckboxes = document.querySelectorAll('input[name="jobType"]');
    
    typeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

// Setup sort options
function setupSortOptions() {
    const sortSelect = document.getElementById('sortBy');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
}

// Apply all filters
function applyFilters() {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    const searchTerm = document.querySelector('.search-input')?.value.toLowerCase() || '';
    const selectedLocation = document.getElementById('locationFilter')?.value || '';
    const maxSalary = document.getElementById('salaryRange')?.value || 1000000;
    const selectedTypes = Array.from(document.querySelectorAll('input[name="jobType"]:checked')).map(cb => cb.value);
    const activeDepartments = Array.from(document.querySelectorAll('.filter-btn.active')).map(btn => btn.dataset.department);
    
    let visibleCount = 0;
    
    opportunityCards.forEach(card => {
        let shouldShow = true;
        
        // Search filter
        if (searchTerm) {
            const title = card.querySelector('.opportunity-title')?.textContent.toLowerCase() || '';
            const company = card.querySelector('.company-name')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.opportunity-description')?.textContent.toLowerCase() || '';
            
            if (!title.includes(searchTerm) && !company.includes(searchTerm) && !description.includes(searchTerm)) {
                shouldShow = false;
            }
        }
        
        // Location filter
        if (selectedLocation && shouldShow) {
            const location = card.querySelector('.location')?.textContent || '';
            if (!location.includes(selectedLocation)) {
                shouldShow = false;
            }
        }
        
        // Salary filter
        if (shouldShow) {
            const salaryText = card.querySelector('.salary')?.textContent || '0';
            const salary = parseInt(salaryText.replace(/[^\d]/g, '')) || 0;
            if (salary > maxSalary) {
                shouldShow = false;
            }
        }
        
        // Job type filter
        if (selectedTypes.length > 0 && shouldShow) {
            const jobType = card.dataset.type || '';
            if (!selectedTypes.includes(jobType)) {
                shouldShow = false;
            }
        }
        
        // Department filter
        if (activeDepartments.length > 0 && shouldShow) {
            const department = card.dataset.department || '';
            if (!activeDepartments.includes(department)) {
                shouldShow = false;
            }
        }
        
        // Show/hide card
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount);
}

// Apply sorting
function applySorting() {
    const sortBy = document.getElementById('sortBy')?.value || 'newest';
    const container = document.querySelector('.opportunities-grid');
    const cards = Array.from(document.querySelectorAll('.opportunity-card'));
    
    cards.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.dataset.posted || 0) - new Date(a.dataset.posted || 0);
            case 'oldest':
                return new Date(a.dataset.posted || 0) - new Date(b.dataset.posted || 0);
            case 'salary-high':
                const salaryA = parseInt(a.querySelector('.salary')?.textContent.replace(/[^\d]/g, '') || '0');
                const salaryB = parseInt(b.querySelector('.salary')?.textContent.replace(/[^\d]/g, '') || '0');
                return salaryB - salaryA;
            case 'salary-low':
                const salaryA2 = parseInt(a.querySelector('.salary')?.textContent.replace(/[^\d]/g, '') || '0');
                const salaryB2 = parseInt(b.querySelector('.salary')?.textContent.replace(/[^\d]/g, '') || '0');
                return salaryA2 - salaryB2;
            case 'relevance':
                return parseInt(b.dataset.relevance || '0') - parseInt(a.dataset.relevance || '0');
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    if (container) {
        cards.forEach(card => container.appendChild(card));
    }
    
    showNotification(`Sorted by ${sortBy}`, 'info');
}

// Clear all filters
function clearAllFilters() {
    // Clear search
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    // Clear location
    const locationSelect = document.getElementById('locationFilter');
    if (locationSelect) locationSelect.value = '';
    
    // Reset salary range
    const salaryRange = document.getElementById('salaryRange');
    if (salaryRange) {
        salaryRange.value = salaryRange.max;
        const salaryValue = document.getElementById('salaryValue');
        if (salaryValue) salaryValue.textContent = `${parseInt(salaryRange.max).toLocaleString()} RWF`;
    }
    
    // Clear job type checkboxes
    const typeCheckboxes = document.querySelectorAll('input[name="jobType"]');
    typeCheckboxes.forEach(checkbox => checkbox.checked = false);
    
    // Clear department filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => button.classList.remove('active'));
    
    // Reset sort
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) sortSelect.value = 'newest';
    
    // Apply filters (which will show all)
    applyFilters();
    
    showNotification('All filters cleared', 'info');
}

// Update results count
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${count} opportunities found`;
    }
}

// Save user filter preferences
function saveFilterPreferences() {
    const preferences = {
        location: document.getElementById('locationFilter')?.value || '',
        salary: document.getElementById('salaryRange')?.value || '',
        types: Array.from(document.querySelectorAll('input[name="jobType"]:checked')).map(cb => cb.value),
        departments: Array.from(document.querySelectorAll('.filter-btn.active')).map(btn => btn.dataset.department),
        sort: document.getElementById('sortBy')?.value || 'newest'
    };
    
    localStorage.setItem('opportunityFilters', JSON.stringify(preferences));
}

// Load user filter preferences
function loadFilterPreferences() {
    const saved = localStorage.getItem('opportunityFilters');
    if (!saved) return;
    
    try {
        const preferences = JSON.parse(saved);
        
        // Apply saved location
        const locationSelect = document.getElementById('locationFilter');
        if (locationSelect && preferences.location) {
            locationSelect.value = preferences.location;
        }
        
        // Apply saved salary
        const salaryRange = document.getElementById('salaryRange');
        if (salaryRange && preferences.salary) {
            salaryRange.value = preferences.salary;
            const salaryValue = document.getElementById('salaryValue');
            if (salaryValue) {
                salaryValue.textContent = `${parseInt(preferences.salary).toLocaleString()} RWF`;
            }
        }
        
        // Apply saved job types
        if (preferences.types) {
            preferences.types.forEach(type => {
                const checkbox = document.querySelector(`input[name="jobType"][value="${type}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Apply saved departments
        if (preferences.departments) {
            preferences.departments.forEach(dept => {
                const button = document.querySelector(`.filter-btn[data-department="${dept}"]`);
                if (button) button.classList.add('active');
            });
        }
        
        // Apply saved sort
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect && preferences.sort) {
            sortSelect.value = preferences.sort;
        }
        
        // Apply all filters
        applyFilters();
        applySorting();
        
    } catch (error) {
        console.error('Error loading filter preferences:', error);
    }
}

// Initialize filters when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeFilters();
        loadFilterPreferences();
    });
} else {
    initializeFilters();
    loadFilterPreferences();
}

// Save preferences when page unloads
window.addEventListener('beforeunload', saveFilterPreferences);
