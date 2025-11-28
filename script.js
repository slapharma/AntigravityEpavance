document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Accordion Functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = header.nextElementSibling;

            // Close other items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-body').style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = null;
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .feature-card');

    animatedElements.forEach(el => {
        // Add a base class for initial state if not present (optional, handled in CSS)
        observer.observe(el);
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
