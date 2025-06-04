// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth Scrolling for Navigation Links
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

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Helper function to get translated text
function getText(key) {
    if (window.languageManager) {
        return window.languageManager.getText(key);
    }
    // Fallback to Turkish if language manager not loaded yet
    return translations?.tr?.[key] || key;
}

// Form Handling - Booking Form
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const service = formData.get('service');
        const location = formData.get('location');
        const date = formData.get('date');
        const time = formData.get('time');
        
        // Validate form
        if (!service || !location || !date || !time) {
            showNotification(getText('notification_fill_all'), 'error');
            return;
        }
        
        // Check if date is in the future
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification(getText('notification_future_date'), 'error');
            return;
        }
        
        // Simulate booking process
        showNotification(getText('notification_processing'), 'info');
        
        // Simulate API call
        setTimeout(() => {
            showNotification(getText('notification_success'), 'success');
            
            // Simulate redirect to payment
            setTimeout(() => {
                // Here you would integrate with PayTR payment gateway
                const serviceText = getServiceName(service);
                const locationText = getLocationName(location);
                alert(`PayTR ${getText('notification_processing')}\n\n${getText('form_service_label')}: ${serviceText}\n${getText('form_location_label')}: ${locationText}\n${getText('form_date_label')}: ${date}\n${getText('form_time_label')}: ${time}`);
            }, 2000);
        }, 1500);
    });
}

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            showNotification(getText('notification_fill_all'), 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification(getText('notification_valid_email'), 'error');
            return;
        }
        
        showNotification(getText('notification_message_sending'), 'info');
        
        // Simulate sending message
        setTimeout(() => {
            showNotification(getText('notification_message_sent'), 'success');
            this.reset();
        }, 1500);
    });
}

// Set minimum date for booking form
const dateInput = document.querySelector('#date');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
}

// Utility Functions
function getServiceName(serviceCode) {
    const serviceKeys = {
        'haircut': 'form_service_haircut',
        'coloring': 'form_service_coloring',
        'skincare': 'form_service_skincare',
        'makeup': 'form_service_makeup',
        'manicure': 'form_service_manicure',
        'bridal': 'form_service_bridal'
    };
    
    const key = serviceKeys[serviceCode];
    return key ? getText(key) : serviceCode;
}

function getLocationName(locationCode) {
    const locationKeys = {
        'istanbul': 'form_location_istanbul',
        'ankara': 'form_location_ankara',
        'izmir': 'form_location_izmir',
        'antalya': 'form_location_antalya',
        'bursa': 'form_location_bursa'
    };
    
    const key = locationKeys[locationCode];
    return key ? getText(key) : locationCode;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Check if RTL
    const isRTL = document.body.classList.contains('rtl');
    
    notification.innerHTML = `
        <div class="notification-content" style="direction: ${isRTL ? 'rtl' : 'ltr'}">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    const position = isRTL ? 'left: 20px;' : 'right: 20px;';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        ${position}
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: ${isRTL ? 'slideInLeft' : 'slideInRight'} 0.3s ease-out;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = `${isRTL ? 'slideOutLeft' : 'slideOutRight'} 0.3s ease-out`;
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Manual close
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = `${isRTL ? 'slideOutLeft' : 'slideOutRight'} 0.3s ease-out`;
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'info': 'fa-info-circle',
        'warning': 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#3498db',
        'warning': '#f39c12'
    };
    return colors[type] || '#3498db';
}

// Add notification animations to head
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutLeft {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        margin-left: auto;
        padding: 0;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    /* RTL Notification styles */
    body.rtl .notification-content {
        flex-direction: row-reverse;
    }
    
    body.rtl .notification-close {
        margin-left: 0;
        margin-right: auto;
    }
`;
document.head.appendChild(style);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .feature-card, .step, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// Add fadeInUp animation
const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInUpStyle);

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString() + '+';
        }
    }, 16);
}

// Animate counters when in view
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent.replace(/[^\d]/g, ''));
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
});

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Load Google Maps (if needed for contact section)
function initMap() {
    // This would be used if you want to add a Google Map
    // For now, it's just a placeholder
    console.log('Map initialization placeholder');
}

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Update form placeholders when language changes
document.addEventListener('DOMContentLoaded', () => {
    // Listen for language changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                updateFormPlaceholders();
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });
});

function updateFormPlaceholders() {
    // This function will be called when language changes
    // The translation system already handles placeholders
    // This is here for any additional form processing if needed
    console.log('Form placeholders updated for language:', document.documentElement.lang);
} 