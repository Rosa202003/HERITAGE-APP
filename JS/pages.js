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


// ========================================
// RENDER ALL BUILDINGS PAGE
// ========================================

async function renderAllBuildings(container) {
    console.log('📋 Loading all buildings...');

    try {
        let buildings = [];
        if (typeof API !== 'undefined' && API.getBuildings) {
            buildings = await API.getBuildings();
        } else if (typeof MOCK_BUILDINGS !== 'undefined') {
            buildings = MOCK_BUILDINGS;
        }

        if (!buildings || buildings.length === 0) {
            container.innerHTML = `
                <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                    <h2 style="font-family:var(--font-display);">📋 No Buildings Found</h2>
                    <p style="color:var(--text-muted);margin:16px 0;">Add some buildings to get started.</p>
                    <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="buildings-page">
                <!-- Page Header -->
                <div class="page-header">
                    <div>
                        <h1>🏛️ Heritage Building Inventory</h1>
                        <p class="subtitle">Complete georeferenced records of all listed and proposed heritage structures.</p>
                    </div>
                    <div class="results-count" id="results-count">${buildings.length} results</div>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <input 
                        type="text" 
                        class="search-input" 
                        id="search-input"
                        placeholder="Search buildings by name, era, or location..."
                        oninput="filterBuildings()"
                    >
                    <div class="filter-group">
                        <button class="filter-btn active" data-filter="all" onclick="setFilter('all')">All</button>
                        <button class="filter-btn" data-filter="good" onclick="setFilter('good')">Good</button>
                        <button class="filter-btn" data-filter="fair" onclick="setFilter('fair')">Fair</button>
                        <button class="filter-btn" data-filter="poor" onclick="setFilter('poor')">Poor</button>
                        <button class="filter-btn" data-filter="at-risk" onclick="setFilter('at-risk')">At Risk</button>
                    </div>
                    <div class="filter-group">
                        <button class="filter-btn" data-filter="german" onclick="setFilter('german')">German</button>
                        <button class="filter-btn" data-filter="british" onclick="setFilter('british')">British</button>
                        <button class="filter-btn" data-filter="independence" onclick="setFilter('independence')">Independence</button>
                    </div>
                </div>

                <!-- Building Grid -->
                <div class="building-grid" id="building-grid">
                    <!-- Dynamically loaded -->
                </div>
            </div>
        `;

        // Store buildings data globally for filter functions
        window._buildingsData = buildings;
        window._currentFilter = 'all';
        window._currentSearch = '';

        // Initial render
        renderBuildingCards();

    } catch (error) {
        console.error('❌ Error loading buildings:', error);
        container.innerHTML = `
            <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                <h2 style="font-family:var(--font-display);">❌ Error Loading Buildings</h2>
                <p style="color:var(--text-muted);margin:16px 0;">Please try again later.</p>
                <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
            </div>
        `;
    }
}