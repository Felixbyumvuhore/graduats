// Profile Builder JavaScript Module
function initializeProfileBuilder() {
    setupSectionNavigation();
    setupPhotoUpload();
    setupFormValidation();
    setupSkillsManagement();
    setupProgressTracking();
    setupPreviewModal();
    setupFormSaving();
}

// Section Navigation
function setupSectionNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const formSections = document.querySelectorAll('.form-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            switchToSection(targetSection);
        });
    });
    
    // Initialize first section as active
    if (navItems.length > 0) {
        switchToSection('basic');
    }
}

function switchToSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Update form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update progress
    updateOverallProgress();
}

// Photo Upload
function setupPhotoUpload() {
    const photoPreview = document.querySelector('.photo-preview');
    const photoInput = document.getElementById('photoInput');
    const photoImg = document.getElementById('photoPreview');
    
    if (photoPreview && photoInput) {
        photoPreview.addEventListener('click', function() {
            photoInput.click();
        });
        
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handlePhotoUpload(file);
            }
        });
    }
}

function handlePhotoUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoImg = document.getElementById('photoPreview');
        if (photoImg) {
            photoImg.src = e.target.result;
        }
        
        // Update completion status
        updateSectionCompletion('basic');
        showNotification('Profile photo updated successfully', 'success');
    };
    
    reader.readAsDataURL(file);
}

// Form Validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
            updateCharacterCount(this);
            updateSectionCompletion(getCurrentSection());
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // URL validation
    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function updateCharacterCount(field) {
    const maxLength = field.getAttribute('maxlength');
    const countElement = field.parentNode.querySelector('.character-count span');
    
    if (maxLength && countElement) {
        const currentLength = field.value.length;
        countElement.textContent = currentLength;
        
        // Update color based on usage
        const percentage = (currentLength / maxLength) * 100;
        if (percentage > 90) {
            countElement.style.color = 'var(--error-color)';
        } else if (percentage > 75) {
            countElement.style.color = 'var(--warning-color)';
        } else {
            countElement.style.color = 'var(--text-secondary)';
        }
    }
}

// Skills Management
function setupSkillsManagement() {
    const skillsInputs = document.querySelectorAll('.skills-input');
    const skillSuggestions = document.querySelectorAll('.skill-suggestion');
    
    skillsInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(this.value.trim(), this);
            }
        });
    });
    
    skillSuggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const input = this.parentNode.previousElementSibling;
            addSkill(this.textContent, input);
        });
    });
    
    // Setup existing skill interactions
    setupSkillInteractions();
}

function addSkill(skillName, inputElement) {
    if (!skillName) return;
    
    const skillsContainer = inputElement.closest('.skill-category').querySelector('.selected-skills');
    
    // Check if skill already exists
    const existingSkills = Array.from(skillsContainer.querySelectorAll('.skill-name')).map(el => el.textContent);
    if (existingSkills.includes(skillName)) {
        showNotification('Skill already added', 'warning');
        inputElement.value = '';
        return;
    }
    
    const skillElement = createSkillElement(skillName);
    skillsContainer.appendChild(skillElement);
    
    inputElement.value = '';
    updateSectionCompletion('skills');
    showNotification(`Added ${skillName} to your skills`, 'success');
}

