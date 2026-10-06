// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Testimonial Slideshow
let currentTestimonial = 0;
let testimonialInterval;
const testimonials = document.querySelectorAll('.testimonial-card');
const testimonialIntervalTime = 5000; // 5 seconds

function createNavigationDots() {
    const navContainer = document.createElement('div');
    navContainer.className = 'testimonial-nav';
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(index));
        navContainer.appendChild(dot);
    });
    
    document.querySelector('.testimonials-grid').after(navContainer);
}

function updateNavigationDots() {
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

function goToTestimonial(index) {
    // Reset interval when manually changing testimonials
    clearInterval(testimonialInterval);
    
    // Update current testimonial
    currentTestimonial = index;
    
    // Update display
    updateTestimonialDisplay();
    
    // Restart interval
    testimonialInterval = setInterval(nextTestimonial, testimonialIntervalTime);
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonialDisplay();
}

function updateTestimonialDisplay() {
    // Update navigation dots
    updateNavigationDots();
    
    // Update testimonials
    testimonials.forEach((testimonial, index) => {
        testimonial.classList.remove('active', 'prev');
        
        if (index === currentTestimonial) {
            testimonial.classList.add('active');
        } else if (index === (currentTestimonial - 1 + testimonials.length) % testimonials.length) {
            testimonial.classList.add('prev');
        }
    });
}

// Initialize testimonial slideshow
if (testimonials.length > 0) {
    // Create navigation dots
    createNavigationDots();
    
    // Set initial display
    updateTestimonialDisplay();
    
    // Start automatic updates
    testimonialInterval = setInterval(nextTestimonial, testimonialIntervalTime);
    
    // Pause on hover
    const testimonialsContainer = document.querySelector('.testimonials-grid');
    testimonialsContainer.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    testimonialsContainer.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(nextTestimonial, testimonialIntervalTime);
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        // Check if href is not just "#" and is a valid selector
        if (href && href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Animate Stats Counter
const stats = document.querySelectorAll('.stat-item h2');
const statsSection = document.querySelector('.stats');

function animateStats() {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        const updateCount = () => {
            count += increment;
            if (count < target) {
                stat.textContent = Math.floor(count) + '+';
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + '+';
            }
        };

        updateCount();
    });
}

// Intersection Observer for Stats Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });



// Map Integration (using Leaflet.js)
function initMap() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;

    // Create map
    const map = L.map(mapContainer).setView([-8.7832, 34.5085], 4); // Center on Africa

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for countries of operation
    const countries = [
        { name: 'Uganda', lat: 1.3733, lng: 32.2903 },
        { name: 'Kenya', lat: -0.0236, lng: 37.9062 },
        { name: 'Tanzania', lat: -6.3690, lng: 34.8888 },
        { name: 'Rwanda', lat: -1.9403, lng: 29.8739 },
        { name: 'Malawi', lat: -13.2543, lng: 34.3015 },
        { name: 'South Africa', lat: -30.5595, lng: 22.9375 }
    ];

    countries.forEach(country => {
        L.marker([country.lat, country.lng])
            .addTo(map)
            .bindPopup(country.name)
            .openPopup();
    });
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initMap);

// Form Validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add form validation logic here
    });
});

