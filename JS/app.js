const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
});