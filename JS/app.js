// ========================================
// TOGGLE NAVIGATION MENU
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('open');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (menu && menu.classList.contains('open')) {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                menu.classList.remove('open');
            }
        }
    });
});

// ========================================
// APP STATE
// ========================================
const STATE = {
    currentPage: '/',
    buildings: [],
    user: null
};

// ========================================
// ROUTER
// ========================================
function navigate(path) {
    window.location.hash = path;
    renderPage(path);
}

function renderPage(path) {
    STATE.currentPage = path;
    const container = document.getElementById('main-content');
    const route = path.replace(/^\//, '') || 'home';
    
    switch(route) {
        case 'home':
        case '':
            // Hero is already in HTML - keep it
            break;
        case 'map':
            renderMapPage(container);
            break;
        case 'buildings':
            const id = getQueryParam('id');
            if (id) {
                renderBuildingDetail(container, id);
            } else {
                renderAllBuildings(container);
            }
            break;
        case 'login':
            renderLoginPage(container);
            break;
        case 'search':
            const query = getQueryParam('q');
            renderSearchResults(container, query);
            break;
        case 'report':
            renderReportPage(container);
            break;
        case 'community':
            renderCommunityPage(container);
            break;
        case 'about':
            renderAboutPage(container);
            break;
        case 'contact':
            renderContactPage(container);
            break;
        default:
            // 404 - show home
            break;
    }
    
    updateActiveNav();
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

function updateActiveNav() {
    const currentPath = STATE.currentPage;
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${currentPath}`);
    });
}

// ========================================
// HERO FUNCTIONS
// ========================================
function handleHeroSearch() {
    const input = document.getElementById('hero-search');
    const query = input ? input.value.trim() : '';
    
    if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
    } else if (input) {
        input.style.borderColor = '#F5611D';
        input.placeholder = '⚠️ Please enter a search term';
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder = 'Search buildings or districts...';
        }, 2000);
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========================================
// MAP PAGE
// ========================================
function renderMapPage(container) {
    container.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;padding:20px;">
            <h2 style="font-family:var(--font-display);font-size:28px;margin-bottom:16px;">🗺️ Full Map View</h2>
            <p style="color:var(--text-muted);margin-bottom:20px;">Interactive map of all heritage buildings in Dar es Salaam.</p>
            <div id="full-map" style="height:600px;width:100%;border-radius:var(--radius);border:1px solid var(--border);background:#e8ecea;"></div>
            <div style="margin-top:16px;">
                <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
            </div>
        </div>
    `;
    
    // Initialize map after DOM update
    setTimeout(() => {
        const mapContainer = document.getElementById('full-map');
        if (mapContainer && typeof L !== 'undefined') {
            const map = L.map(mapContainer).setView([-6.8, 39.28], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);
            
            if (typeof MOCK_BUILDINGS !== 'undefined') {
                MOCK_BUILDINGS.forEach(b => {
                    let color = b.condition === 'Good' ? '#34D5B8' : b.condition === 'Fair' ? '#F0B429' : '#F5611D';
                    L.circleMarker([b.lat, b.lng], {
                        radius: 9,
                        fillColor: color,
                        color: '#fff',
                        weight: 2,
                        fillOpacity: 0.85
                    }).bindPopup(`<strong>${b.name}</strong><br>${b.era}`).addTo(map);
                });
            }
            setTimeout(() => map.invalidateSize(), 300);
        }
    }, 500);
}

// ========================================
// ALL BUILDINGS PAGE
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
            <div style="max-width:1200px;margin:0 auto;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
                    <h2 style="font-family:var(--font-display);font-size:28px;">🏛️ All Heritage Buildings</h2>
                    <span style="color:var(--text-muted);font-size:14px;">${buildings.length} buildings found</span>
                </div>
                
                <div class="grid-3">
                    ${buildings.map(b => `
                        <div class="card" onclick="navigate('/buildings?id=${b.id}')" style="cursor:pointer;">
                            <img src="${b.image || 'https://via.placeholder.com/600x400/cccccc/666?text=Heritage+Building'}" 
                                 alt="${b.name}" 
                                 style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                                 onerror="this.src='https://via.placeholder.com/600x400/cccccc/666?text=No+Image'">
                            <h3 style="font-size:17px;font-weight:600;color:var(--text);">${b.name}</h3>
                            <p style="font-size:13px;color:var(--text-muted);">${b.era} · ${b.year}</p>
                            <div style="margin-top:8px;">
                                <span class="badge badge-${b.condition.toLowerCase()}">${b.condition}</span>
                                <span style="margin-left:8px;font-size:12px;color:var(--text-muted);">${b.status || 'Listed'}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top:20px;">
                    <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
                </div>
            </div>
        `;
        
        console.log('✅ All buildings loaded:', buildings.length);
        
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

// ========================================
// BUILDING DETAIL PAGE
// ========================================
async function renderBuildingDetail(container, id) {
    console.log('🏛️ Loading building detail for ID:', id);
    
    try {
        let building = null;
        if (typeof API !== 'undefined' && API.getBuilding) {
            building = await API.getBuilding(id);
        } else if (typeof MOCK_BUILDINGS !== 'undefined') {
            building = MOCK_BUILDINGS.find(b => b.id === parseInt(id));
        }
        
        if (!building) {
            container.innerHTML = `
                <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                    <h2 style="font-family:var(--font-display);">🏛️ Building Not Found</h2>
                    <p style="color:var(--text-muted);margin:16px 0;">The building you're looking for doesn't exist.</p>
                    <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div style="max-width:1000px;margin:0 auto;padding:20px;">
                <!-- Back Button -->
                <button class="btn-secondary" onclick="navigate('/buildings')" style="margin-bottom:20px;">
                    ← Back to All Buildings
                </button>
                
                <!-- Building Header -->
                <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:24px;">
                    <!-- Image -->
                    <div style="background:var(--muted);border-radius:var(--radius);overflow:hidden;">
                        <img src="${building.image || 'https://via.placeholder.com/800x500/cccccc/666?text=No+Image'}" 
                             alt="${building.name}" 
                             style="width:100%;height:350px;object-fit:cover;"
                             onerror="this.src='https://via.placeholder.com/800x500/cccccc/666?text=No+Image'">
                    </div>
                    
                    <!-- Info Panel -->
                    <div style="background:var(--card);border-radius:var(--radius);padding:24px;border:1px solid var(--border);">
                        <h1 style="font-family:var(--font-display);font-size:28px;color:var(--text);">${building.name}</h1>
                        <p style="color:var(--text-muted);font-size:14px;">${building.era} · ${building.year}</p>
                        
                        <div style="margin:12px 0;">
                            <span class="badge badge-${building.condition.toLowerCase()}">${building.condition}</span>
                            <span style="margin-left:8px;font-size:13px;color:var(--text-muted);">${building.status || 'Listed'}</span>
                        </div>
                        
                        <hr style="border-color:var(--border);margin:12px 0;">
                        
                        <div style="font-size:14px;color:var(--text-muted);">
                            <p><strong style="color:var(--text);">Architect:</strong> ${building.architect || 'Unknown'}</p>
                            <p><strong style="color:var(--text);">Ownership:</strong> ${building.ownership || 'Unknown'}</p>
                            <p><strong style="color:var(--text);">Coordinates:</strong> ${building.lat}, ${building.lng}</p>
                        </div>
                        
                        <button class="btn-primary" onclick="navigate('/map')" style="margin-top:16px;width:100%;">
                            🗺️ View on Map
                        </button>
                    </div>
                </div>
                
                <!-- Description -->
                <div style="background:var(--card);border-radius:var(--radius);padding:24px;border:1px solid var(--border);margin-bottom:24px;">
                    <h3 style="font-family:var(--font-display);font-size:20px;margin-bottom:8px;">📖 About This Building</h3>
                    <p style="color:var(--text-muted);line-height:1.8;">${building.description || 'No description available.'}</p>
                </div>
                
                <!-- 360° Tour Section -->
                <div style="background:var(--card);border-radius:var(--radius);padding:24px;border:1px solid var(--border);">
                    <h3 style="font-family:var(--font-display);font-size:20px;margin-bottom:8px;">🔄 360° Virtual Tour</h3>
                    <p style="color:var(--text-muted);font-size:14px;margin-bottom:12px;">Coming soon - immersive tour experience.</p>
                    <div style="background:var(--muted);border-radius:var(--radius);height:200px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);">
                        🏛️ Virtual Tour Coming Soon
                    </div>
                </div>
                
                <!-- Report Button -->
                <div style="margin-top:24px;text-align:center;">
                    <button class="btn-accent" onclick="navigate('/report')" style="background:transparent;border:2px solid var(--accent);color:var(--accent);padding:12px 32px;border-radius:var(--radius-sm);cursor:pointer;font-weight:600;">
                        ⚑ Report Concern About This Building
                    </button>
                </div>
            </div>
        `;
        
        console.log('✅ Building detail loaded for:', building.name);
        
    } catch (error) {
        console.error('❌ Error loading building detail:', error);
        container.innerHTML = `
            <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                <h2 style="font-family:var(--font-display);">❌ Error Loading Building</h2>
                <p style="color:var(--text-muted);margin:16px 0;">Something went wrong. Please try again.</p>
                <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
            </div>
        `;
    }
}

// ========================================
// LOGIN PAGE
// ========================================
function renderLoginPage(container) {
    container.innerHTML = `
        <div style="max-width:420px;margin:40px auto;">
            <div class="card" style="padding:32px;">
                <h2 style="font-family:var(--font-display);text-align:center;font-size:24px;">🔐 Officer Login</h2>
                <p style="text-align:center;color:var(--text-muted);font-size:14px;margin-bottom:20px;">
                    Antiquities Department Access
                </p>
                
                <form id="login-form" onsubmit="handleLogin(event)" style="display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Email</label>
                        <input type="email" id="login-email" value="admin@heritage.go.tz" required 
                               style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);">
                    </div>
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Password</label>
                        <input type="password" id="login-password" value="password" required 
                               style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);">
                    </div>
                    <button type="submit" class="btn-primary" style="padding:12px;font-size:16px;">
                        Login →
                    </button>
                    <div id="login-error" style="color:var(--accent);text-align:center;font-size:13px;"></div>
                </form>
                
                <div style="margin-top:16px;text-align:center;font-size:12px;color:var(--text-muted);">
                    <p>Demo: admin@heritage.go.tz / password</p>
                </div>
            </div>
        </div>
    `;
}

// ===== LOGIN HANDLER =====
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    
    errorEl.textContent = '';
    
    try {
        if (typeof API !== 'undefined' && API.login) {
            const result = await API.login(email, password);
            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                navigate('/');
                return;
            }
        }
        
        // Mock login
        if (email === 'admin@heritage.go.tz' && password === 'password') {
            localStorage.setItem('token', 'mock-token');
            localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'officer' }));
            navigate('/');
        } else {
            errorEl.textContent = '❌ Invalid credentials. Try admin@heritage.go.tz / password';
        }
    } catch (err) {
        errorEl.textContent = '❌ Login error. Please try again.';
    }
}

