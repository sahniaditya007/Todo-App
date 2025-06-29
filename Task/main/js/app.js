// TaskFlow Application - Vanilla JavaScript
class TaskFlow {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.checkAuthState();
    }

    // Data Management
    loadData() {
        const userData = localStorage.getItem('taskflow_user');
        const tasksData = localStorage.getItem('taskflow_tasks');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
        
        if (tasksData) {
            this.tasks = JSON.parse(tasksData);
        }
    }

    saveData() {
        if (this.currentUser) {
            localStorage.setItem('taskflow_user', JSON.stringify(this.currentUser));
        }
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    // Authentication
    checkAuthState() {
        if (this.currentUser) {
            this.showApp();
        } else {
            this.showLogin();
        }
    }

    login(username, password) {
        // Simple demo authentication - accept any username/password
        if (username && password) {
            this.currentUser = {
                username: username,
                loginTime: new Date().toISOString()
            };
            this.saveData();
            this.showApp();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('taskflow_user');
        this.showLogin();
    }

    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showApp() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('user-name').textContent = this.currentUser.username;
        this.renderTasks();
        this.updateStats();
    }

    // Task Management
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTask(title, description = '', priority = 'medium') {
        const task = {
            id: this.generateId(),
            title: title.trim(),
            description: description.trim(),
            priority: priority,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveData();
        this.renderTasks();
        this.updateStats();
        
        // Clear input
        document.getElementById('task-input').value = '';
        
        this.showNotification('Task added successfully!', 'success');
    }

    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveData();
            this.renderTasks();
            this.updateStats();
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveData();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Task deleted successfully!', 'success');
        }
    }

    toggleTaskStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const newStatus = task.status === 'active' ? 'completed' : 'active';
            this.updateTask(id, { status: newStatus });
            
            const statusText = newStatus === 'completed' ? 'completed' : 'reactivated';
            this.showNotification(`Task ${statusText}!`, 'success');
        }
    }

    archiveTask(id) {
        this.updateTask(id, { status: 'archived' });
        this.showNotification('Task archived!', 'success');
    }

    unarchiveTask(id) {
        this.updateTask(id, { status: 'active' });
        this.showNotification('Task unarchived!', 'success');
    }

    // Task Filtering
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => task.status === 'active');
            case 'completed':
                return this.tasks.filter(task => task.status === 'completed');
            case 'archived':
                return this.tasks.filter(task => task.status === 'archived');
            default:
                return this.tasks;
        }
    }

    // Rendering
    renderTasks() {
        const taskList = document.getElementById('task-list');
        const emptyState = document.getElementById('empty-state');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        
        taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
    }

    createTaskHTML(task) {
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        const priorityClass = `priority-${task.priority}`;
        
        return `
            <div class="task-item ${task.status} ${priorityClass}" data-id="${task.id}">
                <div class="task-content">
                    <div class="task-info">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                        <div class="task-meta">
                            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                            <span><i class="fas fa-calendar"></i> ${createdDate}</span>
                            <span><i class="fas fa-info-circle"></i> ${task.status}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        ${this.getTaskActionButtons(task)}
                    </div>
                </div>
            </div>
        `;
    }

    getTaskActionButtons(task) {
        let buttons = '';
        
        if (task.status === 'active') {
            buttons += `
                <button class="btn btn-success btn-sm" onclick="taskFlow.toggleTaskStatus('${task.id}')" title="Mark as Complete">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="taskFlow.openEditModal('${task.id}')" title="Edit Task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-warning btn-sm" onclick="taskFlow.archiveTask('${task.id}')" title="Archive Task">
                    <i class="fas fa-archive"></i>
                </button>
            `;
        } else if (task.status === 'completed') {
            buttons += `
                <button class="btn btn-secondary btn-sm" onclick="taskFlow.toggleTaskStatus('${task.id}')" title="Mark as Active">
                    <i class="fas fa-undo"></i>
                </button>
                <button class="btn btn-warning btn-sm" onclick="taskFlow.archiveTask('${task.id}')" title="Archive Task">
                    <i class="fas fa-archive"></i>
                </button>
            `;
        } else if (task.status === 'archived') {
            buttons += `
                <button class="btn btn-secondary btn-sm" onclick="taskFlow.unarchiveTask('${task.id}')" title="Unarchive Task">
                    <i class="fas fa-box-open"></i>
                </button>
            `;
        }
        
        buttons += `
            <button class="btn btn-danger btn-sm" onclick="taskFlow.deleteTask('${task.id}')" title="Delete Task">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        return buttons;
    }

    // Statistics
    updateStats() {
        const stats = {
            total: this.tasks.length,
            active: this.tasks.filter(t => t.status === 'active').length,
            completed: this.tasks.filter(t => t.status === 'completed').length,
            archived: this.tasks.filter(t => t.status === 'archived').length
        };

        document.getElementById('total-tasks').textContent = stats.total;
        document.getElementById('active-tasks').textContent = stats.active;
        document.getElementById('completed-tasks').textContent = stats.completed;
        document.getElementById('archived-tasks').textContent = stats.archived;
    }

    // Modal Management
    openEditModal(taskId = null) {
        this.editingTaskId = taskId;
        const modal = document.getElementById('task-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('task-form');
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                modalTitle.textContent = 'Edit Task';
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-description').value = task.description || '';
                document.getElementById('task-priority').value = task.priority;
            }
        } else {
            modalTitle.textContent = 'Add New Task';
            form.reset();
        }
        
        modal.classList.remove('hidden');
        document.getElementById('task-title').focus();
    }

    closeModal() {
        document.getElementById('task-modal').classList.add('hidden');
        this.editingTaskId = null;
        document.getElementById('task-form').reset();
    }

    handleTaskFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const priority = formData.get('priority');
        
        if (!title) {
            this.showNotification('Task title is required!', 'error');
            return;
        }
        
        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, { title, description, priority });
            this.showNotification('Task updated successfully!', 'success');
        } else {
            this.addTask(title, description, priority);
        }
        
        this.closeModal();
    }

    // Event Binding
    bindEvents() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (this.login(username, password)) {
                this.showNotification('Login successful!', 'success');
            } else {
                this.showNotification('Please enter username and password!', 'error');
            }
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Add task
        document.getElementById('add-task-btn').addEventListener('click', () => {
            const input = document.getElementById('task-input');
            const title = input.value.trim();
            
            if (title) {
                this.addTask(title);
            } else {
                this.showNotification('Please enter a task title!', 'error');
                input.focus();
            }
        });

        // Enter key for quick add
        document.getElementById('task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('add-task-btn').click();
            }
        });

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.setFilter(tab.dataset.filter);
            });
        });

        // Modal events
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('task-form').addEventListener('submit', (e) => {
            this.handleTaskFormSubmit(e);
        });

        // Close modal on outside click
        document.getElementById('task-modal').addEventListener('click', (e) => {
            if (e.target.id === 'task-modal') {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openEditModal();
            }
        });
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 2000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            default: return '#667eea';
        }
    }
}

// Initialize the application
const taskFlow = new TaskFlow();

// Add some demo data if no tasks exist
if (taskFlow.tasks.length === 0 && taskFlow.currentUser) {
    const demoTasks = [
        {
            id: 'demo-1',
            title: 'Welcome to TaskFlow!',
            description: 'This is a demo task to get you started. You can edit, complete, archive, or delete it.',
            priority: 'high',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'demo-2',
            title: 'Learn TaskFlow Features',
            description: 'Explore different task states, priorities, and filtering options.',
            priority: 'medium',
            status: 'active',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'demo-3',
            title: 'Completed Demo Task',
            description: 'This task shows how completed tasks look.',
            priority: 'low',
            status: 'completed',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
    ];
    
    taskFlow.tasks = demoTasks;
    taskFlow.saveData();
}
