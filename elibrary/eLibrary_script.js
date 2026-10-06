document.addEventListener('DOMContentLoaded', function() {
    // Initialize PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const bookCards = document.querySelectorAll('.book-card');
    const orderForm = document.getElementById('orderForm');
    const modal = document.getElementById('pdfModal');
    const closeBtn = document.querySelector('.close');
    const pdfViewer = document.getElementById('pdfViewer');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    let currentPDF = null;
    let currentPage = 1;
    let totalPages = 0;
    let isMobile = window.innerWidth <= 768;
    let touchStartX = 0;
    let touchEndX = 0;

    // Handle window resize
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth <= 768;
    });

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        bookCards.forEach(card => {
            const title = card.querySelector('.book-title').textContent.toLowerCase();
            const author = card.querySelector('.book-author').textContent.toLowerCase();
            const description = card.querySelector('.book-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || 
                author.includes(searchTerm) || 
                description.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Form submission
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            bookTitle: document.getElementById('bookTitle').value,
            message: document.getElementById('message').value
        };

        try {
            // Replace with your actual API endpoint
            const response = await fetch('your-api-endpoint/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Order submitted successfully!');
                orderForm.reset();
            } else {
                throw new Error('Failed to submit order');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit order. Please try again.');
        }
    });

    // PDF Viewer Functions
    window.openPDF = async function(pdfUrl) {
        try {
            // Show loading indicator
            pdfViewer.innerHTML = '<div class="pdf-loading"></div>';
            modal.style.display = 'block';

            currentPDF = await pdfjsLib.getDocument(pdfUrl).promise;
            totalPages = currentPDF.numPages;
            totalPagesSpan.textContent = totalPages;
            currentPage = 1;
            currentPageSpan.textContent = currentPage;
            await renderPage(currentPage);
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Failed to load PDF. Please try again.');
            modal.style.display = 'none';
        }
    };

    async function renderPage(pageNumber) {
        try {
            const page = await currentPDF.getPage(pageNumber);
            const viewport = page.getViewport({ 
                scale: isMobile ? 1.2 : 1.5 
            });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            pdfViewer.innerHTML = '';
            pdfViewer.appendChild(canvas);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            currentPageSpan.textContent = pageNumber;
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    }

    // Touch events for mobile PDF navigation
    pdfViewer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    pdfViewer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && currentPage > 1) {
                // Swipe right - previous page
                currentPage--;
                renderPage(currentPage);
            } else if (swipeDistance < 0 && currentPage < totalPages) {
                // Swipe left - next page
                currentPage++;
                renderPage(currentPage);
            }
        }
    }

    // Event Listeners for PDF Viewer
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        currentPDF = null;
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            currentPDF = null;
        }
    });

    prevPageBtn.addEventListener('click', function() {
        if (currentPDF && currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', function() {
        if (currentPDF && currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    // Add smooth scroll to book cards
    bookCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            this.scrollIntoView({ behavior: 'smooth' });
        });
    });
}); 

function sendMail() {
    let params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        bookTitle: document.getElementById("bookTitle").value,
        message: document.getElementById("message").value
    };

    emailjs.send("service_rvcrjdw", "template_x9q685j", params).then(alert("Book order sent successfully!"))
}