function createSkillElement(skillName) {
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.innerHTML = `
        <span class="skill-name">${skillName}</span>
        <div class="skill-level">
            <div class="level-dots">
                <span class="dot" data-level="1"></span>
                <span class="dot" data-level="2"></span>
                <span class="dot" data-level="3"></span>
                <span class="dot" data-level="4"></span>
                <span class="dot" data-level="5"></span>
            </div>
            <span class="level-text">Beginner</span>
        </div>
        <button class="remove-skill">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Setup skill level interaction
    const dots = skillItem.querySelectorAll('.dot');
    const levelText = skillItem.querySelector('.level-text');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            setSkillLevel(dots, levelText, index + 1);
        });
    });
    
    // Setup remove button
    const removeBtn = skillItem.querySelector('.remove-skill');
    removeBtn.addEventListener('click', function() {
        removeSkill(skillItem);
    });
    
    return skillItem;
}

function setSkillLevel(dots, levelText, level) {
    const levels = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
    
    dots.forEach((dot, index) => {
        if (index < level) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    levelText.textContent = levels[level - 1];
}

function removeSkill(skillElement) {
    const skillName = skillElement.querySelector('.skill-name').textContent;
    skillElement.remove();
    updateSectionCompletion('skills');
    showNotification(`Removed ${skillName} from your skills`, 'info');
}

function setupSkillInteractions() {
    const existingSkills = document.querySelectorAll('.skill-item');
    
    existingSkills.forEach(skillItem => {
        const dots = skillItem.querySelectorAll('.dot');
        const levelText = skillItem.querySelector('.level-text');
        const removeBtn = skillItem.querySelector('.remove-skill');
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                setSkillLevel(dots, levelText, index + 1);
            });
        });
        
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                removeSkill(skillItem);
            });
        }
    });
}

// Progress Tracking
function setupProgressTracking() {
    updateOverallProgress();
    updateAllSectionCompletions();
}

function updateOverallProgress() {
    const sections = ['basic', 'education', 'skills', 'experience', 'projects'];
    let totalCompletion = 0;
    
    sections.forEach(sectionId => {
        totalCompletion += getSectionCompletion(sectionId);
    });
    
    const overallProgress = Math.round(totalCompletion / sections.length);
    
    const progressBar = document.getElementById('overallProgress');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (progressBar) {
        progressBar.style.width = `${overallProgress}%`;
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${overallProgress}%`;
    }
}

function updateSectionCompletion(sectionId) {
    const completion = getSectionCompletion(sectionId);
    
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        const completionBar = navItem.querySelector('.completion-bar');
        const statusIcon = navItem.querySelector('.nav-status i');
        
        if (completionBar) {
            completionBar.style.width = `${completion}%`;
        }
        
        if (statusIcon) {
            statusIcon.className = getStatusIcon(completion);
        }
    }
    
    updateOverallProgress();
}

function getSectionCompletion(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return 0;
    
    const requiredFields = section.querySelectorAll('[required]');
    const allFields = section.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    let filledRequired = 0;
    let filledOptional = 0;
    
    requiredFields.forEach(field => {
        if (field.value.trim()) {
            filledRequired++;
        }
    });
    
    allFields.forEach(field => {
        if (!field.hasAttribute('required') && field.value.trim()) {
            filledOptional++;
        }
    });
    
    // Special handling for skills section
    if (sectionId === 'skills') {
        const skillItems = section.querySelectorAll('.skill-item');
        return skillItems.length > 0 ? Math.min(100, skillItems.length * 20) : 0;
    }
    
    // Special handling for photo upload
    if (sectionId === 'basic') {
        const photoImg = section.querySelector('#photoPreview');
        const hasPhoto = photoImg && !photoImg.src.includes('default-avatar');
        const photoBonus = hasPhoto ? 10 : 0;
        
        const requiredCompletion = (filledRequired / requiredFields.length) * 70;
        const optionalCompletion = (filledOptional / (allFields.length - requiredFields.length)) * 20;
        
        return Math.min(100, requiredCompletion + optionalCompletion + photoBonus);
    }
    
    if (requiredFields.length === 0) return 0;
    
    const requiredCompletion = (filledRequired / requiredFields.length) * 80;
    const optionalCompletion = (filledOptional / Math.max(1, allFields.length - requiredFields.length)) * 20;
    
    return Math.min(100, requiredCompletion + optionalCompletion);
}

