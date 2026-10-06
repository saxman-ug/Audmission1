// WhatsApp Button Component
document.addEventListener('DOMContentLoaded', function() {
    // Create WhatsApp button element
    const whatsappButton = document.createElement('div');
    whatsappButton.className = 'whatsapp-button';
    whatsappButton.innerHTML = `
        <a href="https://wa.me/256767632726" target="_blank" rel="noopener noreferrer" class="whatsapp-link">
            <i class="fab fa-whatsapp"></i>
            <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
        </a>
    `;

    // Add button to body
    document.body.appendChild(whatsappButton);

    // Add hover animation
    whatsappButton.addEventListener('mouseenter', function() {
        this.classList.add('hover');
    });

    whatsappButton.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
    });

    // Add click animation
    whatsappButton.addEventListener('click', function(e) {
        if (e.target.closest('.whatsapp-link')) {
            this.classList.add('click');
            setTimeout(() => {
                this.classList.remove('click');
            }, 300);
        }
    });

    // Add scroll animation
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            whatsappButton.classList.add('hide');
        } else {
            // Scrolling up
            whatsappButton.classList.remove('hide');
        }
        
        lastScroll = currentScroll;
    });
}); 