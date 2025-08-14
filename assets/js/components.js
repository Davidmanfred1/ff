// Church Management System - UI Components

class UIComponents {
    constructor() {
        this.modals = new Map();
        this.forms = new Map();
    }

    // Modal Management
    createModal(id, title, content, size = 'modal-lg') {
        const modalHTML = `
            <div class="modal fade" id="${id}" tabindex="-1">
                <div class="modal-dialog ${size}">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modals.set(id, new bootstrap.Modal(document.getElementById(id)));
        return this.modals.get(id);
    }

    showModal(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.show();
        }
    }

    hideModal(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.hide();
        }
    }

    // Form Components
    createForm(config) {
        const { id, fields, submitText = 'Submit', onSubmit } = config;
        
        let formHTML = `<form id="${id}" class="needs-validation" novalidate>`;
        
        fields.forEach(field => {
            formHTML += this.createFormField(field);
        });
        
        formHTML += `
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg">
                    ${submitText}
                </button>
            </div>
        </form>`;
        
        return formHTML;
    }

    createFormField(field) {
        const { type, name, label, required = false, options = [], placeholder = '', value = '' } = field;
        
        let fieldHTML = `<div class="mb-3">`;
        
        if (label) {
            fieldHTML += `<label for="${name}" class="form-label">${label}${required ? ' *' : ''}</label>`;
        }
        
        switch (type) {
            case 'text':
            case 'email':
            case 'password':
            case 'tel':
            case 'date':
            case 'time':
                fieldHTML += `
                    <input type="${type}" 
                           class="form-control" 
                           id="${name}" 
                           name="${name}" 
                           placeholder="${placeholder}"
                           value="${value}"
                           ${required ? 'required' : ''}>
                `;
                break;
                
            case 'textarea':
                fieldHTML += `
                    <textarea class="form-control" 
                              id="${name}" 
                              name="${name}" 
                              rows="4" 
                              placeholder="${placeholder}"
                              ${required ? 'required' : ''}>${value}</textarea>
                `;
                break;
                
            case 'select':
                fieldHTML += `<select class="form-select" id="${name}" name="${name}" ${required ? 'required' : ''}>`;
                fieldHTML += `<option value="">Choose...</option>`;
                options.forEach(option => {
                    fieldHTML += `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.text}</option>`;
                });
                fieldHTML += `</select>`;
                break;
                
            case 'checkbox':
                fieldHTML += `
                    <div class="form-check">
                        <input class="form-check-input" 
                               type="checkbox" 
                               id="${name}" 
                               name="${name}" 
                               value="1"
                               ${value ? 'checked' : ''}>
                        <label class="form-check-label" for="${name}">
                            ${label}
                        </label>
                    </div>
                `;
                break;
                
            case 'radio':
                options.forEach((option, index) => {
                    fieldHTML += `
                        <div class="form-check">
                            <input class="form-check-input" 
                                   type="radio" 
                                   id="${name}_${index}" 
                                   name="${name}" 
                                   value="${option.value}"
                                   ${option.value === value ? 'checked' : ''}>
                            <label class="form-check-label" for="${name}_${index}">
                                ${option.text}
                            </label>
                        </div>
                    `;
                });
                break;
        }
        
        if (required) {
            fieldHTML += `<div class="invalid-feedback">Please provide a valid ${label.toLowerCase()}.</div>`;
        }
        
        fieldHTML += `</div>`;
        return fieldHTML;
    }

    // Card Components
    createCard(config) {
        const { title, content, image, actions = [], className = '' } = config;
        
        return `
            <div class="card feature-card ${className}">
                ${image ? `<img src="${image}" class="card-img-top" alt="${title}">` : ''}
                <div class="card-body">
                    ${title ? `<h5 class="card-title">${title}</h5>` : ''}
                    <div class="card-text">${content}</div>
                    ${actions.length > 0 ? this.createCardActions(actions) : ''}
                </div>
            </div>
        `;
    }

    createCardActions(actions) {
        let actionsHTML = '<div class="card-actions mt-3">';
        actions.forEach(action => {
            actionsHTML += `
                <button type="button" 
                        class="btn ${action.className || 'btn-primary'} me-2"
                        onclick="${action.onclick || ''}"
                        ${action.attributes || ''}>
                    ${action.icon ? `<i class="${action.icon} me-1"></i>` : ''}
                    ${action.text}
                </button>
            `;
        });
        actionsHTML += '</div>';
        return actionsHTML;
    }

    // Event Card Component
    createEventCard(event) {
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card event-card">
                    <div class="row g-0">
                        <div class="col-4">
                            <div class="event-date">
                                <div class="day">${day}</div>
                                <div class="month">${month}</div>
                            </div>
                        </div>
                        <div class="col-8">
                            <div class="card-body">
                                <h6 class="card-title">${event.title}</h6>
                                <p class="card-text small text-muted">${event.time}</p>
                                <p class="card-text small">${event.description}</p>
                                <button class="btn btn-sm btn-outline-primary" onclick="viewEvent('${event.id}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Member Card Component
    createMemberCard(member) {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card feature-card text-center">
                    <div class="card-body">
                        <div class="member-avatar mb-3">
                            ${member.photo ? 
                                `<img src="${member.photo}" class="rounded-circle" width="80" height="80" alt="${member.name}">` :
                                `<div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                                    <i class="bi bi-person text-white fs-2"></i>
                                </div>`
                            }
                        </div>
                        <h6 class="card-title">${member.name}</h6>
                        <p class="card-text small text-muted">${member.role || 'Member'}</p>
                        ${member.ministry ? `<span class="badge bg-primary">${member.ministry}</span>` : ''}
                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline-primary" onclick="contactMember('${member.id}')">
                                <i class="bi bi-envelope me-1"></i>Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Sermon Card Component
    createSermonCard(sermon) {
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card feature-card">
                    <div class="position-relative">
                        <img src="${sermon.thumbnail || 'assets/images/sermon-default.jpg'}" 
                             class="card-img-top" 
                             alt="${sermon.title}">
                        <div class="position-absolute top-50 start-50 translate-middle">
                            <button class="btn btn-primary btn-lg rounded-circle" onclick="playSermon('${sermon.id}')">
                                <i class="bi bi-play-fill"></i>
                            </button>
                        </div>
                        <div class="position-absolute bottom-0 end-0 m-2">
                            <span class="badge bg-dark">${sermon.duration}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${sermon.title}</h6>
                        <p class="card-text small text-muted">
                            <i class="bi bi-person me-1"></i>${sermon.speaker} • 
                            <i class="bi bi-calendar me-1"></i>${formatDate(sermon.date)}
                        </p>
                        <p class="card-text small">${sermon.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-sm btn-outline-primary" onclick="downloadSermon('${sermon.id}')">
                                <i class="bi bi-download me-1"></i>Download
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="shareSermon('${sermon.id}')">
                                <i class="bi bi-share me-1"></i>Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Calendar Component
    createCalendar(events = []) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        return `
            <div class="calendar-container">
                <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
                    <button class="btn btn-outline-primary" onclick="previousMonth()">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <h4 id="calendarTitle">${this.getMonthName(currentMonth)} ${currentYear}</h4>
                    <button class="btn btn-outline-primary" onclick="nextMonth()">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
                <div class="calendar-grid">
                    ${this.generateCalendarGrid(currentYear, currentMonth, events)}
                </div>
            </div>
        `;
    }

    generateCalendarGrid(year, month, events) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        let html = '<div class="calendar-weekdays">';
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            html += `<div class="calendar-weekday">${day}</div>`;
        });
        html += '</div><div class="calendar-days">';
        
        const current = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const isCurrentMonth = current.getMonth() === month;
            const isToday = current.toDateString() === new Date().toDateString();
            const dayEvents = events.filter(event => 
                new Date(event.date).toDateString() === current.toDateString()
            );
            
            html += `
                <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}"
                     data-date="${current.toISOString().split('T')[0]}">
                    <div class="day-number">${current.getDate()}</div>
                    ${dayEvents.length > 0 ? `<div class="event-indicator">${dayEvents.length}</div>` : ''}
                </div>
            `;
            
            current.setDate(current.getDate() + 1);
        }
        
        html += '</div>';
        return html;
    }

    getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }

    // Notification Component
    showToast(message, type = 'info', duration = 5000) {
        const toastContainer = this.getOrCreateToastContainer();
        const toastId = 'toast_' + Date.now();
        
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-${this.getToastIcon(type)} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: duration });
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    getOrCreateToastContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        return container;
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Loading Component
    showLoading(target, message = 'Loading...') {
        const loadingHTML = `
            <div class="loading-overlay d-flex flex-column align-items-center justify-content-center">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">${message}</p>
            </div>
        `;
        
        if (typeof target === 'string') {
            target = document.getElementById(target);
        }
        
        if (target) {
            target.style.position = 'relative';
            target.insertAdjacentHTML('beforeend', loadingHTML);
        }
    }

    hideLoading(target) {
        if (typeof target === 'string') {
            target = document.getElementById(target);
        }
        
        if (target) {
            const overlay = target.querySelector('.loading-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }

    // Data Table Component
    createDataTable(config) {
        const { id, columns, data, actions = [], searchable = true, pagination = true } = config;
        
        let tableHTML = `
            <div class="table-responsive">
                ${searchable ? `
                    <div class="mb-3">
                        <input type="text" class="form-control" placeholder="Search..." onkeyup="filterTable('${id}', this.value)">
                    </div>
                ` : ''}
                <table id="${id}" class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            ${columns.map(col => `<th>${col.title}</th>`).join('')}
                            ${actions.length > 0 ? '<th>Actions</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.generateTableRows(data, columns, actions)}
                    </tbody>
                </table>
                ${pagination ? this.createPagination(data.length) : ''}
            </div>
        `;
        
        return tableHTML;
    }

    generateTableRows(data, columns, actions) {
        return data.map(row => {
            let rowHTML = '<tr>';
            columns.forEach(col => {
                rowHTML += `<td>${row[col.field] || ''}</td>`;
            });
            
            if (actions.length > 0) {
                rowHTML += '<td>';
                actions.forEach(action => {
                    rowHTML += `
                        <button class="btn btn-sm ${action.className}" 
                                onclick="${action.onclick}('${row.id}')"
                                title="${action.title}">
                            <i class="${action.icon}"></i>
                        </button>
                    `;
                });
                rowHTML += '</td>';
            }
            
            rowHTML += '</tr>';
            return rowHTML;
        }).join('');
    }

    createPagination(totalItems, itemsPerPage = 10) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) return '';
        
        let paginationHTML = `
            <nav aria-label="Table pagination">
                <ul class="pagination justify-content-center">
                    <li class="page-item">
                        <a class="page-link" href="#" onclick="changePage(1)">First</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#" onclick="previousPage()">Previous</a>
                    </li>
        `;
        
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            paginationHTML += `
                <li class="page-item ${i === 1 ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }
        
        paginationHTML += `
                    <li class="page-item">
                        <a class="page-link" href="#" onclick="nextPage()">Next</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#" onclick="changePage(${totalPages})">Last</a>
                    </li>
                </ul>
            </nav>
        `;
        
        return paginationHTML;
    }

    // Progress Component
    createProgressBar(percentage, label = '', animated = false) {
        return `
            <div class="progress-container mb-3">
                ${label ? `<div class="d-flex justify-content-between mb-1">
                    <span class="small">${label}</span>
                    <span class="small">${percentage}%</span>
                </div>` : ''}
                <div class="progress">
                    <div class="progress-bar ${animated ? 'progress-bar-striped progress-bar-animated' : ''}" 
                         role="progressbar" 
                         style="width: ${percentage}%" 
                         aria-valuenow="${percentage}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
            </div>
        `;
    }

    // Statistics Component
    createStatCard(config) {
        const { title, value, icon, color = 'primary', trend = null } = config;
        
        return `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card feature-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title text-muted mb-1">${title}</h6>
                                <h3 class="mb-0 text-${color}">${value}</h3>
                                ${trend ? `<small class="text-${trend.direction === 'up' ? 'success' : 'danger'}">
                                    <i class="bi bi-arrow-${trend.direction}"></i> ${trend.value}%
                                </small>` : ''}
                            </div>
                            <div class="stat-icon">
                                <i class="bi bi-${icon} text-${color} fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize UI Components
const uiComponents = new UIComponents();

// Global utility functions for components
function filterTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

function changePage(page) {
    console.log('Changing to page:', page);
    // Implement pagination logic
}

function nextPage() {
    console.log('Next page');
    // Implement next page logic
}

function previousPage() {
    console.log('Previous page');
    // Implement previous page logic
}
