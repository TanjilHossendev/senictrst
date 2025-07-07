// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.querySelector('[aria-controls="mobile-menu"]');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    menu.classList.toggle('hidden');
    button.setAttribute('aria-expanded', !isExpanded);
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobile-menu');
    const button = document.querySelector('[aria-controls="mobile-menu"]');
    
    if (!menu.contains(e.target) && !button.contains(e.target) && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menu = document.getElementById('mobile-menu');
        const button = document.querySelector('[aria-controls="mobile-menu"]');
        
        menu.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
    }
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-section').forEach((element) => {
    observer.observe(element);
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Form validation
    const validateField = (field) => {
        const errorElement = field.parentElement.querySelector('.form-error');
        let isValid = true;

        if (field.required && !field.value.trim()) {
            errorElement.textContent = `Please enter your ${field.name}`;
            errorElement.classList.remove('hidden');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.classList.remove('hidden');
            isValid = false;
        } else {
            errorElement.classList.add('hidden');
        }

        // Add/remove validation styles
        if (isValid) {
            field.classList.remove('border-red-500');
            field.classList.add('border-green-500');
        } else {
            field.classList.remove('border-green-500');
            field.classList.add('border-red-500');
        }

        return isValid;
    };

    // Email validation
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('border-red-500')) {
                validateField(field);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const fields = form.querySelectorAll('input, textarea');
        let isValid = true;
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonContent = submitButton.innerHTML;

        try {
            // Disable form and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
            `;
            
            // Here you would typically send the form data to your server
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
            
            // Show success message
            form.reset();
            fields.forEach(field => {
                field.classList.remove('border-green-500', 'border-red-500');
            });
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.remove('hidden');
            successMessage.classList.add('animate-fade-in-up');

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent;
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