function getStatusIcon(completion) {
    if (completion === 100) return 'fas fa-check-circle';
    if (completion >= 50) return 'fas fa-exclamation-circle';
    if (completion > 0) return 'fas fa-clock';
    return 'fas fa-plus-circle';
}

function updateAllSectionCompletions() {
    const sections = ['basic', 'education', 'skills', 'experience', 'projects'];
    sections.forEach(sectionId => {
        updateSectionCompletion(sectionId);
    });
}

function getCurrentSection() {
    const activeSection = document.querySelector('.form-section.active');
    return activeSection ? activeSection.id : 'basic';
}

// Preview Modal
function setupPreviewModal() {
    const previewBtn = document.getElementById('previewBtn');
    const modal = document.getElementById('profilePreviewModal');
    const closeBtn = document.getElementById('closePreview');
    
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            showProfilePreview();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeProfilePreview();
        });
    }
    
    if (modal) {
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', function() {
                closeProfilePreview();
            });
        }
    }
}

function showProfilePreview() {
    const modal = document.getElementById('profilePreviewModal');
    const previewContent = modal.querySelector('.preview-content');
    
    if (modal && previewContent) {
        previewContent.innerHTML = generatePreviewHTML();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProfilePreview() {
    const modal = document.getElementById('profilePreviewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function generatePreviewHTML() {
    const formData = collectFormData();
    
    return `
        <div class="profile-preview">
            <div class="preview-header">
                <div class="preview-avatar">
                    <img src="${formData.photo || 'assets/images/default-avatar.jpg'}" alt="Profile Photo">
                </div>
                <div class="preview-info">
                    <h2>${formData.firstName} ${formData.lastName}</h2>
                    <p class="preview-headline">${formData.headline || 'Professional Headline'}</p>
                    <p class="preview-location">${formData.location || 'Location'}</p>
                </div>
            </div>
            
            <div class="preview-about">
                <h3>About</h3>
                <p>${formData.about || 'No description provided yet.'}</p>
            </div>
            
            <div class="preview-education">
                <h3>Education</h3>
                <div class="preview-education-item">
                    <h4>${formData.institution || 'Institution'}</h4>
                    <p>${formData.degree || 'Degree'} in ${formData.fieldOfStudy || 'Field of Study'}</p>
                    <p class="preview-dates">${formData.expectedGraduation || 'Expected Graduation'}</p>
                </div>
            </div>
            
            <div class="preview-skills">
                <h3>Skills</h3>
                <div class="preview-skills-list">
                    ${formData.skills.map(skill => `
                        <span class="preview-skill">${skill.name}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function collectFormData() {
    const data = {
        photo: document.getElementById('photoPreview')?.src,
        firstName: document.querySelector('input[type="text"]')?.value || '',
        lastName: document.querySelectorAll('input[type="text"]')[1]?.value || '',
        headline: document.querySelector('input[placeholder*="Professional Headline"]')?.value || '',
        about: document.querySelector('textarea')?.value || '',
        location: document.querySelector('select')?.value || '',
        institution: document.querySelector('input[value*="INES"]')?.value || '',
        degree: document.querySelector('select option[selected]')?.textContent || '',
        fieldOfStudy: document.querySelector('input[value*="Computer Science"]')?.value || '',
        expectedGraduation: document.querySelector('input[type="month"]')?.value || '',
        skills: []
    };
    
    // Collect skills
    document.querySelectorAll('.skill-item').forEach(skillItem => {
        const name = skillItem.querySelector('.skill-name')?.textContent || '';
        const level = skillItem.querySelector('.level-text')?.textContent || '';
        if (name) {
            data.skills.push({ name, level });
        }
    });
    
    return data;
}

// Form Saving
function setupFormSaving() {
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const saveProgressBtn = document.getElementById('saveProgressBtn');
    const publishBtn = document.getElementById('publishProfileBtn');
    const exitBtn = document.getElementById('exitBuilderBtn');
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            saveFormData('draft');
        });
    }
    
    if (saveProgressBtn) {
        saveProgressBtn.addEventListener('click', function() {
            saveFormData('progress');
        });
    }
    
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            publishProfile();
        });
    }
    
    if (exitBtn) {
        exitBtn.addEventListener('click', function() {
            const hasUnsavedChanges = checkForUnsavedChanges();
            if (hasUnsavedChanges) {
                if (confirm('You have unsaved changes. Do you want to save before leaving?')) {
                    saveFormData('draft');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                window.location.href = 'dashboard.html';
            }
        });
    }
    
    // Auto-save every 30 seconds
    setInterval(() => {
        autoSave();
    }, 30000);
    
    // Load saved data on initialization
    loadSavedData();
}

