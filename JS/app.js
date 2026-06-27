// Toggle navigation menu memory
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
});

// ========================================
// STEP 6: APP CONTROLLER
// ========================================

// ===== STATE =====
const STATE = {
    currentPage: '/',
    buildings: [],
    user: null
};

// ===== ROUTER =====
function navigate(path) {
    // Update URL
    window.location.hash = path;
    // Render the page
    renderPage(path);
}

function renderPage(path) {
    // Store current page
    STATE.currentPage = path;
    
    // Get the main container
    const container = document.getElementById('main-content');
    
    // Remove leading slash for routing
    const route = path.replace(/^\//, '') || 'home';
    
    // Route to the right page
    switch(route) {
        case 'home':
        case '':
            renderHome(container);
            break;
        case 'map':
            renderMap(container);
            break;
        case 'buildings':
            const id = getQueryParam('id');
            if (id) {
                renderBuildingDetail(container, id);
            } else {
                renderHome(container);
            }
            break;
        case 'login':
            renderLogin(container);
            break;
        case 'search':
            const query = getQueryParam('q');
            renderSearch(container, query);
            break;
        default:
            // 404 - show home for now
            renderHome(container);
    }
}

// ===== HELPER FUNCTIONS =====
function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

// ===== INITIALIZATION =====
// Listen for URL changes (back/forward buttons)
window.addEventListener('hashchange', () => {
    const path = window.location.hash.slice(1) || '/';
    renderPage(path);
});

// Start the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.hash.slice(1) || '/';
    renderPage(path);
    
    // Highlight active nav link
    updateActiveNav();
});

function updateActiveNav() {
    const currentPath = STATE.currentPage;
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${currentPath}`);
    });
}