document.addEventListener('DOMContentLoaded', () => {
    // Inject Header
    const headerPlaceholder = document.getElementById('layout-header');
    if (headerPlaceholder && window.HeaderComponent) {
        headerPlaceholder.innerHTML = window.HeaderComponent;
        
        // Re-initialize hamburger menu after injection
        if (typeof initHamburgerMenu === 'function') {
            initHamburgerMenu();
        }
        if (typeof updateActiveNav === 'function') {
            updateActiveNav();
        }
    }

    // Inject Footer
    const footerPlaceholder = document.getElementById('layout-footer');
    if (footerPlaceholder && window.FooterComponent) {
        footerPlaceholder.innerHTML = window.FooterComponent;
    }
});
