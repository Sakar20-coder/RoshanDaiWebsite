document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
});

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
        setupContactLinks();

    } catch (error) {
        console.error("Error loading components:", error);
    }
}

// SIMPLE CONTACT LINK HANDLER
function setupContactLinks() {
    // Find all contact links
    const contactLinks = document.querySelectorAll('a[href="/Pages/index.html#contact"]');

    contactLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Check if we're on the homepage
            if (window.location.pathname === '/' ||
                window.location.pathname.includes('index.html') ||
                window.location.pathname.endsWith('/Pages/')) {

                // Just scroll to contact section
                const contact = document.getElementById('contact');
                if (contact) {
                    contact.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Go to homepage with contact anchor
                window.location.href = '/Pages/index.html#contact';
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