function saveFormData(type = 'draft') {
    const formData = collectFormData();
    const timestamp = new Date().toISOString();
    
    const saveData = {
        ...formData,
        savedAt: timestamp,
        type: type
    };
    
    try {
        localStorage.setItem('profileBuilderData', JSON.stringify(saveData));
        
        if (type === 'progress') {
            showNotification('Progress saved successfully', 'success');
        } else if (type === 'draft') {
            showNotification('Draft saved successfully', 'success');
        }
    } catch (error) {
        showNotification('Failed to save data', 'error');
        console.error('Save error:', error);
    }
}

function loadSavedData() {
    try {
        const savedData = localStorage.getItem('profileBuilderData');
        if (savedData) {
            const data = JSON.parse(savedData);
            populateFormWithData(data);
            
            const savedDate = new Date(data.savedAt).toLocaleDateString();
            showNotification(`Loaded saved data from ${savedDate}`, 'info');
        }
    } catch (error) {
        console.error('Load error:', error);
    }
}

function populateFormWithData(data) {
    // Populate basic fields
    if (data.firstName) {
        const firstNameInput = document.querySelector('input[type="text"]');
        if (firstNameInput) firstNameInput.value = data.firstName;
    }
    
    if (data.lastName) {
        const lastNameInput = document.querySelectorAll('input[type="text"]')[1];
        if (lastNameInput) lastNameInput.value = data.lastName;
    }
    
    // Populate other fields...
    // This would be expanded to populate all form fields
    
    // Update all section completions
    updateAllSectionCompletions();
}

function autoSave() {
    const hasUnsavedChanges = checkForUnsavedChanges();
    if (hasUnsavedChanges) {
        saveFormData('auto');
    }
}

function checkForUnsavedChanges() {
    // Simple check - in a real app this would be more sophisticated
    const currentData = collectFormData();
    const savedData = localStorage.getItem('profileBuilderData');
    
    if (!savedData) return true;
    
    try {
        const parsed = JSON.parse(savedData);
        return JSON.stringify(currentData) !== JSON.stringify({
            ...parsed,
            savedAt: undefined,
            type: undefined
        });
    } catch {
        return true;
    }
}

function publishProfile() {
    const formData = collectFormData();
    const overallProgress = parseInt(document.getElementById('progressPercentage')?.textContent || '0');
    
    if (overallProgress < 70) {
        showNotification('Please complete at least 70% of your profile before publishing', 'warning');
        return;
    }
    
    // Validate required sections
    const requiredFields = document.querySelectorAll('[required]');
    let hasErrors = false;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            hasErrors = true;
        }
    });
    
    if (hasErrors) {
        showNotification('Please fix all errors before publishing', 'error');
        return;
    }
    
    const publishBtn = document.getElementById('publishProfileBtn');
    const originalText = publishBtn.innerHTML;
    
    publishBtn.innerHTML = '<div class="loading"></div> Publishing...';
    publishBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        publishBtn.innerHTML = originalText;
        publishBtn.disabled = false;
        
        showNotification('Profile published successfully! 🎉', 'success');
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }, 3000);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProfileBuilder);
} else {
    initializeProfileBuilder();
}
