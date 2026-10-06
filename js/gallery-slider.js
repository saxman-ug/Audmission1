document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let visibleItems = 8; // Number of items to show initially
    let allItems = Array.from(galleryItems);
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Show all items if 'all' is selected
            if (filter === 'all') {
                galleryItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                // Hide all items first
                galleryItems.forEach(item => {
                    item.style.display = 'none';
                });
                // Show items with matching category
                galleryItems.forEach(item => {
                    if (item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    }
                });
            }
        });
    });
    
    // Hover effect for gallery items
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px)';
            item.querySelector('.gallery-overlay').style.opacity = '1';
            item.querySelector('.overlay-content').style.transform = 'translateY(0)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.querySelector('.gallery-overlay').style.opacity = '0';
            item.querySelector('.overlay-content').style.transform = 'translateY(20px)';
        });
    });
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Show next set of items
            const hiddenItems = Array.from(galleryItems).filter(item => 
                item.style.display === 'none' || 
                window.getComputedStyle(item).display === 'none'
            );

            if (hiddenItems.length > 0) {
                // Show next 4 items
                hiddenItems.slice(0, 4).forEach(item => {
                    item.style.display = 'block';
                });

                // Hide load more button if no more items to show
                if (hiddenItems.length <= 4) {
                    loadMoreBtn.style.display = 'none';
                }
            }
        });
    }
    
    // Initialize Masonry layout
    function initMasonry() {
        const masonry = document.querySelector('.gallery-masonry');
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            item.style.transition = 'all 0.4s ease';
        });
    }
    
    // Initialize the gallery
    function initializeGallery() {
        // Show initial items
        galleryItems.forEach((item, index) => {
            if (index >= visibleItems) {
                item.style.display = 'none';
            }
        });

        // Show load more button if there are more items
        if (galleryItems.length > visibleItems) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Initialize the gallery
    initMasonry();
    initializeGallery();
}); 