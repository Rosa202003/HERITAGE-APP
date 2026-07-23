document.addEventListener("DOMContentLoaded", () => {
    // Inject Header
    const headerContainer = document.getElementById("layout-header");
    if (headerContainer && window.headerHtml) {
        headerContainer.innerHTML = window.headerHtml;
    }

    // Inject Footer
    const footerContainer = document.getElementById("layout-footer");
    if (footerContainer && window.footerHtml) {
        footerContainer.innerHTML = window.footerHtml;
    }

    // Initialize Hamburger Menu immediately
    initGlobalHamburger();

    // Sync Header Auth State
    syncHeaderAuthState();

    // Highlight active nav link
    highlightActiveNavLink();
});

function initGlobalHamburger() {
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("nav-menu");

    if (!menuToggle || !menu) return;

    // Clone to remove stale listeners
    const newToggle = menuToggle.cloneNode(true);
    if (menuToggle.parentNode) {
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
    }

    newToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle("open");
        newToggle.classList.toggle("open", isOpen);
        newToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menu.classList.remove("open");
            newToggle.classList.remove("open");
            newToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (e) => {
        if (menu.classList.contains("open") && !menu.contains(e.target) && !newToggle.contains(e.target)) {
            menu.classList.remove("open");
            newToggle.classList.remove("open");
            newToggle.setAttribute("aria-expanded", "false");
        }
    });
}

function syncHeaderAuthState() {
    const authContainer = document.getElementById("nav-auth-container");
    if (!authContainer) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
        if (user.role === "officer") {
            authContainer.innerHTML = `
                <a href="officer.html" style="font-weight: 600; color: var(--gold) !important;">
                    Officer Portal
                </a>
            `;
        } else {
            authContainer.innerHTML = `
                <a href="#" onclick="localStorage.clear(); window.location.reload(); return false;" style="font-weight: 600; color: var(--accent) !important;">
                    Sign Out (${user.full_name ? user.full_name.split(' ')[0] : 'User'})
                </a>
            `;
        }
    } else {
        authContainer.innerHTML = `
            <a href="login.html" style="font-weight: 600; color: var(--gold) !important;">
                Sign In
            </a>
        `;
    }
}

function highlightActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}
