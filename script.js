document.addEventListener('DOMContentLoaded', function() {
    // Satellite animation on page load
    console.log('DOM loaded, starting satellite animation');
    createSatelliteAnimation();
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            console.log('Theme changed to:', newTheme);
        });
    } else {
        console.error('Theme toggle button not found');
    }

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Get modal elements
    const modal = document.getElementById('contact-modal');
    const contactLink = document.getElementById('contact-link');
    const closeBtn = document.querySelector('.close');
    const emailLink = document.querySelector('.email');
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Show modal when contact link is clicked
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Email obfuscation
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('data-email');
            if (email) {
                this.textContent = email;
                this.href = `mailto:${email}`;
                // Auto-click the mailto link after revealing
                setTimeout(() => {
                    window.location.href = `mailto:${email}`;
                }, 100);
            }
        });
    }
    
    // Navigation smooth scrolling and active state management
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href.startsWith('#')) return;
            
            e.preventDefault();
            
            // Remove active class from all nav links
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked nav link
            this.classList.add('active');
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 40;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active navigation on scroll
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Default to 'work' if no section is active
        if (!current) {
            document.querySelector('.nav-link[href="#work"]')?.classList.add('active');
        }
    }
    
    // Throttled scroll handler for better performance
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Set initial active state
    updateActiveNav();
});

// Satellite animation function
function createSatelliteAnimation() {
    console.log('createSatelliteAnimation called');
    const numSatellites = 15;
    const spacing = 50; // Reduced spacing for mobile
    
    // Find the profile section to position satellites relative to it
    const profileSection = document.querySelector('.profile-section');
    console.log('Profile section found:', profileSection);
    if (!profileSection) {
        console.error('Profile section not found!');
        return;
    }
    
    console.log('Creating', numSatellites, 'satellites');
    for (let i = 0; i < numSatellites; i++) {
        createSatellite(i, spacing, numSatellites, profileSection);
    }
}

function createSatellite(index, spacing, numSatellites, profileSection) {
    console.log('Creating satellite', index);
    const satellite = document.createElement('div');
    
    // Use only satellite emoji for consistency
    satellite.textContent = '🛰️';
    satellite.className = 'satellite';
    
    // Start satellites in a line across the top, starting further to the left
    const satelliteX = -200 + (index * spacing); // Position satellites starting from left side
    
    // Set position relative to profile section
    satellite.style.top = '-40px'; // 40px above the profile section
    satellite.style.left = satelliteX + 'px';
    satellite.style.animationDuration = '20s'; // Animation duration
    
    console.log('Satellite', index, 'positioned at:', satelliteX + 'px', 'top: -40px');
    
    // Add to profile section (not body) so it moves with content
    profileSection.appendChild(satellite);
    console.log('Satellite', index, 'added to DOM');
    
    // Remove satellite after animation completes
    setTimeout(() => {
        if (satellite.parentNode) {
            satellite.parentNode.removeChild(satellite);
            console.log('Satellite', index, 'removed from DOM');
        }
    }, 25000); // Remove after 25 seconds
}