// ========================================
// SEARCH RESULTS PAGE
// ========================================
async function renderSearchResults(container, query) {
    if (!query) {
        navigate('/');
        return;
    }
    
    console.log('🔍 Searching for:', query);
    
    try {
        let buildings = [];
        if (typeof API !== 'undefined' && API.getBuildings) {
            buildings = await API.getBuildings();
        } else if (typeof MOCK_BUILDINGS !== 'undefined') {
            buildings = MOCK_BUILDINGS;
        }
        
        const results = buildings.filter(b => 
            b.name.toLowerCase().includes(query.toLowerCase()) ||
            b.era.toLowerCase().includes(query.toLowerCase()) ||
            b.description.toLowerCase().includes(query.toLowerCase())
        );
        
        container.innerHTML = `
            <div style="max-width:1200px;margin:0 auto;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
                    <h2 style="font-family:var(--font-display);font-size:28px;">🔍 Search Results</h2>
                    <span style="color:var(--text-muted);font-size:14px;">${results.length} results for "${query}"</span>
                </div>
                
                ${results.length === 0 ? `
                    <div style="text-align:center;padding:60px 20px;">
                        <p style="font-size:48px;margin-bottom:16px;">🔍</p>
                        <h3 style="font-family:var(--font-display);font-size:24px;">No buildings found</h3>
                        <p style="color:var(--text-muted);margin:8px 0 20px;">Try searching for a different term.</p>
                        <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
                    </div>
                ` : `
                    <div class="grid-3">
                        ${results.map(b => `
                            <div class="card" onclick="navigate('/buildings?id=${b.id}')" style="cursor:pointer;">
                                <img src="${b.image || 'https://via.placeholder.com/600x400/cccccc/666?text=Heritage+Building'}" 
                                     alt="${b.name}" 
                                     style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                                     onerror="this.src='https://via.placeholder.com/600x400/cccccc/666?text=No+Image'">
                                <h3 style="font-size:17px;font-weight:600;color:var(--text);">${b.name}</h3>
                                <p style="font-size:13px;color:var(--text-muted);">${b.era} · ${b.year}</p>
                                <div style="margin-top:8px;">
                                    <span class="badge badge-${b.condition.toLowerCase()}">${b.condition}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
                
                <div style="margin-top:20px;">
                    <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('❌ Search error:', error);
        container.innerHTML = `
            <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                <h2 style="font-family:var(--font-display);">❌ Search Error</h2>
                <p style="color:var(--text-muted);margin:16px 0;">Please try again.</p>
                <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
            </div>
        `;
    }
}

// ========================================
// REPORT PAGE
// ========================================
function renderReportPage(container) {
    container.innerHTML = `
        <div style="max-width:600px;margin:40px auto;">
            <h2 style="font-family:var(--font-display);font-size:28px;">⚑ Report At-Risk Building</h2>
            <p style="color:var(--text-muted);margin-bottom:20px;">Help us protect Dar es Salaam's heritage by reporting at-risk buildings.</p>
            
            <div class="card" style="padding:24px;">
                <form id="report-form" style="display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Building Name *</label>
                        <input type="text" required style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);">
                    </div>
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Your Name (optional)</label>
                        <input type="text" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);">
                    </div>
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Your Email (optional)</label>
                        <input type="email" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);">
                    </div>
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Description of Concern *</label>
                        <textarea rows="4" required style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:inherit;"></textarea>
                    </div>
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Photo (optional)</label>
                        <input type="file" accept="image/*" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);">
                    </div>
                    <button type="submit" class="btn-accent" style="padding:12px;">Submit Report</button>
                </form>
                <p style="font-size:12px;color:var(--text-muted);margin-top:12px;">* Required fields. Your report will be sent to the Antiquities Department.</p>
            </div>
            
            <div style="margin-top:16px;">
                <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
            </div>
        </div>
    `;
}

// ========================================
// COMMUNITY PAGE
// ========================================
function renderCommunityPage(container) {
    container.innerHTML = `
        <div style="max-width:800px;margin:40px auto;padding:20px;">
            <h2 style="font-family:var(--font-display);font-size:28px;">🤝 Get Involved</h2>
            <p style="color:var(--text-muted);margin-bottom:20px;">Help preserve Dar es Salaam's heritage buildings.</p>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <div class="card">
                    <h3 style="font-family:var(--font-display);font-size:18px;">📚 Volunteer</h3>
                    <p style="color:var(--text-muted);font-size:14px;margin:8px 0;">Join our team of heritage volunteers.</p>
                    <button class="btn-secondary" onclick="navigate('/contact')">Learn More</button>
                </div>
                <div class="card">
                    <h3 style="font-family:var(--font-display);font-size:18px;">📸 Contribute Photos</h3>
                    <p style="color:var(--text-muted);font-size:14px;margin:8px 0;">Share photos of heritage buildings.</p>
                    <button class="btn-secondary" onclick="navigate('/contact')">Submit Photos</button>
                </div>
                <div class="card">
                    <h3 style="font-family:var(--font-display);font-size:18px;">📖 Research</h3>
                    <p style="color:var(--text-muted);font-size:14px;margin:8px 0;">Access our research database.</p>
                    <button class="btn-secondary" onclick="navigate('/about')">Learn More</button>
                </div>
                <div class="card">
                    <h3 style="font-family:var(--font-display);font-size:18px;">💬 Share Stories</h3>
                    <p style="color:var(--text-muted);font-size:14px;margin:8px 0;">Share your memories of these buildings.</p>
                    <button class="btn-secondary" onclick="navigate('/contact')">Share Story</button>
                </div>
            </div>
            
            <div style="margin-top:20px;">
                <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
            </div>
        </div>
    `;
}

// ========================================
// ABOUT PAGE
// ========================================
function renderAboutPage(container) {
    container.innerHTML = `
        <div style="max-width:800px;margin:40px auto;padding:20px;">
            <h2 style="font-family:var(--font-display);font-size:28px;">🏛️ About Urithi Majengo</h2>
            <p style="color:var(--text-muted);margin-bottom:20px;">Preserving Dar es Salaam's architectural heritage.</p>
            
            <div class="card" style="padding:24px;margin-bottom:20px;">
                <h3 style="font-family:var(--font-display);font-size:20px;">Our Mission</h3>
                <p style="color:var(--text-muted);line-height:1.8;">Urithi Majengo is a digital inventory and virtual-tour system for Dar es Salaam's heritage buildings. We document, preserve, and promote the city's architectural legacy.</p>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <div class="card">
                    <h4 style="font-family:var(--font-display);font-size:16px;">📊 48+ Buildings</h4>
                    <p style="color:var(--text-muted);font-size:14px;">Documented and mapped</p>
                </div>
                <div class="card">
                    <h4 style="font-family:var(--font-display);font-size:16px;">🔄 5 Virtual Tours</h4>
                    <p style="color:var(--text-muted);font-size:14px;">Immersive 360° experiences</p>
                </div>
                <div class="card">
                    <h4 style="font-family:var(--font-display);font-size:16px;">🏛️ 6 Districts</h4>
                    <p style="color:var(--text-muted);font-size:14px;">Across Dar es Salaam</p>
                </div>
                <div class="card">
                    <h4 style="font-family:var(--font-display);font-size:16px;">⚑ 3 Alerts</h4>
                    <p style="color:var(--text-muted);font-size:14px;">Active risk reports</p>
                </div>
            </div>
            
            <div style="margin-top:20px;">
                <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
            </div>
        </div>
    `;
}

// ========================================
// CONTACT PAGE
// ========================================
function renderContactPage(container) {
    container.innerHTML = `
        <div style="max-width:600px;margin:40px auto;padding:20px;">
            <h2 style="font-family:var(--font-display);font-size:28px;">📧 Contact Us</h2>
            <p style="color:var(--text-muted);margin-bottom:20px;">Get in touch with the Urithi Majengo team.</p>
            
            <div class="card" style="padding:24px;">
                <form style="display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Name *</label>
                        <input type="text" required style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);">
                    </div>
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Email *</label>
                        <input type="email" required style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);">
                    </div>
                    <div>
                        <label style="display:block;font-weight:500;font-size:13px;margin-bottom:4px;">Message *</label>
                        <textarea rows="4" required style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:inherit;"></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="padding:12px;">Send Message</button>
                </form>
            </div>
            
            <div style="margin-top:16px;">
                <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
            </div>
        </div>
    `;
}

// ========================================
// MAP INITIALIZATION
// ========================================
function initHeritageMap() {
    const mapContainer = document.getElementById('heritage-map');
    
    if (!mapContainer) {
        console.log('❌ Map container #heritage-map not found');
        return;
    }
    
    // FORCE height
    mapContainer.style.height = '450px';
    mapContainer.style.minHeight = '450px';
    mapContainer.style.width = '100%';
    
    if (typeof L === 'undefined') {
        console.log('❌ Leaflet not loaded');
        return;
    }
    
    if (typeof MOCK_BUILDINGS === 'undefined' || MOCK_BUILDINGS.length === 0) {
        console.log('❌ MOCK_BUILDINGS not defined');
        return;
    }
    
    console.log('🗺️ Initializing map with', MOCK_BUILDINGS.length, 'buildings');
    
    try {
        const map = L.map(mapContainer).setView([-6.8, 39.28], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        
        MOCK_BUILDINGS.forEach(b => {
            let color = b.condition === 'Good' ? '#34D5B8' : b.condition === 'Fair' ? '#F0B429' : '#F5611D';
            L.circleMarker([b.lat, b.lng], {
                radius: 9,
                fillColor: color,
                color: '#fff',
                weight: 2,
                fillOpacity: 0.85
            })
            .bindPopup(`
                <div style="min-width:160px;">
                    <strong>${b.name}</strong><br>
                    <span style="font-size:12px;color:#666;">${b.era} · ${b.year}</span><br>
                    <span class="badge badge-${b.condition.toLowerCase()}">${b.condition}</span><br>
                    <button onclick="navigate('/buildings?id=${b.id}')" 
                            style="margin-top:6px;padding:4px 12px;background:#0B7A69;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">
                        View Details
                    </button>
                </div>
            `)
            .addTo(map);
        });
        
        setTimeout(() => map.invalidateSize(), 400);
        window._heritageMap = map;
        console.log('✅ Map initialized successfully');
        
    } catch (error) {
        console.error('❌ Map error:', error);
    }
}

// ========================================
// LOAD BUILDING LIST FOR SIDEBAR
// ========================================
async function loadBuildingList() {
    const list = document.getElementById('building-list');
    if (!list) {
        console.log('⚠️ building-list not found');
        return;
    }
    
    console.log('📋 Loading building list...');
    
    try {
        let buildings = [];
        if (typeof API !== 'undefined' && API.getBuildings) {
            buildings = await API.getBuildings();
        } else if (typeof MOCK_BUILDINGS !== 'undefined') {
            buildings = MOCK_BUILDINGS;
        }
        
        if (!buildings || buildings.length === 0) {
            list.innerHTML = `<p style="color:var(--text-muted);padding:20px;">No buildings found</p>`;
            return;
        }
        
        const sorted = buildings.sort((a, b) => a.id - b.id);
        
        list.innerHTML = sorted.map(b => `
            <div class="building-list-item" onclick="navigate('/buildings?id=${b.id}')">
                <span class="item-number">DSH-${String(b.id).padStart(3, '0')}</span>
                <div class="item-info">
                    <div class="item-name">${b.name}</div>
                    <div class="item-meta">
                        <span class="era">${b.era} · ${b.year}</span>
                        <span class="item-badge ${b.condition.toLowerCase()}">${b.condition}</span>
                    </div>
                </div>
                <span class="item-arrow">→</span>
            </div>
        `).join('');
        
        const countBadge = document.querySelector('.building-count');
        if (countBadge) countBadge.textContent = `${sorted.length} Buildings`;
        
        console.log('✅ Building list loaded:', sorted.length);
        
    } catch (error) {
        console.error('❌ Error loading building list:', error);
        list.innerHTML = `<p style="color:var(--text-muted);padding:20px;">Error loading buildings</p>`;
    }
}

// ========================================
// LOAD FEATURED BUILDINGS
// ========================================
async function loadFeaturedBuildings() {
    const grid = document.getElementById('building-grid');
    if (!grid) return;
    
    console.log('🏛️ Loading featured buildings...');
    
    try {
        let buildings = [];
        if (typeof API !== 'undefined' && API.getBuildings) {
            buildings = await API.getBuildings();
        } else if (typeof MOCK_BUILDINGS !== 'undefined') {
            buildings = MOCK_BUILDINGS;
        }
        
        if (!buildings || buildings.length === 0) {
            grid.innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center;">No buildings found</p>`;
            return;
        }
        
        const featured = buildings.slice(0, 3);
        grid.innerHTML = featured.map(b => `
            <div class="card" onclick="navigate('/buildings?id=${b.id}')" style="cursor:pointer;">
                <img src="${b.image || 'https://via.placeholder.com/600x400/cccccc/666?text=Heritage+Building'}" 
                     alt="${b.name}" 
                     style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                     onerror="this.src='https://via.placeholder.com/600x400/cccccc/666?text=No+Image'">
                <h3 style="font-size:17px;font-weight:600;color:var(--text);">${b.name}</h3>
                <p style="font-size:13px;color:var(--text-muted);">${b.era} · ${b.year}</p>
                <div style="margin-top:8px;">
                    <span class="badge badge-${b.condition.toLowerCase()}">${b.condition}</span>
                    <span style="margin-left:8px;font-size:12px;color:var(--text-muted);">${b.status || 'Listed'}</span>
                </div>
            </div>
        `).join('');
        
        console.log('✅ Featured buildings loaded:', featured.length);
        
    } catch (error) {
        console.error('❌ Error loading featured buildings:', error);
        grid.innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center;">Error loading buildings</p>`;
    }
}

// ========================================
// HASH CHANGE LISTENER
// ========================================
window.addEventListener('hashchange', function() {
    const path = window.location.hash.slice(1) || '/';
    renderPage(path);
});

// ========================================
// INITIALIZE EVERYTHING ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM fully loaded - Starting app...');
    
    const path = window.location.hash.slice(1) || '/';
    renderPage(path);
    
    loadBuildingList();
    loadFeaturedBuildings();
    
    setTimeout(function() {
        initHeritageMap();
    }, 500);
});

console.log('✅ app.js loaded successfully');