document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const mobileToggleIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');

        if (nav.classList.contains('active')) {
            mobileToggleIcon.classList.replace('ph-list', 'ph-x');
        } else {
            mobileToggleIcon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Close mobile menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileToggleIcon.classList.replace('ph-x', 'ph-list');
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active state on nav links depending on scroll position
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // adjustment for header height and trigger point
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // =========================================
    // Accessibility Mode (Visually Impaired)
    // =========================================
    const accessibilityToggle = document.getElementById('accessibility-toggle');

    // Check local storage for preference
    if (localStorage.getItem('accessibilityMode') === 'true') {
        document.body.classList.add('is-accessible');
    }

    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('click', () => {
            document.body.classList.toggle('is-accessible');
            const isAccessible = document.body.classList.contains('is-accessible');
            localStorage.setItem('accessibilityMode', isAccessible);
        });
    }

    // =========================================
    // Lightbox Gallery Logic
    // =========================================
    const certData = {
        'oks': Array.from({ length: 13 }, (_, i) => `img/cert/oks/${i + 1}.webp`),
        'lupa': Array.from({ length: 8 }, (_, i) => `img/cert/lupa/l${i + 1}.webp`),
        'license': ['img/cert/license.png'],
        'sanepid': ['img/cert/license2.jpg', 'img/cert/license3.jpg'],
        'reestr': Array.from({ length: 5 }, (_, i) => i === 0 ? `img/cert/reestr.png` : `img/cert/reestr${i + 1}.png`)
    };

    let currentGallery = [];
    let currentIndex = 0;

    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');

    const certBtns = document.querySelectorAll('.cert-btn, .gallery-trigger');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // Open Lightbox
    certBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const doctorKey = btn.getAttribute('data-doctor') || btn.getAttribute('data-gallery');
            if (certData[doctorKey]) {
                currentGallery = certData[doctorKey];
                currentIndex = 0;
                updateLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Update Image
    function updateLightboxImage() {
        if (currentGallery.length > 0) {
            // Lazy load by setting src only when needed
            lightboxImg.src = currentGallery[currentIndex];
            lightboxCurrent.textContent = currentIndex + 1;
            lightboxTotal.textContent = currentGallery.length;
        }
    }

    // Navigation
    function nextImage() {
        if (currentGallery.length > 0) {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightboxImage();
        }
    }

    function prevImage() {
        if (currentGallery.length > 0) {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightboxImage();
        }
    }

    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Close Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // Clear src to prevent keeping the image loaded when hidden
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-image-container')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});