// Newsletter Signup
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        // Add newsletter signup logic here
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    });
}

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Initialize GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Header scroll effect
        const header = document.querySelector('.header');
        const heroSection = document.querySelector('.hero');
        
        // Add transparent class initially
        if (header) header.classList.add('transparent');
        
        // Handle scroll event
        window.addEventListener('scroll', function() {
            if (heroSection && window.scrollY > heroSection.offsetHeight * 0.5) {
                header.classList.remove('transparent');
                header.classList.add('scrolled');
            } else {
                header.classList.add('transparent');
                header.classList.remove('scrolled');
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                // Check if href is not just "#" and is a valid selector
                if (href && href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: {
                                y: target,
                                offsetY: 70
                            },
                            ease: "power2.inOut"
                        });
                    }
                }
            });
        });

        // Hero section animations
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.from('.hero-content', {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: "power2.out"
            });
        }

        // Stats section animations
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            gsap.from('.stat-item', {
                scrollTrigger: {
                    trigger: '.stats',
                    start: 'top center',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: "power2.out"
            });
        }

        // Program cards animations


        // Testimonials animations
        const testimonialsSection = document.querySelector('.testimonials');
        if (testimonialsSection) {
            gsap.from('.testimonial', {
                scrollTrigger: {
                    trigger: '.testimonials',
                    start: 'top center',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: "power2.out"
            });
        }

        // News cards animations
        const newsSection = document.querySelector('.news');
        if (newsSection) {
            gsap.from('.news-card', {
                scrollTrigger: {
                    trigger: '.news',
                    start: 'top center',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    } else {
        console.warn('GSAP not loaded - animations will be disabled');
    }

    // Initialize Africa map
    const mapContainer = document.getElementById('africa-map');
    if (mapContainer) {
        // Add your map initialization code here
        // For example, using a library like Leaflet or Google Maps
    }

    // Add hover effects to program cards
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1.05,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            gsap.to('.loading-screen', {
                duration: 0.5,
                opacity: 0,
                onComplete: () => {
                    if (loadingScreen) {
                        loadingScreen.style.display = 'none';
                    }
                }
            });
        }
    });

    // Smooth Scroll Functionality
    const scrollDown = document.querySelector('.scroll-down');
    
    if (scrollDown) {
        scrollDown.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    }

    // Gallery functionality
    const galleryGrid = document.querySelector('.gallery-grid');
    const progressBar = document.querySelector('.progress-bar');
    const dots = document.querySelectorAll('.dot');
    const items = document.querySelectorAll('.gallery-item');
    
    // Only initialize gallery functionality if all required elements exist
    if (galleryGrid && progressBar && dots.length > 0 && items.length > 0) {
        let currentIndex = 0;

        // Update progress and dots based on scroll position
        function updateProgress() {
            const scrollPosition = galleryGrid.scrollLeft;
            const maxScroll = galleryGrid.scrollWidth - galleryGrid.clientWidth;
            const progress = (scrollPosition / maxScroll) * 100;
            progressBar.style.width = `${progress}%`;

            // Update active dot
            const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
            currentIndex = Math.round(scrollPosition / itemWidth);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Scroll to item when dot is clicked
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
                galleryGrid.scrollTo({
                    left: itemWidth * index,
                    behavior: 'smooth'
                });
            });
        });

        // Update progress bar and dots on scroll
        galleryGrid.addEventListener('scroll', () => {
            requestAnimationFrame(updateProgress);
        });

        // Initial update
        updateProgress();
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

    // About Hero Section Animation
    const heroContent = document.querySelector('.about-hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const hero = document.querySelector('.about-hero');
    
    // Add active class to trigger animation
    setTimeout(() => {
        if (heroContent) {
            heroContent.classList.add('active');
        }
        if (scrollIndicator) {
            scrollIndicator.classList.add('active');
        }
    }, 300);

    // Enhanced parallax effect
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollPosition = window.scrollY;
                
                if (hero) {
                    // Smooth parallax effect with easing
                    const speed = 0.5;
                    const yPos = -(scrollPosition * speed);
                    hero.style.backgroundPositionY = `${yPos}px`;
                    
                    // Fade out scroll indicator when scrolling down
                    if (scrollPosition > lastScroll && scrollIndicator) {
                        scrollIndicator.style.opacity = '0';
                    } else if (scrollIndicator) {
                        scrollIndicator.style.opacity = '1';
                    }
                    
                    // Add subtle scale effect to background
                    const scale = 1 + (scrollPosition * 0.0001);
                    hero.style.transform = `scale(${scale})`;
                }
                
                lastScroll = scrollPosition;
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Mouse move parallax effect
    if (hero) {
        hero.addEventListener('mousemove', function(e) {
            const { clientX, clientY } = e;
            const { width, height } = hero.getBoundingClientRect();
            
            const x = (clientX / width - 0.5) * 20;
            const y = (clientY / height - 0.5) * 20;
            
            hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
        
        hero.addEventListener('mouseleave', function() {
            hero.style.transform = 'translate3d(0, 0, 0)';
        });
    }

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        function handleFAQClick(item) {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        }

        // Add click event listeners
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => handleFAQClick(item));
            }
        });

        // Add keyboard navigation
        function addKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    const activeIndex = Array.from(faqItems).findIndex(item => item.classList.contains('active'));
                    let nextIndex;

                    if (e.key === 'ArrowDown') {
                        nextIndex = (activeIndex + 1) % faqItems.length;
                    } else {
                        nextIndex = (activeIndex - 1 + faqItems.length) % faqItems.length;
                    }

                    handleFAQClick(faqItems[nextIndex]);
                }
            });
        }

        addKeyboardNavigation();
    }

    
}); 