// --- YouTube Demo Modal Logic ---
const demoModal = document.getElementById('demo-modal');
const demoBtn = document.getElementById('watch-demo-btn');
const closeDemoBtn = document.getElementById('close-demo-modal');
const demoIframe = document.getElementById('demo-video-frame');

if (demoBtn && demoModal && closeDemoBtn && demoIframe) {
    const YOUTUBE_URL = 'https://www.youtube.com/embed/1Q8fG0TtVAY'; // Replace with your video
    demoBtn.addEventListener('click', function() {
        demoIframe.src = YOUTUBE_URL + '?autoplay=1';
        demoModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    });
    closeDemoBtn.addEventListener('click', function() {
        demoModal.classList.add('hidden');
        demoIframe.src = '';
        document.body.classList.remove('overflow-hidden');
    });
    // Close modal when clicking outside the modal content
    demoModal.addEventListener('click', function(e) {
        if (e.target === demoModal) {
            demoModal.classList.add('hidden');
            demoIframe.src = '';
            document.body.classList.remove('overflow-hidden');
        }
    });
}

// --- Start Calculating Button Scroll (robust) ---
window.addEventListener('DOMContentLoaded', function() {
    // Start Calculating button
    const startCalcBtn = document.getElementById('start-calculating-btn');
    if (startCalcBtn) {
        startCalcBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const toolsSection = document.querySelector('section.py-20.bg-white/50, section.bg-white/50');
            if (toolsSection) {
                toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Nav: Home, Logo, Tools/All Tools links (header & footer)
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        // Intercept Home, Logo, Tools, All Tools links
        if (
            href && (
                href === 'index.html' ||
                href.toLowerCase().includes('all tool') ||
                href.toLowerCase() === 'tools' ||
                link.classList.contains('flex-shrink-0') // logo link
            )
        ) {
            link.addEventListener('click', function(e) {
                // Only intercept if on homepage
                if (
                    window.location.pathname.endsWith('index.html') ||
                    window.location.pathname === '/' ||
                    window.location.pathname === '/index.html'
                ) {
                    e.preventDefault();
                    // Home/Logo scroll to top, Tools/All Tools scroll to tools section
                    if (
                        href === 'index.html' ||
                        link.classList.contains('flex-shrink-0')
                    ) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        const toolsSection = document.querySelector('section.py-20.bg-white/50, section.bg-white/50');
                        if (toolsSection) {
                            toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }
                }
            });
        }
    });
});
// CodeByTanjil - Main JS for all interactive features

// Mobile menu toggle
globalThis.toggleMobileMenu = function() {
    const navMenu = document.getElementById('nav-menu');
    const button = document.querySelector('[onclick="toggleMobileMenu()"]');
    const lines = button.querySelectorAll('.hamburger-line');
    navMenu.classList.toggle('hidden');
    if (navMenu.classList.contains('hidden')) {
        lines[0].style.transform = 'rotate(0deg)';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'rotate(0deg)';
        button.setAttribute('aria-expanded', 'false');
    } else {
        lines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        button.setAttribute('aria-expanded', 'true');
    }
};

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('nav-menu');
    const button = document.querySelector('[onclick="toggleMobileMenu()"]');
    if (!navMenu.contains(event.target) && !button.contains(event.target)) {
        navMenu.classList.add('hidden');
        const lines = button.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'rotate(0deg)';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'rotate(0deg)';
        button.setAttribute('aria-expanded', 'false');
    }
});

// Back to top button
window.addEventListener('scroll', function() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;
    if (window.scrollY > 500) {
        backToTop.classList.remove('opacity-0', 'invisible');
        backToTop.classList.add('opacity-100', 'visible');
    } else {
        backToTop.classList.add('opacity-0', 'invisible');
        backToTop.classList.remove('opacity-100', 'visible');
    }
});

const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth scrolling for anchor links (but NOT for links to index.html or All Tools)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Prevent navigation for "Tools" and "All Tools" links if on index.html, scroll to tools section instead
document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    // Only intercept nav menu links, not all links
    if (href && (href === 'index.html' || href.toLowerCase().includes('all tool'))) {
        link.addEventListener('click', function(e) {
            // Only intercept if we're already on the homepage and the link is in the nav menu
            const navMenu = document.getElementById('nav-menu');
            if ((window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html') && (this.closest('#nav-menu') || this.classList.contains('nav-item'))) {
                e.preventDefault();
                // Try to scroll to the main tools grid section
                const toolsSection = document.querySelector('section.py-20.bg-white\/50, section.bg-white\/50');
                if (toolsSection) {
                    toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // fallback: scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);
document.querySelectorAll('.card-hover-effect, section').forEach(el => {
    observer.observe(el);
});

// Performance optimization: Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
} else {
    // Fallback for older browsers
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Newsletter form handling (if present)
document.querySelectorAll('button, input[type="submit"]').forEach(btn => {
    if (btn.textContent.trim().toLowerCase().includes('subscribe')) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.querySelector('input[type="email"]');
            if (email && email.value) {
                this.innerHTML = '<div class="loading-spinner"></div>';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check mr-2"></i>Subscribed!';
                    this.classList.add('bg-green-500', 'hover:bg-green-600');
                    this.classList.remove('bg-white', 'hover:bg-gray-100');
                }, 1000);
            }
        });
    }
});

// Console branding
console.log('%c CodeByTanjil ', 'background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 10px 20px; border-radius: 10px; font-size: 16px; font-weight: bold;');
console.log('%c Professional Tools & Calculators | Made with ❤️ by Tanjil ', 'color: #666; font-size: 12px;');
