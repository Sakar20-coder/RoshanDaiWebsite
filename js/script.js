document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
});


// LOAD HEADER AND FOOTER
async function loadComponents() {

    const header = document.getElementById("header");
    const footer = document.getElementById("footer");

    try {

        // Detect correct path depending on page location
        let path = "";

        if (window.location.pathname.includes("/services/") || 
            window.location.pathname.includes("/Pages/")) {
            path = "../";
        }

        if (header) {
            const res = await fetch(path + "components/header.html");
            const data = await res.text();
            header.innerHTML = data;
        }

        if (footer) {
            const res = await fetch(path + "components/footer.html");
            const data = await res.text();
            footer.innerHTML = data;
        }

        initializeNavbar();
        initializeMobileDropdown();

    } catch (error) {
        console.error("Component loading error:", error);
    }

}



// NAVBAR FUNCTION
function initializeNavbar() {

    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const navbar = document.getElementById("navbar");

    if (!hamburger || !mobileMenu) return;

    // Toggle menu
    hamburger.addEventListener("click", () => {

        mobileMenu.classList.toggle("active");
        hamburger.classList.toggle("active");

        if (mobileMenu.classList.contains("active")) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

    });


    // Close menu when link clicked
    const links = document.querySelectorAll(".mobile-menu a");

    links.forEach(link => {
        link.addEventListener("click", () => {

            mobileMenu.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.classList.remove("no-scroll");

        });
    });


    // Close menu when clicking outside
    document.addEventListener("click", (e) => {

        if (
            mobileMenu.classList.contains("active") &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {

            mobileMenu.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.classList.remove("no-scroll");

        }

    });


    // Navbar scroll effect
    if (navbar) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        });

    }

}


// MOBILE DROPDOWN TOGGLE
function initializeMobileDropdown() {

    const menus = document.querySelectorAll(".mobile-dropdown > a");

    menus.forEach(menu => {

        menu.addEventListener("click", e => {

            e.preventDefault();
            menu.parentElement.classList.toggle("active");

        });

    });

}
