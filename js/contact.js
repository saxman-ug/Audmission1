document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset button state
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                
                // Show success message
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                
                // Reset form
                this.reset();
            }, 1500);
        });
        
        // Add input validation on blur
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    // Form validation
    function validateForm(data) {
        let isValid = true;
        
        // Validate name
        if (!data.name.trim()) {
            showFieldError('name', 'Please enter your name');
            isValid = false;
        }
        
        // Validate email
        if (!data.email.trim()) {
            showFieldError('email', 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(data.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        if (!data.subject) {
            showFieldError('subject', 'Please select a subject');
            isValid = false;
        }
        
        // Validate message
        if (!data.message.trim()) {
            showFieldError('message', 'Please enter your message');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Field validation
    function validateField(field) {
        const value = field.value.trim();
        
        switch(field.id) {
            case 'name':
                if (!value) {
                    showFieldError(field, 'Please enter your name');
                } else {
                    clearFieldError(field);
                }
                break;
                
            case 'email':
                if (!value) {
                    showFieldError(field, 'Please enter your email');
                } else if (!isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                } else {
                    clearFieldError(field);
                }
                break;
                
            case 'subject':
                if (!value) {
                    showFieldError(field, 'Please select a subject');
                } else {
                    clearFieldError(field);
                }
                break;
                
            case 'message':
                if (!value) {
                    showFieldError(field, 'Please enter your message');
                } else {
                    clearFieldError(field);
                }
                break;
        }
    }
    
    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Show field error
    function showFieldError(field, message) {
        const input = typeof field === 'string' ? document.getElementById(field) : field;
        const formGroup = input.closest('.form-group');
        
        // Remove existing error
        clearFieldError(field);
        
        // Add error class
        input.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Add error message after input
        formGroup.appendChild(errorDiv);
    }
    
    // Clear field error
    function clearFieldError(field) {
        const input = typeof field === 'string' ? document.getElementById(field) : field;
        const formGroup = input.closest('.form-group');
        
        // Remove error class
        input.classList.remove('error');
        
        // Remove error message
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    // Show message
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Add styles
        messageDiv.style.position = 'fixed';
        messageDiv.style.bottom = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.padding = '15px 25px';
        messageDiv.style.borderRadius = '4px';
        messageDiv.style.color = 'white';
        messageDiv.style.fontWeight = '500';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        messageDiv.style.transition = 'all 0.3s ease';
        
        // Set background color based on type
        messageDiv.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
        
        document.body.appendChild(messageDiv);
        
        // Trigger animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(20px)';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
    
    // Smooth scrolling for FAQ links
    const faqLinks = document.querySelectorAll('a[href^="#"]');
    faqLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Dropdown Menu Functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Handle desktop hover
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        dropdown.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
    
    // Handle mobile click
    if (window.innerWidth <= 768) {
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.dropdown-link');
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        });
    }
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');
        
        // Toggle answer visibility
        answer.style.maxHeight = answer.style.maxHeight ? null : answer.scrollHeight + 'px';
        
        // Toggle icon rotation
        icon.style.transform = icon.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
        
        // Toggle active state
        question.parentElement.classList.toggle('active');
    });
});

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS for notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.success {
            background-color: #2ecc71;
        }
        
        .notification.error {
            background-color: #e74c3c;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addNotificationStyles();
    
    // Initialize FAQ answers with maxHeight
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
    });
}); 