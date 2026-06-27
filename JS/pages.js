// ========================================
// HERO SECTION - Dynamic Version
// ========================================

async function renderHome(container) {
    const buildings = await API.getBuildings();
    const stats = await API.getStats();
    
    const html = `
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title">
                        Explore Dar es Salaam's<br>
                        <span class="hero-highlight">Heritage Buildings</span>
                    </h1>
                    <p class="hero-subtitle">
                        Discover ${stats.totalBuildings} historic buildings across the city.
                        <br>Preserving Tanzania's architectural legacy.
                    </p>
                    
                    <div class="hero-search">
                        <input 
                            type="text" 
                            placeholder="Search for a building..." 
                            class="hero-search-input"
                            id="hero-search-input"
                            onkeypress="if(event.key === 'Enter') handleHeroSearch()"
                        >
                        <button class="hero-search-btn" onclick="handleHeroSearch()">
                             Search
                        </button>
                    </div>
                    
                    <div class="hero-actions">
                        <button class="btn-primary hero-btn" onclick="navigate('/map')">
                            Explore Map
                        </button>
                        <button class="btn-secondary hero-btn" onclick="scrollToFeatured()">
                            View Featured
                        </button>
                    </div>
                </div>
                
                <div class="hero-image">
                    <div class="hero-image-placeholder">
                        
                    </div>
                </div>
            </div>
            
            <div class="hero-stats">
                <div class="stat-item">
                    <span class="stat-number">${stats.totalBuildings}</span>
                    <span class="stat-label">Buildings Listed</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.virtualTours}</span>
                    <span class="stat-label">Virtual Tours</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.eras}</span>
                    <span class="stat-label">Eras</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.officers}</span>
                    <span class="stat-label">Officers</span>
                </div>
            </div>
        </section>
        
        <!-- Rest of your page... -->
    `;
    
    container.innerHTML = html;
}

// ========================================
// HERO FUNCTIONS
// ========================================

function handleHeroSearch() {
    const input = document.getElementById('hero-search-input');
    const query = input.value.trim();
    
    if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
        input.style.borderColor = '#ff6b6b';
        input.placeholder = 'Please enter a search term';
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder = 'Search for a building...';
        }, 2000);
    }
}

function scrollToFeatured() {
    const featuredSection = document.querySelector('.featured-section');
    if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
}