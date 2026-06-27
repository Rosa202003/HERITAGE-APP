// ========================================
// STEP 5: HOME PAGE RENDERER
// ========================================

async function renderHome(container) {
    // 1. Get data
    const buildings = await API.getBuildings();
    const stats = await API.getStats();
    
    // 2. Build HTML using template literals
    const html = `
        <!-- HERO SECTION -->
        <section style="margin-bottom: 40px;">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 48px; color: var(--terracotta); line-height: 1.2;">
                Explore Dar es Salaam's<br>Heritage Buildings
            </h1>
            <p style="font-size: 18px; color: var(--text-secondary); margin: 12px 0 20px;">
                Discover ${stats.totalBuildings} historic buildings across the city
            </p>
            
            <!-- Search Bar -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap; max-width: 600px;">
                <input 
                    type="text" 
                    placeholder="Search buildings..." 
                    id="home-search"
                    style="flex: 1; padding: 12px 20px; border: 2px solid var(--border-light); border-radius: 30px; font-size: 14px; outline: none; transition: all 0.2s;"
                    onfocus="this.style.borderColor='var(--terracotta)'"
                    onblur="this.style.borderColor='var(--border-light)'"
                >
                <button class="btn-primary" onclick="handleSearch()">
                    🔍 Search
                </button>
                <button class="btn-secondary" onclick="navigate('/map')">
                    Explore Map →
                </button>
            </div>
        </section>
        
        <!-- STATS STRIP -->
        <div class="grid-4" style="margin-bottom: 40px;">
            <div class="card" style="text-align: center; background: var(--dark-teal); color: white; border-radius: var(--radius);">
                <h2 style="font-size: 32px;">${stats.totalBuildings}</h2>
                <p style="font-size: 14px; opacity: 0.9;">Buildings Listed</p>
            </div>
            <div class="card" style="text-align: center;">
                <h2 style="font-size: 32px; color: var(--terracotta);">${stats.virtualTours}</h2>
                <p style="font-size: 14px; color: var(--text-secondary);">Virtual Tours</p>
            </div>
            <div class="card" style="text-align: center;">
                <h2 style="font-size: 32px; color: var(--dark-teal);">${stats.eras}</h2>
                <p style="font-size: 14px; color: var(--text-secondary);">Eras Represented</p>
            </div>
            <div class="card" style="text-align: center;">
                <h2 style="font-size: 32px; color: #b8860b;">${stats.officers}</h2>
                <p style="font-size: 14px; color: var(--text-secondary);">Officers Active</p>
            </div>
        </div>
        
        <!-- MAP PREVIEW -->
        <div class="card" style="margin-bottom: 40px;">
            <h3 style="margin-bottom: 12px;">📍 Interactive Map</h3>
            <div id="home-map" class="map-container"></div>
            <p style="margin-top: 12px; color: var(--text-secondary); font-size: 14px;">
                Click on markers to learn about each building
            </p>
        </div>
        
        <!-- FEATURED BUILDINGS -->
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <h3>🏛️ Featured Buildings</h3>
            <a href="#/map" style="color: var(--terracotta); text-decoration: none; font-weight: 500;">View all →</a>
        </div>
        <div class="grid-3">
            ${buildings.slice(0, 3).map(building => `
                <div class="card" onclick="navigate('/buildings?id=${building.id}')" style="cursor: pointer;">
                    <img 
                        src="${building.image}" 
                        alt="${building.name}" 
                        style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;"
                        onerror="this.src='https://via.placeholder.com/600x400/cccccc/666?text=No+Image'"
                    >
                    <h4 style="font-size: 16px; margin-bottom: 4px;">${building.name}</h4>
                    <p style="font-size: 13px; color: var(--text-secondary);">
                        ${building.era} · ${building.year}
                    </p>
                    <span class="badge badge-${building.condition.toLowerCase()}">
                        ${building.condition}
                    </span>
                    <span style="margin-left: 8px; font-size: 13px; color: var(--text-secondary);">
                        ${building.status}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
    
    // 3. Insert HTML into the container
    container.innerHTML = html;
    
    // 4. Initialize the map (after HTML is rendered)
    setTimeout(() => {
        initHomeMap(buildings);
    }, 100);
}

// ========================================
// STEP 5.1: MAP INITIALIZATION
// ========================================

function initHomeMap(buildings) {
    const mapContainer = document.getElementById('home-map');
    if (!mapContainer) return;
    
    // Create map
    const map = L.map(mapContainer).setView([-6.8, 39.28], 13);
    
    // Add tile layer (the map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers for each building
    buildings.forEach(building => {
        // Choose color based on condition
        let color;
        if (building.condition === 'Good') color = '#28a745';
        else if (building.condition === 'Fair') color = '#ffc107';
        else color = '#dc3545';
        
        // Create a circle marker
        const marker = L.circleMarker([building.lat, building.lng], {
            radius: 10,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        // Add popup with building info
        marker.bindPopup(`
            <div style="min-width: 150px;">
                <strong style="font-size: 14px;">${building.name}</strong><br>
                <span style="font-size: 12px; color: #666;">${building.era} · ${building.year}</span><br>
                <span class="badge badge-${building.condition.toLowerCase()}" style="margin-top: 4px;">
                    ${building.condition}
                </span><br>
                <button 
                    class="btn-primary" 
                    style="margin-top: 8px; padding: 4px 12px; font-size: 12px;"
                    onclick="navigate('/buildings?id=${building.id}')"
                >
                    View Details →
                </button>
            </div>
        `);
    });
}

// ========================================
// STEP 5.2: SEARCH HANDLER
// ========================================

function handleSearch() {
    const query = document.getElementById('home-search').value.trim();
    if (query) {
        // Navigate to search page with query
        navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
        alert('Please enter a search term');
    }
}