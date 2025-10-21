// Opportunities JavaScript Module
function initializeOpportunities() {
    setupSearchFilters();
    setupOpportunityCards();
    setupFilterSidebar();
    setupPagination();
    setupSortOptions();
}

// Search and filter functionality
function setupSearchFilters() {
    const searchInput = document.getElementById('opportunitySearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const locationFilter = document.getElementById('locationFilter');
    const typeFilter = document.getElementById('typeFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
    }
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            toggleFilter(filterType, this);
        });
    });
    
    // Dropdown filters
    [locationFilter, typeFilter, experienceFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', function() {
                applyFilters();
            });
        }
    });
}

// Opportunity card interactions
function setupOpportunityCards() {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    
    opportunityCards.forEach(card => {
        // Quick apply button
        const quickApplyBtn = card.querySelector('.quick-apply-btn');
        if (quickApplyBtn) {
            quickApplyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                handleQuickApply(card);
            });
        }
        
        // Save opportunity button
        const saveBtn = card.querySelector('.save-opportunity-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleSaveOpportunity(card, this);
            });
        }
        
        // Card click to view details
        card.addEventListener('click', function() {
            viewOpportunityDetails(this);
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Filter sidebar functionality
function setupFilterSidebar() {
    const filterToggle = document.getElementById('filterToggle');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', function() {
            filterSidebar.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }
    
    // Filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateFilterCount();
            applyFilters();
        });
    });
}

// Pagination functionality
function setupPagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active') && !this.disabled) {
                const page = parseInt(this.dataset.page);
                loadPage(page);
            }
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const currentPage = getCurrentPage();
            if (currentPage > 1) {
                loadPage(currentPage - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const currentPage = getCurrentPage();
            const totalPages = getTotalPages();
            if (currentPage < totalPages) {
                loadPage(currentPage + 1);
            }
        });
    }
}

// Sort options functionality
function setupSortOptions() {
    const sortSelect = document.getElementById('sortOptions');
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortOpportunities(this.value);
        });
    }
    
    // View toggle (grid/list)
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.dataset.view;
            toggleView(viewType, this);
        });
    });
}

