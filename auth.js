// Authentication JavaScript Module
function initializeAuth() {
    setupAuthModals();
    setupAuthForms();
    setupPasswordToggles();
    setupSocialAuth();
}

// Setup modal functionality
function setupAuthModals() {
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const closeSignIn = document.getElementById('closeSignIn');
    const closeSignUp = document.getElementById('closeSignUp');
    const switchToSignUp = document.getElementById('switchToSignUp');
    const switchToSignIn = document.getElementById('switchToSignIn');

    // Open modals
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            signInModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            signUpModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modals
    [closeSignIn, closeSignUp].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeAuthModals);
        }
    });

    // Switch between modals
    if (switchToSignUp) {
        switchToSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            signInModal.style.display = 'none';
            signUpModal.style.display = 'flex';
        });
    }

    if (switchToSignIn) {
        switchToSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            signUpModal.style.display = 'none';
            signInModal.style.display = 'flex';
        });
    }

    // Close on backdrop click
    [signInModal, signUpModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    closeAuthModals();
                }
            });
        }
    });
}

// Close all auth modals
function closeAuthModals() {
    const modals = document.querySelectorAll('.auth-modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Setup form submissions
function setupAuthForms() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }

    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
    }
}

// Handle sign in
function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any email/password
        if (email && password) {
            // Store user session
            const userData = {
                email: email,
                name: email.split('@')[0],
                department: 'Computer Science', // Default for demo
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            if (rememberMe) {
                localStorage.setItem('userSession', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('userSession', JSON.stringify(userData));
            }

            showNotification('Welcome back! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showNotification('Invalid credentials. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 2000);
}

// Handle sign up
function handleSignUp(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signUpEmail').value;
    const department = document.getElementById('department').value;
    const program = document.getElementById('program').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!firstName || !lastName || !email || !department || !program || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    if (!agreeTerms) {
        showNotification('Please agree to the Terms of Service', 'error');
        return;
    }

    // Validate INES email
    if (!email.includes('@') || (!email.includes('ines.ac.rw') && !email.includes('student.ines'))) {
        showNotification('Please use your INES email address', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store user data
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            department: department,
            program: program,
            registrationDate: new Date().toISOString()
        };

        localStorage.setItem('userProfile', JSON.stringify(userData));
        sessionStorage.setItem('userSession', JSON.stringify({
            ...userData,
            name: `${firstName} ${lastName}`,
            loginTime: new Date().toISOString()
        }));

        showNotification('Account created successfully! Welcome to INES Career Hub!', 'success');
        
        // Redirect to profile builder
        setTimeout(() => {
            window.location.href = 'profile-builder.html';
        }, 2000);
    }, 3000);
}

// Setup password toggles
function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            const icon = toggle.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Setup social authentication
function setupSocialAuth() {
    const googleBtns = document.querySelectorAll('.btn-google');
    const microsoftBtns = document.querySelectorAll('.btn-microsoft');

    googleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Google authentication coming soon!', 'info');
        });
    });

    microsoftBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Microsoft authentication coming soon!', 'info');
        });
    });
}

// Check if user is logged in
function checkAuthStatus() {
    const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    
    if (session) {
        const userData = JSON.parse(session);
        // Update UI for logged in user
        updateUIForLoggedInUser(userData);
        return true;
    }
    return false;
}

// Update UI for logged in user
function updateUIForLoggedInUser(userData) {
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const navActions = document.querySelector('.nav-actions');

    if (signInBtn && signUpBtn && navActions) {
        navActions.innerHTML = `
            <div class="user-menu">
                <button class="nav-notification" id="notificationBtn">
                    <i class="fas fa-bell"></i>
                    <span class="notification-badge">3</span>
                </button>
                <div class="nav-profile" id="profileDropdown">
                    <img src="image.png" alt="Profile" class="profile-avatar">
                    <span class="user-name">${userData.name}</span>
                    <i class="fas fa-chevron-down"></i>
                    <div class="profile-dropdown">
                        <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="profile-builder.html"><i class="fas fa-user-edit"></i> Edit Profile</a>
                        <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            </div>
        `;

        // Setup logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    localStorage.removeItem('userProfile');
    
    showNotification('You have been logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'landing.html';
    }, 1500);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}

// Check auth status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});
