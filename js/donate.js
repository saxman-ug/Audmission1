// Donate Page JavaScript

// Utility function to format numbers with commas
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Copy bank account details to clipboard
function copyAccountDetails() {
    const details = `Bank: Standard Chartered Bank\nAccount: 1234567890\nName: Africa United for Discipleship\nBranch: Kampala`;
    navigator.clipboard.writeText(details).then(() => {
        showNotification('Bank details copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy details: ', err);
        showNotification('Failed to copy details. Please try again.', 'error');
    });
}

// Show notification message
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animate numbers with counting effect
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.textContent);
                let current = 0;
                const increment = target / 50;
                const duration = 2000; // 2 seconds
                const interval = duration / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + '+';
                    }
                }, interval);
                
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// Add hover effects to method cards
function initMethodCards() {
    const cards = document.querySelectorAll('.method-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
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
}

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
            background-color: #28a745;
        }
        
        .notification.error {
            background-color: #dc3545;
        }
    `;
    document.head.appendChild(style);
}

// Impact Section Interaction
function initImpactSection() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const storyCards = document.querySelectorAll('.story-card');
    const progressBar = document.querySelector('.progress-bar');
    const impactNumber = document.querySelector('.impact-number');
    const impactLabel = document.querySelector('.impact-label');

    const impactData = [
        {
            number: '50+',
            label: 'Churches',
            progress: 75,
            color: '#3498db'
        },
        {
            number: '200+',
            label: 'Leaders',
            progress: 85,
            color: '#2ecc71'
        },
        {
            number: '300+',
            label: 'Lives',
            progress: 90,
            color: '#e74c3c'
        }
    ];

    function updateProgress(index) {
        const data = impactData[index];
        const circumference = 2 * Math.PI * 45; // 2πr where r=45
        const offset = circumference - (data.progress / 100) * circumference;
        
        progressBar.style.strokeDasharray = circumference;
        progressBar.style.strokeDashoffset = offset;
        progressBar.style.stroke = data.color;
        
        impactNumber.textContent = data.number;
        impactLabel.textContent = data.label;
    }

    navButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Update navigation buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update story cards
            storyCards.forEach(card => card.classList.remove('active'));
            storyCards[index].classList.add('active');

            // Update progress circle
            updateProgress(index);
        });
    });

    // Initialize with first item
    updateProgress(0);
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addNotificationStyles();
    initMethodCards();
    initSmoothScroll();
    animateNumbers();
    initImpactSection();
    
    // Add loading animation to buttons
    document.querySelectorAll('.method-button').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => this.classList.remove('loading'), 1000);
            }
        });
    });
}); 