// Search functionality
function performSearch(query) {
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    const searchResults = document.querySelector('.search-results-count');
    let visibleCount = 0;
    
    opportunityCards.forEach(card => {
        const title = card.querySelector('.opportunity-title').textContent.toLowerCase();
        const company = card.querySelector('.company-name').textContent.toLowerCase();
        const description = card.querySelector('.opportunity-description').textContent.toLowerCase();
        
        const matchesSearch = query === '' || 
            title.includes(query.toLowerCase()) ||
            company.includes(query.toLowerCase()) ||
            description.includes(query.toLowerCase());
        
        if (matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (searchResults) {
        searchResults.textContent = `${visibleCount} opportunities found`;
    }
    
    // Show no results message if needed
    toggleNoResultsMessage(visibleCount === 0);
}

// Filter functionality
function toggleFilter(filterType, button) {
    button.classList.toggle('active');
    applyFilters();
}

function applyFilters() {
    const activeFilters = getActiveFilters();
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    let visibleCount = 0;
    
    opportunityCards.forEach(card => {
        const matchesFilters = checkCardMatchesFilters(card, activeFilters);
        
        if (matchesFilters) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updateResultsCount(visibleCount);
    toggleNoResultsMessage(visibleCount === 0);
}

function getActiveFilters() {
    const filters = {
        types: [],
        locations: [],
        experience: [],
        remote: false,
        partTime: false
    };
    
    // Get active filter buttons
    document.querySelectorAll('.filter-btn.active').forEach(btn => {
        const filterType = btn.dataset.filter;
        if (filterType) {
            filters.types.push(filterType);
        }
    });
    
    // Get dropdown selections
    const locationFilter = document.getElementById('locationFilter');
    const typeFilter = document.getElementById('typeFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    
    if (locationFilter && locationFilter.value) {
        filters.locations.push(locationFilter.value);
    }
    
    if (typeFilter && typeFilter.value) {
        filters.types.push(typeFilter.value);
    }
    
    if (experienceFilter && experienceFilter.value) {
        filters.experience.push(experienceFilter.value);
    }
    
    // Get checkbox filters
    const remoteCheckbox = document.getElementById('remoteWork');
    const partTimeCheckbox = document.getElementById('partTime');
    
    if (remoteCheckbox && remoteCheckbox.checked) {
        filters.remote = true;
    }
    
    if (partTimeCheckbox && partTimeCheckbox.checked) {
        filters.partTime = true;
    }
    
    return filters;
}

function checkCardMatchesFilters(card, filters) {
    // Check type filters
    if (filters.types.length > 0) {
        const cardType = card.dataset.type;
        if (!filters.types.includes(cardType)) {
            return false;
        }
    }
    
    // Check location filters
    if (filters.locations.length > 0) {
        const cardLocation = card.dataset.location;
        if (!filters.locations.includes(cardLocation)) {
            return false;
        }
    }
    
    // Check experience filters
    if (filters.experience.length > 0) {
        const cardExperience = card.dataset.experience;
        if (!filters.experience.includes(cardExperience)) {
            return false;
        }
    }
    
    // Check remote work filter
    if (filters.remote) {
        const isRemote = card.dataset.remote === 'true';
        if (!isRemote) {
            return false;
        }
    }
    
    // Check part-time filter
    if (filters.partTime) {
        const isPartTime = card.dataset.partTime === 'true';
        if (!isPartTime) {
            return false;
        }
    }
    
    return true;
}

// Quick apply functionality
function handleQuickApply(card) {
    const opportunityId = card.dataset.id;
    const opportunityTitle = card.querySelector('.opportunity-title').textContent;
    const companyName = card.querySelector('.company-name').textContent;
    
    // Show quick apply modal
    showQuickApplyModal({
        id: opportunityId,
        title: opportunityTitle,
        company: companyName
    });
}

function showQuickApplyModal(opportunity) {
    const modal = document.createElement('div');
    modal.className = 'modal quick-apply-modal active';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Quick Apply</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="opportunity-info">
                    <h4>${opportunity.title}</h4>
                    <p>at ${opportunity.company}</p>
                </div>
                <form class="quick-apply-form">
                    <div class="form-group">
                        <label>Cover Letter (Optional)</label>
                        <textarea placeholder="Why are you interested in this position?" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" checked>
                            <span class="checkmark"></span>
                            Use my default resume
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-cancel">Cancel</button>
                <button class="btn btn-primary submit-application">
                    <i class="fas fa-paper-plane"></i>
                    Submit Application
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Modal event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const submitBtn = modal.querySelector('.submit-application');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    [closeBtn, cancelBtn, backdrop].forEach(element => {
        element.addEventListener('click', () => {
            closeModal(modal);
        });
    });
    
    submitBtn.addEventListener('click', () => {
        submitQuickApplication(opportunity, modal);
    });
}

function submitQuickApplication(opportunity, modal) {
    const submitBtn = modal.querySelector('.submit-application');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<div class="loading"></div> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        closeModal(modal);
        showNotification(`Application submitted for ${opportunity.title}!`, 'success');
        
        // Update the card to show applied state
        const card = document.querySelector(`[data-id="${opportunity.id}"]`);
        if (card) {
            const quickApplyBtn = card.querySelector('.quick-apply-btn');
            if (quickApplyBtn) {
                quickApplyBtn.innerHTML = '<i class="fas fa-check"></i> Applied';
                quickApplyBtn.classList.add('applied');
                quickApplyBtn.disabled = true;
            }
        }
    }, 2000);
}

// Save opportunity functionality
function toggleSaveOpportunity(card, button) {
    const isSaved = button.classList.contains('saved');
    const opportunityTitle = card.querySelector('.opportunity-title').textContent;
    
    if (isSaved) {
        button.classList.remove('saved');
        button.innerHTML = '<i class="far fa-bookmark"></i>';
        showNotification(`Removed ${opportunityTitle} from saved opportunities`, 'info');
    } else {
        button.classList.add('saved');
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
        showNotification(`Saved ${opportunityTitle} to your bookmarks`, 'success');
    }
}

// View opportunity details
function viewOpportunityDetails(card) {
    const opportunityId = card.dataset.id;
    // In a real app, this would navigate to a detailed view
    console.log(`Viewing details for opportunity ${opportunityId}`);
    
    // For now, show a simple modal with more details
    showOpportunityDetailsModal(card);
}

function showOpportunityDetailsModal(card) {
    const title = card.querySelector('.opportunity-title').textContent;
    const company = card.querySelector('.company-name').textContent;
    const location = card.querySelector('.opportunity-location').textContent;
    const description = card.querySelector('.opportunity-description').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'modal opportunity-details-modal active';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content large">
            <div class="modal-header">
                <div>
                    <h3>${title}</h3>
                    <p>${company} • ${location}</p>
                </div>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="opportunity-details">
                    <h4>Job Description</h4>
                    <p>${description}</p>
                    
                    <h4>Requirements</h4>
                    <ul>
                        <li>Bachelor's degree in relevant field</li>
                        <li>Strong communication skills</li>
                        <li>Ability to work in a team environment</li>
                        <li>Proficiency in relevant technologies</li>
    
    document.body.appendChild(modal);
    
    // Modal event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');
    const saveBtn = modal.querySelector('.save-opportunity');
    const applyBtn = modal.querySelector('.apply-now');
    
    [closeBtn, backdrop].forEach(element => {
        element.addEventListener('click', () => {
            closeModal(modal);
        });
    });
    
    saveBtn.addEventListener('click', () => {
        toggleSaveOpportunity(card, card.querySelector('.save-opportunity-btn'));
    });
    
    applyBtn.addEventListener('click', () => {
        closeModal(modal);
        handleQuickApply(card);
    });
}

// Utility functions
function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (modal.parentElement) {
            modal.parentElement.removeChild(modal);
        }
    }, 300);
}

function clearAllFilters() {
    // Clear filter buttons
    document.querySelectorAll('.filter-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Clear dropdown selections
    document.querySelectorAll('select').forEach(select => {
        select.value = '';
    });
    
    // Clear checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear search
    const searchInput = document.getElementById('opportunitySearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reapply filters (which will show all opportunities)
    applyFilters();
}

function updateFilterCount() {
    const activeFilters = document.querySelectorAll('.filter-checkbox:checked').length;
    const filterCount = document.querySelector('.filter-count');
    
    if (filterCount) {
        if (activeFilters > 0) {
            filterCount.textContent = activeFilters;
            filterCount.style.display = 'block';
        } else {
            filterCount.style.display = 'none';
        }
    }
}

function updateResultsCount(count) {
    const resultsCount = document.querySelector('.search-results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count} opportunities found`;
    }
}

function toggleNoResultsMessage(show) {
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (show && !noResultsMessage) {
        noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results-message';
        noResultsMessage.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No opportunities found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <button class="btn btn-secondary" onclick="clearAllFilters()">
                    Clear All Filters
                </button>
            </div>
        `;
        
        const opportunitiesGrid = document.querySelector('.opportunities-grid');
        if (opportunitiesGrid) {
            opportunitiesGrid.appendChild(noResultsMessage);
        }
    } else if (!show && noResultsMessage) {
        noResultsMessage.remove();
    }
}

function sortOpportunities(sortBy) {
    const opportunitiesGrid = document.querySelector('.opportunities-grid');
    const cards = Array.from(opportunitiesGrid.querySelectorAll('.opportunity-card'));
    
    cards.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.dataset.posted) - new Date(a.dataset.posted);
            case 'oldest':
                return new Date(a.dataset.posted) - new Date(b.dataset.posted);
            case 'company':
                return a.querySelector('.company-name').textContent.localeCompare(
                    b.querySelector('.company-name').textContent
                );
            case 'title':
                return a.querySelector('.opportunity-title').textContent.localeCompare(
                    b.querySelector('.opportunity-title').textContent
                );
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    cards.forEach(card => {
        opportunitiesGrid.appendChild(card);
    });
}

function toggleView(viewType, button) {
    const viewButtons = document.querySelectorAll('.view-toggle-btn');
    const opportunitiesGrid = document.querySelector('.opportunities-grid');
    
    viewButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    if (opportunitiesGrid) {
        opportunitiesGrid.className = `opportunities-grid ${viewType}-view`;
    }
}

// Pagination helpers
function getCurrentPage() {
    const activePage = document.querySelector('.pagination-btn.active');
    return activePage ? parseInt(activePage.dataset.page) : 1;
}

function getTotalPages() {
    const paginationBtns = document.querySelectorAll('.pagination-btn[data-page]');
    return paginationBtns.length;
}

function loadPage(pageNumber) {
    // Update active pagination button
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetBtn = document.querySelector(`[data-page="${pageNumber}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // In a real app, this would load new data
    // For now, just scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOpportunities);
} else {
    initializeOpportunities();
}
