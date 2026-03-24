document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
    handlePageLoadHash();
    initializeSmoothScrolling();
    initScrollReveal();
    initBackToTop();
});

// SCROLL REVEAL
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    if (!revealEls.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
}

// BACK TO TOP
function initBackToTop() {
    const btt = document.getElementById("backToTop");
    if (!btt) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            btt.classList.add("show");
        } else {
            btt.classList.remove("show");
        }
    });

    btt.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// Handle hash in URL when page loads
function handlePageLoadHash() {
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}

// LOAD HEADER AND FOOTER
async function loadComponents() {
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");

    try {
        // Simple path detection
        let prefix = "";
        if (window.location.pathname.includes("/services/") ||
            window.location.pathname.includes("/Pages/")) {
            prefix = "../";
        }

        // Load header
        if (header) {
            const res = await fetch(prefix + "components/header.html");
            header.innerHTML = await res.text();
        }

        // Load footer
        if (footer) {
            const res = await fetch(prefix + "components/footer.html");
            let footerHtml = await res.text();

            // SIMPLE FIX: Replace #contact with absolute path
            footerHtml = footerHtml.replace(/href="#contact"/g, 'href="/Pages/index.html#contact"');

            footer.innerHTML = footerHtml;
        }

        // Initialize everything
        initializeNavbar();
        initializeMobileDropdown();
        setupNavigationLinks(); // Updated function
        initializeSmoothScrolling(); // Re-initialize after components load
        handlePageLoadHash(); // Check again after components load
        initScrollReveal(); // Re-run scroll reveal after DOM is ready
        initBackToTop(); // Re-initialize after footer loads

    } catch (error) {
        console.error("Error loading components:", error);
    }
}

// UPDATED: Handle both contact and services links across pages
function setupNavigationLinks() {
    // Handle Contact links
    const contactLinks = document.querySelectorAll('a[href*="#contact"]');
    const servicesLinks = document.querySelectorAll('a[href*="#services"]');

    // Function to handle cross-page navigation with scroll
    function handleCrossPageLink(e, targetId) {
        const currentPath = window.location.pathname;
        const isOnHomepage = currentPath === '/' ||
            currentPath.includes('index.html') ||
            currentPath.endsWith('/Pages/');

        if (isOnHomepage) {
            e.preventDefault();
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                history.pushState(null, null, `#${targetId}`);
            }
        }
        // If not on homepage, let the link navigate normally
    }

    contactLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            handleCrossPageLink(e, 'contact');
        });
    });

    servicesLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            handleCrossPageLink(e, 'services');
        });
    });
}

// SMOOTH SCROLLING FUNCTION for same-page links
function initializeSmoothScrolling() {
    // Handle all anchor links that start with # (same page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Get navbar height for offset
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;

                // Calculate target position with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// NORMAL NAVBAR FUNCTIONS (unchanged)
function initializeNavbar() {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const navbar = document.getElementById("navbar");

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
    });

    document.querySelectorAll(".mobile-menu a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.classList.remove("no-scroll");
        });
    });

    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        });
    }
}

function initializeMobileDropdown() {
    document.querySelectorAll(".mobile-dropdown > a").forEach(menu => {
        menu.addEventListener("click", e => {
            e.preventDefault();
            menu.parentElement.classList.toggle("active");
        });
    });
}