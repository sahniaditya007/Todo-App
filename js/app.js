// TaskFlow Landing Page - Age Verification & Registration
class TaskFlowLanding {
    constructor() {
        this.init();
    }

    init() {
        this.checkExistingUser();
        this.bindEvents();
    }

    // Check if user data already exists and redirect
    checkExistingUser() {
        const userData = localStorage.getItem('taskflow_user');
        if (userData) {
            // User already registered, redirect to app
            window.location.href = 'app.html';
        }
    }

    // Calculate age from date of birth
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    // Validate form inputs
    validateForm(name, dob) {
        let isValid = true;
        
        // Clear previous errors
        document.getElementById('name-error').textContent = '';
        document.getElementById('dob-error').textContent = '';
        
        // Validate name
        if (!name || name.trim().length < 2) {
            document.getElementById('name-error').textContent = 'Please enter a valid name (minimum 2 characters)';
            isValid = false;
        }
        
        // Validate date of birth
        if (!dob) {
            document.getElementById('dob-error').textContent = 'Please select your date of birth';
            isValid = false;
        } else {
            const age = this.calculateAge(dob);
            if (age <= 10) {
                document.getElementById('dob-error').textContent = 'You must be over 10 years old to use TaskFlow';
                isValid = false;
            }
        }
        
        return isValid;
    }

    // Handle form submission
    handleRegistration(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const name = formData.get('name').trim();
        const dob = formData.get('dob');
        
        if (this.validateForm(name, dob)) {
            // Calculate age for storage
            const age = this.calculateAge(dob);
            
            // Store user data in localStorage
            const userData = {
                name: name,
                dateOfBirth: dob,
                age: age,
                registeredAt: new Date().toISOString()
            };
            
            localStorage.setItem('taskflow_user', JSON.stringify(userData));
            
            // Show success message and redirect
            this.showNotification('Registration successful! Redirecting to TaskFlow...', 'success');
            
            setTimeout(() => {
                window.location.href = 'app.html';
            }, 1500);
        }
    }

    // Bind event listeners
    bindEvents() {
        document.getElementById('registration-form').addEventListener('submit', (e) => {
            this.handleRegistration(e);
        });
        
        // Real-time validation
        document.getElementById('name').addEventListener('blur', () => {
            const name = document.getElementById('name').value.trim();
            if (name && name.length < 2) {
                document.getElementById('name-error').textContent = 'Name must be at least 2 characters long';
            } else {
                document.getElementById('name-error').textContent = '';
            }
        });
        
        document.getElementById('dob').addEventListener('change', (e) => {
            const dob = e.target.value;
            if (dob) {
                const age = this.calculateAge(dob);
                if (age <= 10) {
                    document.getElementById('dob-error').textContent = `You are ${age} years old. You must be over 10 to continue.`;
                } else {
                    document.getElementById('dob-error').textContent = '';
                }
            }
        });
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

// Initialize the landing page
const taskFlowLanding = new TaskFlowLanding();

