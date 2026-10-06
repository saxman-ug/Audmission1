document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const backgrounds = [
        {
            image: 'url(images/hero1.JPG)',
            title: 'Welcome to Africa United for Discipleship and Missions',
            description: 'Join us in spreading the word of God and making a difference in our community.',
            verse: 'Jeremiah 29:11',
            primaryButton: { text: 'Join Us', link: 'contact.html' },
            secondaryButton: { text: 'Learn More', link: 'about.html' }
        },
        {
            image: 'url(images/hero2.jpg)',
            title: 'Growing Together in Faith',
            description: 'Experience the power of community and spiritual growth in our weekly gatherings.',
            verse: 'Matthew 18:20',
            primaryButton: { text: 'Our Services', link: 'programs.html' },
            secondaryButton: { text: 'Outreach', link: 'outreach.html' }
        },
        {
            image: 'url(images/hero5.jpg)',
            title: 'Serving with Purpose',
            description: 'Discover how you can make a meaningful impact through our various ministry programs.',
            verse: '1 Peter 4:10',
            primaryButton: { text: 'Get Involved', link: 'programs.html' },
            secondaryButton: { text: 'Donate', link: 'donate.html' }
        }
    ];
 
    let currentIndex = 0;
    let intervalId = null;
    let isPaused = false;

    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    backgrounds.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = index;
            changeBackground();
        });
        dotsContainer.appendChild(dot);
    });
    hero.appendChild(dotsContainer);

    // Add pause on hover functionality
    hero.addEventListener('mouseenter', () => {
        isPaused = true;
        clearInterval(intervalId);
    });

    hero.addEventListener('mouseleave', () => {
        isPaused = false;
        startInterval();
    });

    function startInterval() {
        if (!isPaused) {
            intervalId = setInterval(changeBackground, 7000);
        }
    }

    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function changeBackground() {
        const current = backgrounds[currentIndex];
        
        // Add fade-out class to current content
        heroContent.classList.add('fade-out');
        
        // Wait for fade-out animation
        setTimeout(() => {
            // Update background image with smooth transition
            hero.style.backgroundImage = current.image;
            
            // Update content
            heroContent.innerHTML = `
                <h1 class="animate-in">${current.title}</h1>
                <p class="animate-in">${current.description}</p>
                <p class="verse animate-in">${current.verse}</p>
                <div class="hero-buttons animate-in">
                    <a href="${current.primaryButton.link}" class="hero-button primary">${current.primaryButton.text}</a>
                    <a href="${current.secondaryButton.link}" class="hero-button secondary">${current.secondaryButton.text}</a>
                </div>
            `;
            
            // Remove fade-out class and add fade-in
            heroContent.classList.remove('fade-out');
            heroContent.classList.add('fade-in');
            
            // Add staggered animation to elements
            const elements = heroContent.querySelectorAll('.animate-in');
            elements.forEach((el, index) => {
                el.style.animation = `fadeInUp 0.8s ease ${index * 0.15}s backwards`;
            });
            
            // Update dots
            updateDots();
            
            // Update index for next change
            currentIndex = (currentIndex + 1) % backgrounds.length;
        }, 300);
    }

    // Add touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    hero.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    hero.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                currentIndex = (currentIndex + 1) % backgrounds.length;
            } else {
                // Swipe right - previous slide
                currentIndex = (currentIndex - 1 + backgrounds.length) % backgrounds.length;
            }
            changeBackground();
        }
    }

    // Initial setup
    changeBackground();
    startInterval();
}); 