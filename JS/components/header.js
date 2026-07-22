const HeaderComponent = `
<header class="main-header">
  <!-- Logo Section-->
  <a class="logo" href="index.html" aria-label="Urithi Majengo home">UM</a>

  <!-- Navigation Bar -->
  <nav class="nav-container" id="nav-menu" role="navigation" aria-label="Main Navigation">
    <ul class="nav-links">
      <li><a href="index.html">Map & Records</a></li>
      <li><a href="buildings.html">All Buildings</a></li>
      <li><a href="risk.html">Report At-Risk</a></li>
      <li><a href="community.html">Community</a></li>
      <li id="nav-auth-container">
        <a href="#" onclick="if(typeof showCitizenModal === 'function') showCitizenModal(); return false;" style="font-weight: 600; color: var(--accent) !important">Sign In</a>
      </li>
    </ul>
  </nav>

  <!-- Hamburger Menu for Mobile -->
  <button class="hamburger" id="menu-toggle" aria-label="Toggle navigation">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>
</header>
`;

window.HeaderComponent = HeaderComponent;
