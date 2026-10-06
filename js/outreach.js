// Growth Chart
const growthChart = document.getElementById('growthChart');
if (growthChart) {
    const ctx = growthChart.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'People Reached',
                data: [100, 300, 800, 1500, 2500, 3500, 4500, 5166],
                borderColor: '#2B5797',
                backgroundColor: 'rgba(43, 87, 151, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Churches Represented',
                data: [5, 15, 40, 80, 120, 180, 220, 261],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Growth Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// impact Chart
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const mediaItems = document.querySelectorAll('.gallery-item img, .gallery-item video');

    // Add loading state to media items
    mediaItems.forEach(item => {
        item.classList.add('loading');
        item.addEventListener('load', () => {
            item.classList.remove('loading');
        });
    });

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                // Reset scroll position when switching tabs
                content.scrollTop = 0;
            });

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content with animation
            const tabId = button.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            targetContent.classList.add('active');

            // Preload media in the active tab
            const activeMedia = targetContent.querySelectorAll('img, video');
            activeMedia.forEach(media => {
                if (media.tagName === 'IMG') {
                    media.src = media.src; // Trigger image load
                } else if (media.tagName === 'VIDEO') {
                    media.load(); // Trigger video load
                }
            });
        });
    });

    // Add hover effect for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });

    // Handle video loading
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('loadeddata', () => {
            video.classList.remove('loading');
        });
    });
}); 