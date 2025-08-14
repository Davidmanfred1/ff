// Church Management System - Admin Functions

class ChurchAdmin {
    constructor() {
        this.currentUser = null;
        this.permissions = [];
        this.init();
    }

    init() {
        this.loadUserPermissions();
        this.setupAdminEventListeners();
        this.initializeAdminComponents();
    }

    loadUserPermissions() {
        // Load current user permissions
        this.currentUser = this.getFromStorage('currentUser');
        if (this.currentUser) {
            this.permissions = this.currentUser.permissions || ['read', 'write', 'admin'];
        }
    }

    setupAdminEventListeners() {
        // Setup admin-specific event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAdminForms();
            this.setupDataTables();
            this.setupBulkActions();
        });
    }

    // Member Management Functions
    addNewMember() {
        if (!this.hasPermission('write')) {
            this.showPermissionError();
            return;
        }

        const modal = this.createMemberModal();
        modal.show();
    }

    createMemberModal() {
        const modalHTML = `
            <div class="modal fade" id="addMemberModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add New Member</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${this.generateMemberForm()}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="churchAdmin.saveMember()">
                                <i class="bi bi-person-plus me-1"></i>Add Member
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('addMemberModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        return new bootstrap.Modal(document.getElementById('addMemberModal'));
    }

    generateMemberForm() {
        return `
            <form id="memberForm" class="needs-validation" novalidate>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="firstName" class="form-label">First Name *</label>
                        <input type="text" class="form-control" id="firstName" required>
                        <div class="invalid-feedback">Please provide a first name.</div>
                    </div>
                    <div class="col-md-6">
                        <label for="lastName" class="form-label">Last Name *</label>
                        <input type="text" class="form-control" id="lastName" required>
                        <div class="invalid-feedback">Please provide a last name.</div>
                    </div>
                    <div class="col-md-6">
                        <label for="email" class="form-label">Email Address *</label>
                        <input type="email" class="form-control" id="email" required>
                        <div class="invalid-feedback">Please provide a valid email.</div>
                    </div>
                    <div class="col-md-6">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" id="phone">
                    </div>
                    <div class="col-md-6">
                        <label for="membershipType" class="form-label">Membership Type *</label>
                        <select class="form-select" id="membershipType" required>
                            <option value="">Select type...</option>
                            <option value="member">Full Member</option>
                            <option value="associate">Associate Member</option>
                            <option value="visitor">Regular Visitor</option>
                        </select>
                        <div class="invalid-feedback">Please select a membership type.</div>
                    </div>
                    <div class="col-md-6">
                        <label for="joinDate" class="form-label">Join Date</label>
                        <input type="date" class="form-control" id="joinDate">
                    </div>
                    <div class="col-12">
                        <label for="address" class="form-label">Address</label>
                        <textarea class="form-control" id="address" rows="2"></textarea>
                    </div>
                    <div class="col-12">
                        <label for="ministries" class="form-label">Ministry Involvement</label>
                        <div class="row g-2">
                            <div class="col-md-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="worship" value="worship">
                                    <label class="form-check-label" for="worship">Worship Team</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="youth" value="youth">
                                    <label class="form-check-label" for="youth">Youth Ministry</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="children" value="children">
                                    <label class="form-check-label" for="children">Children's Ministry</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="notes" class="form-label">Notes</label>
                        <textarea class="form-control" id="notes" rows="3"></textarea>
                    </div>
                </div>
            </form>
        `;
    }

    saveMember() {
        const form = document.getElementById('memberForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);
        const memberData = {
            id: this.generateId(),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            membershipType: formData.get('membershipType'),
            joinDate: formData.get('joinDate') || new Date().toISOString().split('T')[0],
            address: formData.get('address'),
            notes: formData.get('notes'),
            ministries: this.getSelectedMinistries(),
            status: 'active',
            createdAt: new Date().toISOString()
        };

        // Save member data
        this.saveToStorage('members', memberData);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addMemberModal'));
        modal.hide();
        
        // Show success message
        this.showNotification('Member added successfully!', 'success');
        
        // Refresh member list if visible
        this.refreshMemberList();
    }

    getSelectedMinistries() {
        const ministries = [];
        document.querySelectorAll('#memberForm input[type="checkbox"]:checked').forEach(checkbox => {
            ministries.push(checkbox.value);
        });
        return ministries;
    }

    // Offering Management Functions
    recordOffering() {
        if (!this.hasPermission('write')) {
            this.showPermissionError();
            return;
        }

        const modal = this.createOfferingModal();
        modal.show();
    }

    createOfferingModal() {
        const modalHTML = `
            <div class="modal fade" id="recordOfferingModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Record Offering</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${this.generateOfferingForm()}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="churchAdmin.saveOffering()">
                                <i class="bi bi-save me-1"></i>Record Offering
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('recordOfferingModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        return new bootstrap.Modal(document.getElementById('recordOfferingModal'));
    }

    generateOfferingForm() {
        const today = new Date().toISOString().split('T')[0];
        return `
            <form id="offeringForm" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label for="offeringDate" class="form-label">Date *</label>
                    <input type="date" class="form-control" id="offeringDate" value="${today}" required>
                </div>
                <div class="mb-3">
                    <label for="service" class="form-label">Service *</label>
                    <select class="form-select" id="service" required>
                        <option value="">Select service...</option>
                        <option value="sunday-9am">Sunday 9:00 AM</option>
                        <option value="sunday-11am">Sunday 11:00 AM</option>
                        <option value="wednesday-7pm">Wednesday 7:00 PM</option>
                        <option value="special-event">Special Event</option>
                    </select>
                </div>
                <div class="row g-3 mb-3">
                    <div class="col-md-4">
                        <label for="cashAmount" class="form-label">Cash Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control offering-amount" id="cashAmount" step="0.01" min="0" value="0">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label for="checkAmount" class="form-label">Check Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control offering-amount" id="checkAmount" step="0.01" min="0" value="0">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label for="onlineAmount" class="form-label">Online Amount</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control offering-amount" id="onlineAmount" step="0.01" min="0" value="0">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="fund" class="form-label">Designated Fund</label>
                    <select class="form-select" id="fund">
                        <option value="general">General Fund</option>
                        <option value="building">Building Fund</option>
                        <option value="missions">Missions</option>
                        <option value="youth">Youth Ministry</option>
                        <option value="children">Children's Ministry</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="offeringNotes" class="form-label">Notes</label>
                    <textarea class="form-control" id="offeringNotes" rows="2"></textarea>
                </div>
                <div class="alert alert-info">
                    <strong>Total Amount: $<span id="totalAmount">0.00</span></strong>
                </div>
            </form>
        `;
    }

    saveOffering() {
        const form = document.getElementById('offeringForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);
        const cash = parseFloat(formData.get('cashAmount')) || 0;
        const check = parseFloat(formData.get('checkAmount')) || 0;
        const online = parseFloat(formData.get('onlineAmount')) || 0;
        const total = cash + check + online;

        const offeringData = {
            id: this.generateId(),
            date: formData.get('offeringDate'),
            service: formData.get('service'),
            cashAmount: cash,
            checkAmount: check,
            onlineAmount: online,
            totalAmount: total,
            fund: formData.get('fund'),
            notes: formData.get('offeringNotes'),
            recordedBy: this.currentUser?.name || 'Admin',
            recordedAt: new Date().toISOString()
        };

        // Save offering data
        this.saveToStorage('offerings', offeringData);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('recordOfferingModal'));
        modal.hide();
        
        // Show success message
        this.showNotification('Offering recorded successfully!', 'success');
        
        // Refresh offering list if visible
        this.refreshOfferingList();
    }

    // Event Management Functions
    createEvent() {
        if (!this.hasPermission('write')) {
            this.showPermissionError();
            return;
        }

        // Navigate to events page or open event creation modal
        window.location.hash = 'events';
        this.showNotification('Redirecting to event management...', 'info');
    }

    // Communication Functions
    sendBulkEmail() {
        if (!this.hasPermission('admin')) {
            this.showPermissionError();
            return;
        }

        // Navigate to communications page
        window.location.hash = 'communications';
        this.showNotification('Opening bulk email interface...', 'info');
    }

    // Utility Functions
    hasPermission(permission) {
        return this.permissions.includes(permission) || this.permissions.includes('admin');
    }

    showPermissionError() {
        this.showNotification('You do not have permission to perform this action.', 'error');
    }

    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    saveToStorage(key, data) {
        try {
            let existingData = JSON.parse(localStorage.getItem(key)) || [];
            if (!Array.isArray(existingData)) {
                existingData = [];
            }
            existingData.push(data);
            localStorage.setItem(key, JSON.stringify(existingData));
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

    showNotification(message, type = 'info') {
        // Use the global uiComponents if available
        if (typeof uiComponents !== 'undefined') {
            uiComponents.showToast(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }

    refreshMemberList() {
        // Refresh member list if currently visible
        console.log('Refreshing member list...');
    }

    refreshOfferingList() {
        // Refresh offering list if currently visible
        console.log('Refreshing offering list...');
    }

    setupAdminForms() {
        // Setup form validation and interactions
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('offering-amount')) {
                this.calculateOfferingTotal();
            }
        });
    }

    calculateOfferingTotal() {
        const cash = parseFloat(document.getElementById('cashAmount')?.value) || 0;
        const check = parseFloat(document.getElementById('checkAmount')?.value) || 0;
        const online = parseFloat(document.getElementById('onlineAmount')?.value) || 0;
        
        const total = cash + check + online;
        const totalElement = document.getElementById('totalAmount');
        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
        }
    }

    setupDataTables() {
        // Initialize data tables with sorting and filtering
        console.log('Setting up data tables...');
    }

    setupBulkActions() {
        // Setup bulk action functionality
        console.log('Setting up bulk actions...');
    }

    initializeAdminComponents() {
        // Initialize admin-specific components
        console.log('Admin components initialized');
    }
}

// Initialize the admin system
const churchAdmin = new ChurchAdmin();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChurchAdmin;
}
