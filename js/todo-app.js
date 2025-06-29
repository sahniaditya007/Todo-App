// TaskFlow Todo Application - Main App
class TodoApp {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.currentActiveStage = 'todo';
        
        this.init();
    }

    async init() {
        this.checkUserAccess();
        this.loadUserData();
        await this.loadInitialTasks();
        this.bindEvents();
        this.renderTasks();
        this.updateCounters();
    }

    // Check if user has access (came from landing page)
    checkUserAccess() {
        const userData = localStorage.getItem('taskflow_user');
        if (!userData) {
            // Redirect back to landing page if no user data
            window.location.href = 'index.html';
            return;
        }
        
        this.currentUser = JSON.parse(userData);
        this.setupUserProfile();
    }

    // Setup user profile display with avatar
    setupUserProfile() {
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');
        
        userName.textContent = this.currentUser.name;
        
        // Generate avatar using UI Avatars API
        const avatarUrl = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(this.currentUser.name)}`;
        userAvatar.src = avatarUrl;
        userAvatar.alt = `${this.currentUser.name}'s avatar`;
    }

    // Load user's existing tasks or fetch initial data
    loadUserData() {
        const tasksData = localStorage.getItem('taskflow_tasks');
        if (tasksData) {
            this.tasks = JSON.parse(tasksData);
        }
    }

    // Load initial tasks from DummyJSON API if no tasks exist
    async loadInitialTasks() {
        if (this.tasks.length === 0) {
            try {
                const response = await fetch('https://dummyjson.com/todos');
                const data = await response.json();
                
                // Transform DummyJSON todos to our task structure
                this.tasks = data.todos.slice(0, 5).map(todo => ({
                    id: this.generateId(),
                    title: todo.todo,
                    status: 'todo', // All start as todo
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }));
                
                this.saveTasksData();
                this.showNotification('Welcome! Here are some initial tasks to get you started.', 'success');
            } catch (error) {
                console.error('Failed to load initial tasks:', error);
                this.showNotification('Failed to load initial tasks. You can start adding your own!', 'warning');
            }
        }
    }

    // Save tasks to localStorage
    saveTasksData() {
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    // Generate unique ID for tasks
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Add new task
    addTask(title) {
        if (!title.trim()) {
            this.showNotification('Please enter a task title!', 'error');
            return;
        }

        const task = {
            id: this.generateId(),
            title: title.trim(),
            status: this.currentActiveStage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasksData();
        this.renderTasks();
        this.updateCounters();
        
        // Clear input
        document.getElementById('task-input').value = '';
        
        this.showNotification('Task added successfully!', 'success');
    }

    // Move task between stages
    moveTask(taskId, newStatus) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].status = newStatus;
            this.tasks[taskIndex].updatedAt = new Date().toISOString();
            this.saveTasksData();
            this.renderTasks();
            this.updateCounters();
            
            const statusText = this.getStatusDisplayName(newStatus);
            this.showNotification(`Task moved to ${statusText}!`, 'success');
        }
    }

    // Get display name for status
    getStatusDisplayName(status) {
        switch (status) {
            case 'todo': return 'Todo';
            case 'completed': return 'Completed';
            case 'archived': return 'Archived';
            default: return status;
        }
    }

    // Archive task (no delete functionality as per requirements)
    archiveTask(taskId) {
        this.moveTask(taskId, 'archived');
    }

    // Render all tasks in their respective columns
    renderTasks() {
        const todoContainer = document.getElementById('todo-tasks');
        const completedContainer = document.getElementById('completed-tasks');
        const archivedContainer = document.getElementById('archived-tasks');

        // Clear containers
        todoContainer.innerHTML = '';
        completedContainer.innerHTML = '';
        archivedContainer.innerHTML = '';

        // Group tasks by status
        const todoTasks = this.tasks.filter(task => task.status === 'todo');
        const completedTasks = this.tasks.filter(task => task.status === 'completed');
        const archivedTasks = this.tasks.filter(task => task.status === 'archived');

        // Render tasks in each column
        todoTasks.forEach(task => {
            todoContainer.appendChild(this.createTaskElement(task));
        });

        completedTasks.forEach(task => {
            completedContainer.appendChild(this.createTaskElement(task));
        });

        archivedTasks.forEach(task => {
            archivedContainer.appendChild(this.createTaskElement(task));
        });

        // Show empty state if no tasks in a column
        this.showEmptyStateIfNeeded(todoContainer, 'No tasks in Todo');
        this.showEmptyStateIfNeeded(completedContainer, 'No completed tasks');
        this.showEmptyStateIfNeeded(archivedContainer, 'No archived tasks');
    }

    // Create task element
    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-card ${task.status}`;
        taskElement.setAttribute('data-id', task.id);

        const lastModified = this.formatTimestamp(task.updatedAt);
        
        taskElement.innerHTML = `
            <div class="task-content">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                <div class="task-timestamp">
                    <i class="fas fa-clock"></i>
                    Last modified: ${lastModified}
                </div>
            </div>
            <div class="task-actions">
                ${this.getTaskActionButtons(task)}
            </div>
        `;

        return taskElement;
    }

    // Get action buttons based on task status
    getTaskActionButtons(task) {
        let buttons = '';

        if (task.status === 'todo') {
            buttons += `
                <button class="btn btn-success btn-sm" onclick="todoApp.moveTask('${task.id}', 'completed')" title="Mark as Completed">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-warning btn-sm" onclick="todoApp.archiveTask('${task.id}')" title="Archive">
                    <i class="fas fa-archive"></i>
                </button>
            `;
        } else if (task.status === 'completed') {
            buttons += `
                <button class="btn btn-secondary btn-sm" onclick="todoApp.moveTask('${task.id}', 'todo')" title="Move to Todo">
                    <i class="fas fa-undo"></i>
                </button>
                <button class="btn btn-warning btn-sm" onclick="todoApp.archiveTask('${task.id}')" title="Archive">
                    <i class="fas fa-archive"></i>
                </button>
            `;
        } else if (task.status === 'archived') {
            buttons += `
                <button class="btn btn-primary btn-sm" onclick="todoApp.moveTask('${task.id}', 'todo')" title="Move to Todo">
                    <i class="fas fa-undo"></i>
                </button>
                <button class="btn btn-success btn-sm" onclick="todoApp.moveTask('${task.id}', 'completed')" title="Move to Completed">
                    <i class="fas fa-check"></i>
                </button>
            `;
        }

        return buttons;
    }

    // Show empty state for columns with no tasks
    showEmptyStateIfNeeded(container, message) {
        if (container.children.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state-column';
            emptyState.innerHTML = `
                <i class="fas fa-inbox"></i>
                <p>${message}</p>
            `;
            container.appendChild(emptyState);
        }
    }

    // Update task counters
    updateCounters() {
        const todoCount = this.tasks.filter(task => task.status === 'todo').length;
        const completedCount = this.tasks.filter(task => task.status === 'completed').length;
        const archivedCount = this.tasks.filter(task => task.status === 'archived').length;

        document.getElementById('todo-counter').textContent = todoCount;
        document.getElementById('completed-counter').textContent = completedCount;
        document.getElementById('archived-counter').textContent = archivedCount;
    }

    // Format timestamp for display
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    // Handle logout - clear data and redirect
    logout() {
        if (confirm('Are you sure you want to sign out? This will clear your localStorage and redirect to the landing page.')) {
            localStorage.removeItem('taskflow_user');
            localStorage.removeItem('taskflow_tasks');
            window.location.href = 'index.html';
        }
    }

    // Bind event listeners
    bindEvents() {
        // Add task button
        document.getElementById('add-task-btn').addEventListener('click', () => {
            const input = document.getElementById('task-input');
            const title = input.value.trim();
            this.addTask(title);
        });

        // Enter key for quick add
        document.getElementById('task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const title = e.target.value.trim();
                this.addTask(title);
            }
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Set current active stage based on which column area is clicked
        document.querySelectorAll('.stage-column').forEach(column => {
            column.addEventListener('click', (e) => {
                // Only change active stage if clicking on the column itself, not on tasks
                if (e.target.classList.contains('stage-column') || e.target.classList.contains('stage-header')) {
                    this.currentActiveStage = column.dataset.stage;
                    this.updateActiveStageIndicator();
                }
            });
        });
    }

    // Update visual indicator of which stage new tasks will be added to
    updateActiveStageIndicator() {
        document.querySelectorAll('.stage-column').forEach(column => {
            column.classList.remove('active-stage');
        });
        
        document.querySelector(`[data-stage="${this.currentActiveStage}"]`).classList.add('active-stage');
        
        // Update placeholder text
        const stageNames = {
            'todo': 'Todo',
            'completed': 'Completed',
            'archived': 'Archived'
        };
        
        document.getElementById('task-input').placeholder = `Add task to ${stageNames[this.currentActiveStage]}...`;
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show notification messages
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
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
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
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

// Initialize the todo application
const todoApp = new TodoApp();
