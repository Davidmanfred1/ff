// Church Management System - Main JavaScript File

class ChurchManagementSystem {
    constructor() {
        this.currentUser = null;
        this.events = [];
        this.members = [];
        this.sermons = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStoredData();
        this.setupServiceWorker();
        this.initializeComponents();
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSmoothScrolling();
            this.setupMobileMenu();
            this.setupLoginForm();
            this.setupSearchFunctionality();
        });

        // Window events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                const section = href.substring(1); // Remove the #

                // Handle navigation to different sections
                if (section && section !== 'home') {
                    this.loadContent(section);

                    // Update URL without page reload
                    history.pushState({section: section}, '', href);

                    // Update active navigation
                    this.updateActiveNavigation(section);
                } else {
                    // Handle home or scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    // Load home content
                    const contentArea = document.getElementById('content-area');
                    if (contentArea) {
                        contentArea.innerHTML = this.renderHomeContent();
                    }
                }
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.loadContent(e.state.section);
                this.updateActiveNavigation(e.state.section);
            } else {
                // Load home content
                const contentArea = document.getElementById('content-area');
                if (contentArea) {
                    contentArea.innerHTML = this.renderHomeContent();
                }
                this.updateActiveNavigation('home');
            }
        });
    }

    updateActiveNavigation(activeSection) {
        // Remove active class from all nav links
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current section
        const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${activeSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    setupMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            // Close mobile menu when clicking on a link
            navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                });
            });
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }
    }

    setupSearchFunctionality() {
        // Global search functionality
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Simulate login process
        this.showLoading(form);
        
        setTimeout(() => {
            // Mock authentication
            if (email && password) {
                this.currentUser = {
                    id: 1,
                    email: email,
                    name: 'John Doe',
                    role: 'member'
                };
                
                this.saveToStorage('currentUser', this.currentUser);
                this.updateUIForLoggedInUser();
                this.hideModal('loginModal');
                this.showNotification('Welcome back!', 'success');
            } else {
                this.showNotification('Please fill in all fields', 'error');
            }
            
            this.hideLoading(form);
        }, 1000);
    }

    updateUIForLoggedInUser() {
        const loginLink = document.querySelector('[data-bs-target="#loginModal"]');
        if (loginLink && this.currentUser) {
            loginLink.innerHTML = `<i class="bi bi-person-check me-1"></i>${this.currentUser.name}`;
            loginLink.removeAttribute('data-bs-toggle');
            loginLink.removeAttribute('data-bs-target');
            loginLink.href = '#profile';
        }
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    handleResize() {
        // Handle responsive adjustments
        this.adjustLayoutForScreenSize();
    }

    handleOnlineStatus(isOnline) {
        const statusIndicator = document.getElementById('connectionStatus');
        if (statusIndicator) {
            statusIndicator.textContent = isOnline ? 'Online' : 'Offline';
            statusIndicator.className = isOnline ? 'text-success' : 'text-warning';
        }
        
        if (!isOnline) {
            this.showNotification('You are offline. Some features may be limited.', 'warning');
        }
    }

    adjustLayoutForScreenSize() {
        const isMobile = window.innerWidth < 768;
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            if (isMobile) {
                card.classList.add('mb-3');
            } else {
                card.classList.remove('mb-3');
            }
        });
    }

    // Data Management
    loadStoredData() {
        this.currentUser = this.getFromStorage('currentUser');
        this.events = this.getFromStorage('events') || [];
        this.members = this.getFromStorage('members') || [];
        this.sermons = this.getFromStorage('sermons') || [];
        
        if (this.currentUser) {
            this.updateUIForLoggedInUser();
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from storage:', error);
            return null;
        }
    }

    // UI Utilities
    showLoading(element) {
        const button = element.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
        }
    }

    hideLoading(element) {
        const button = element.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Search Functionality
    performSearch(query) {
        if (query.length < 2) return;
        
        const results = [];
        
        // Search events
        this.events.forEach(event => {
            if (event.title.toLowerCase().includes(query.toLowerCase()) ||
                event.description.toLowerCase().includes(query.toLowerCase())) {
                results.push({type: 'event', data: event});
            }
        });
        
        // Search sermons
        this.sermons.forEach(sermon => {
            if (sermon.title.toLowerCase().includes(query.toLowerCase()) ||
                sermon.speaker.toLowerCase().includes(query.toLowerCase())) {
                results.push({type: 'sermon', data: sermon});
            }
        });
        
        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-muted">No results found.</p>';
            return;
        }
        
        const html = results.map(result => {
            const {type, data} = result;
            return `
                <div class="search-result-item p-3 border-bottom">
                    <h6 class="mb-1">${data.title}</h6>
                    <small class="text-muted">${type.charAt(0).toUpperCase() + type.slice(1)}</small>
                </div>
            `;
        }).join('');
        
        resultsContainer.innerHTML = html;
    }

    // Service Worker for PWA
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully');
                })
                .catch(error => {
                    console.log('Service Worker registration failed');
                });
        }
    }

    initializeComponents() {
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        
        // Initialize popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }

    // Content Loading
    loadContent(section) {
        const contentArea = document.getElementById('content-area');
        if (!contentArea) return;

        contentArea.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        // Load content based on section
        this.loadPageContent(section);
    }

    async loadPageContent(section) {
        const contentArea = document.getElementById('content-area');

        try {
            let response;
            switch(section) {
                case 'about':
                    response = await fetch('pages/about.html');
                    break;
                case 'events':
                    response = await fetch('pages/events.html');
                    break;
                case 'members':
                    response = await fetch('pages/members.html');
                    break;
                case 'offerings':
                    response = await fetch('pages/giving.html');
                    break;
                case 'ministries':
                    response = await fetch('pages/ministries.html');
                    break;
                case 'communications':
                    response = await fetch('pages/communications.html');
                    break;
                case 'media':
                    response = await fetch('pages/media.html');
                    break;
                case 'admin':
                    response = await fetch('pages/admin.html');
                    break;
                case 'dashboard':
                    response = await fetch('pages/dashboard.html');
                    break;
                default:
                    contentArea.innerHTML = this.renderHomeContent();
                    return;
            }

            if (response.ok) {
                const html = await response.text();
                contentArea.innerHTML = html;

                // Execute any scripts in the loaded content
                const scripts = contentArea.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.head.appendChild(newScript);
                    document.head.removeChild(newScript);
                });
            } else {
                contentArea.innerHTML = this.renderErrorContent();
            }
        } catch (error) {
            console.error('Error loading content:', error);
            contentArea.innerHTML = this.renderErrorContent();
        }

        contentArea.classList.add('fade-in-up');
    }

    renderErrorContent() {
        return `
            <div class="text-center py-5">
                <i class="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
                <h4>Content Not Available</h4>
                <p class="text-muted">Sorry, this content is currently unavailable.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise me-1"></i>Refresh Page
                </button>
            </div>
        `;
    }

    renderHomeContent() {
        return `
            <section class="content-section">
                <div class="container">
                    <div class="section-title">
                        <h2>Welcome to Our Church Family</h2>
                        <p>Discover what makes Grace Community Church a special place to worship and grow</p>
                    </div>
                    <div class="row g-4">
                        <div class="col-lg-4 col-md-6">
                            <div class="feature-card">
                                <div class="card-icon">
                                    <i class="bi bi-people"></i>
                                </div>
                                <h5>Community</h5>
                                <p>Join a welcoming community where everyone belongs and grows together in faith.</p>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                            <div class="feature-card">
                                <div class="card-icon">
                                    <i class="bi bi-book"></i>
                                </div>
                                <h5>Bible Study</h5>
                                <p>Deepen your understanding through engaging Bible studies and small group discussions.</p>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                            <div class="feature-card">
                                <div class="card-icon">
                                    <i class="bi bi-heart"></i>
                                </div>
                                <h5>Service</h5>
                                <p>Make a difference in our community through various outreach and service opportunities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

// Initialize the application
const churchApp = new ChurchManagementSystem();

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(phone);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChurchManagementSystem;
}
