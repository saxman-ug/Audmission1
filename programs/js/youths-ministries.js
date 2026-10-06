// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    navContainer.insertBefore(mobileMenuBtn, navLinks);
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.appendChild(navLinks.cloneNode(true));
    document.body.appendChild(mobileMenu);
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-btn')) {
            mobileMenu.classList.remove('active');
        }
    });
});

// Collapsible sections
const initCollapsibleSections = () => {
    const sections = document.querySelectorAll('.collapsible');
    
    sections.forEach(section => {
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');
        
        header.addEventListener('click', () => {
            section.classList.toggle('active');
            content.style.maxHeight = section.classList.contains('active') 
                ? content.scrollHeight + 'px' 
                : '0';
        });
    });
};

// Initialize collapsible sections
document.addEventListener('DOMContentLoaded', initCollapsibleSections);

// Image modal functionality
// const initImageModals = () => {
//     const images = document.querySelectorAll('.modal-image');
//     images.forEach(image => {
//         image.addEventListener('click', () => {
//             const modal = document.createElement('div');
//             modal.classList.add('image-modal');
//             const modalContent = document.createElement('div');
//             modalContent.classList.add('modal-content');
//             const modalImage = document.createElement('img');
//             modalImage.src = image.src;
//             modalImage.alt = image.alt;
//             const closeBtn = document.createElement('span');
//             closeBtn.classList.add('close-modal');
//             closeBtn.innerHTML = '×';
//             modalContent.appendChild(modalImage);
//             modalContent.appendChild(closeBtn);
//             modal.appendChild(modalContent);
//             document.body.appendChild(modal);
//             // Close modal on click
//             closeBtn.addEventListener('click', () => {
//                 modal.remove();
//             });
//             // Close modal on outside click
//             modal.addEventListener('click', (e) => {
//                 if (e.target === modal) {
//                     modal.remove();
//                 }
//             });
//         });
//     });
// };
// document.addEventListener('DOMContentLoaded', initImageModals);

// Testimonial slider functionality
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let current = 0;
    let intervalId;

    function showSlide(idx) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
        current = idx;
    }

    function nextSlide() {
        let next = (current + 1) % slides.length;
        showSlide(next);
    }

    function startAutoSlide() {
        intervalId = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(intervalId);
        startAutoSlide();
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetAutoSlide();
        });
    });

    showSlide(0);
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', initTestimonialSlider); 