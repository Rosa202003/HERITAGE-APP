// 
// NAVIGATION MENU
// 
function initHamburgerMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');

    if (!menuToggle || !menu) {
        return;
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = menu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', function(e) {
        if (menu.classList.contains('open') && !menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHamburgerMenu);
} else {
    initHamburgerMenu();
}

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
                renderAllBuildings(container);  // ← Uses the new function
            }
            break;
        case 'login':
            renderLoginPage(container);
            break;
        case 'search':
            const query = getQueryParam('q');
            renderSearchResults(container, query);
            break;
        default:
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
        input.placeholder = 'Please enter a search term';
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
    console.log('Loading all buildings...');
    
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
                    <h2 style="font-family:var(--font-display);"> No Buildings Found</h2>
                    <p style="color:var(--text-muted);margin:16px 0;">Add some buildings to get started.</p>
                    <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div style="max-width:1200px;margin:0 auto;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
                    <h2 style="font-family:var(--font-display);font-size:28px;">All Heritage Buildings</h2>
                    <span style="color:var(--text-muted);font-size:14px;">${buildings.length} buildings found</span>
                </div>
                
                <div class="grid-3">
                    ${buildings.map(b => `
                        <div class="card" onclick="navigate('/buildings?id=${b.id}')" style="cursor:pointer;">
                            <img src="${b.image || 'https://placehold.co/600x400/eeeeee/666666?text=Building+Placeholder'}" 
                                 alt="${b.name}" 
                                 style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                                 onerror="this.src='https://placehold.co/600x400/eeeeee/666666?text=No+Image'">
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
        
        console.log(' All buildings loaded:', buildings.length);
        
    } catch (error) {
        console.error('Error loading buildings:', error);
        container.innerHTML = `
            <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                <h2 style="font-family:var(--font-display);">Error Loading Buildings</h2>
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
    console.log('Loading building detail for ID:', id);
    
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
                    <h2 style="font-family:var(--font-display);"> Building Not Found</h2>
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
                        <img src="${building.image || 'https://placehold.co/800x500/eeeeee/666666?text=No+Image'}" 
                             alt="${building.name}" 
                             style="width:100%;height:350px;object-fit:cover;"
                             onerror="this.src='https://placehold.co/800x500/eeeeee/666666?text=No+Image'">
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
                             View on Map
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
                         Virtual Tour Coming Soon
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
        
        console.log(' Building detail loaded for:', building.name);
        
    } catch (error) {
        console.error('Error loading building detail:', error);
        container.innerHTML = `
            <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                <h2 style="font-family:var(--font-display);">Error Loading Building</h2>
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
            errorEl.textContent = ' Invalid credentials. Try admin@heritage.go.tz / password';
        }
    } catch (err) {
        errorEl.textContent = 'Login error. Please try again.';
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
    
    console.log('Searching for:', query);
    
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
                                <img src="${b.image || 'https://placehold.co/600x400/eeeeee/666666?text=Building+Placeholder'}" 
                                     alt="${b.name}" 
                                     style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                                     onerror="this.src='https://placehold.co/600x400/eeeeee/666666?text=No+Image'">
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
        console.error(' Search error:', error);
        container.innerHTML = `
            <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                <h2 style="font-family:var(--font-display);"> Search Error</h2>
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
// MAP VIEW TOGGLE
// ========================================
function switchMapView(view) {
    const mapWrapper = document.querySelector('.map-wrapper');
    const mapContainer = document.getElementById('heritage-map');
    const sidebar = document.querySelector('.map-sidebar');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    // Update active button
    toggleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
    
    if (view === 'map') {
        // Show map, hide sidebar
        mapContainer.style.display = 'block';
        // Show the sidebar for map view
        if (sidebar) sidebar.style.display = '';
        // Hide any grid overlay if present
        const gridContainer = document.getElementById('grid-view-container');
        if (gridContainer) gridContainer.style.display = 'none';
        // Invalidate Leaflet map size so tiles render correctly after showing
        [250, 700].forEach(delay => {
            setTimeout(() => {
                if (window._heritageMap && typeof window._heritageMap.invalidateSize === 'function') {
                    try { window._heritageMap.invalidateSize(); } catch (e) { console.warn('invalidateSize error', e); }
                }
            }, delay);
        });
        // ensure sidebar visible (if present)
        // (kept above for safety) 
        console.log('📍 Switched to Map View');
    } else if (view === 'grid') {
        // Hide map, show grid view
        mapContainer.style.display = 'none';
        // Keep sidebar visible in grid view
        if (sidebar) sidebar.style.display = '';
        const gridContainer = document.getElementById('grid-view-container');
        if (!gridContainer) {
            createGridView();
        } else {
            gridContainer.style.display = 'block';
        }
        console.log(' Switched to Grid View');
    }
}

// ========================================
// CREATE GRID VIEW WITH DOTS
// ========================================
function createGridView() {
    const mapWrapper = document.querySelector('.map-wrapper');
    
    // Check if already exists
    if (document.getElementById('grid-view-container')) {
        document.getElementById('grid-view-container').style.display = 'block';
        return;
    }
    
    const gridHTML = `
        <div id="grid-view-container" class="grid-view-container">
            <svg class="grid-canvas" id="grid-canvas" width="100%" height="450" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
                <!-- Background gradient -->
                <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#0f3d35;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#1a4f47;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#0a2e2a;stop-opacity:1" />
                    </linearGradient>
                </defs>
                
                <!-- Background -->
                <rect width="800" height="450" fill="url(#bgGradient)" />
                
                <!-- Grid lines -->
                <g stroke="#2a6b63" stroke-width="1" opacity="0.3">
                    <line x1="0" y1="75" x2="800" y2="75" />
                    <line x1="0" y1="150" x2="800" y2="150" />
                    <line x1="0" y1="225" x2="800" y2="225" />
                    <line x1="0" y1="300" x2="800" y2="300" />
                    <line x1="0" y1="375" x2="800" y2="375" />
                    <line x1="160" y1="0" x2="160" y2="450" />
                    <line x1="320" y1="0" x2="320" y2="450" />
                    <line x1="480" y1="0" x2="480" y2="450" />
                    <line x1="640" y1="0" x2="640" y2="450" />
                </g>
                
                <!-- Region labels -->
                <text x="80" y="80" font-size="14" fill="#3d7b75" opacity="0.6" font-weight="500">UPANGA</text>
                <text x="380" y="110" font-size="14" fill="#3d7b75" opacity="0.6" font-weight="500">CITY CENTRE</text>
                <text x="100" y="200" font-size="14" fill="#3d7b75" opacity="0.6" font-weight="500">KARIAKOO</text>
                <text x="360" y="280" font-size="14" fill="#3d7b75" opacity="0.6" font-weight="500">KIVUKONI</text>
                <text x="620" y="180" font-size="14" fill="#3d7b75" opacity="0.6" font-weight="500">Indian Ocean</text>
                
                <!-- Building dots will be inserted here -->
                <g id="dots-container"></g>
            </svg>
            
            <!-- Legend removed: using the single map legend in the main layout -->
        </div>
    `;
    
    mapWrapper.insertAdjacentHTML('afterbegin', gridHTML);
    
    // Add building dots
    renderGridDots();
}

// ========================================
// RENDER BUILDING DOTS ON GRID
// ========================================
function renderGridDots() {
    const dotsContainer = document.getElementById('dots-container');
    if (!dotsContainer || !MOCK_BUILDINGS) return;
    
    // Normalize building coordinates to SVG viewBox (0-800, 0-450)
    const minLat = -6.82, maxLat = -6.79, minLng = 39.25, maxLng = 39.31;
    
    MOCK_BUILDINGS.forEach(b => {
        // Map lat/lng to SVG coordinates
        const x = ((b.lng - minLng) / (maxLng - minLng)) * 800;
        const y = ((maxLat - b.lat) / (maxLat - minLat)) * 450;
        
        // Determine color based on condition
        let color = '#34D5B8'; // Good/Excellent - teal
        if (b.condition === 'Fair') color = '#F0B429'; // Yellow/gold
        if (b.condition === 'Poor') color = '#F5611D'; // Orange
        if (b.condition === 'Critical') color = '#E63946'; // Red
        
        // Create circle marker
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '10');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('opacity', '0.85');
        circle.setAttribute('class', 'grid-dot');
        circle.setAttribute('data-id', b.id);
        circle.setAttribute('data-name', b.name);
        
        // Add hover effect
        circle.style.cursor = 'pointer';
        circle.style.transition = 'all 0.3s ease';
        
        circle.addEventListener('mouseenter', function() {
            circle.setAttribute('r', '14');
            circle.setAttribute('opacity', '1');
        });
        
        circle.addEventListener('mouseleave', function() {
            circle.setAttribute('r', '10');
            circle.setAttribute('opacity', '0.85');
        });
        
        circle.addEventListener('click', function() {
            navigate(`/buildings?id=${b.id}`);
        });
        
        dotsContainer.appendChild(circle);
    });
}
// ========================================
// MAP INITIALIZATION
// ========================================
function initHeritageMap() {
    const mapContainer = document.getElementById('heritage-map');
    
    if (!mapContainer) {
        console.log(' Map container #heritage-map not found');
        return;
    }
    
    // FORCE height
    mapContainer.style.height = '450px';
    mapContainer.style.minHeight = '450px';
    mapContainer.style.width = '100%';
    
    if (typeof L === 'undefined') {
        console.log(' Leaflet not loaded');
        return;
    }
    
    if (typeof MOCK_BUILDINGS === 'undefined' || MOCK_BUILDINGS.length === 0) {
        console.log('MOCK_BUILDINGS not defined');
        return;
    }
    
    console.log(' Initializing map with', MOCK_BUILDINGS.length, 'buildings');
    
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
        console.log(' Map initialized successfully');
        
    } catch (error) {
        console.error('Map error:', error);
    }
}

// ========================================
// LOAD BUILDING LIST FOR SIDEBAR
// ========================================
async function loadBuildingList() {
    const list = document.getElementById('building-list');
    if (!list) {
        console.log('building-list not found');
        return;
    }
    
    console.log('Loading building list...');
    
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
        
        console.log('Building list loaded:', sorted.length);
        
    } catch (error) {
        console.error('Error loading building list:', error);
        list.innerHTML = `<p style="color:var(--text-muted);padding:20px;">Error loading buildings</p>`;
    }
}

// ========================================
// CITIZEN AUTHENTICATION MODAL
// ========================================
function showCitizenModal() {
    let modal = document.getElementById('citizen-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeCitizenModal() {
    let modal = document.getElementById('citizen-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function handleCitizenLogin(e) {
    e.preventDefault();
    localStorage.setItem('citizen_auth', 'true');
    closeCitizenModal();
    
    // Check if we are on risk page, refresh to show form
    if (window.location.hash.includes('/risk') || window.location.pathname.includes('risk.html')) {
        window.location.reload();
    }
}

// ========================================
// VIDEO LIGHTBOX FUNCTIONS
// ========================================
function openVideoLightbox(videoId, title, embedUrl) {
    const isCitizenAuthenticated = localStorage.getItem('citizen_auth') === 'true';
    let watchCount = parseInt(localStorage.getItem('video_watch_count') || '0');

    if (!isCitizenAuthenticated && watchCount >= 3) {
        showCitizenModal();
        return; // Prevent opening video
    }

    const lightbox = document.getElementById('video-lightbox');
    const player = document.getElementById('video-lightbox-player');
    
    if (lightbox && player) {
        if (!isCitizenAuthenticated) {
            localStorage.setItem('video_watch_count', (watchCount + 1).toString());
        }
        player.src = embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoLightbox() {
    const lightbox = document.getElementById('video-lightbox');
    const player = document.getElementById('video-lightbox-player');
    
    if (lightbox && player) {
        lightbox.classList.remove('active');
        player.src = '';
        document.body.style.overflow = '';
    }
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVideoLightbox();
    }
});

// Close lightbox on background click
document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('video-lightbox');
    if (e.target === lightbox) {
        closeVideoLightbox();
    }
});

// ========================================
// LOAD FEATURED BUILDINGS
// ========================================
async function loadFeaturedBuildings() {
    const grid = document.getElementById('building-grid');
    if (!grid) return;
    
    console.log('Loading featured buildings...');
    
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
                <img src="${b.image || 'https://images.unsplash.com/photo-1759837107238-7637c2446e6c'}" 
                     alt="${b.name}" 
                     style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                     onerror="this.src='https://placehold.co/600x400/eeeeee/666666?text=No+Image'">
                <h3 style="font-size:17px;font-weight:600;color:var(--text);">${b.name}</h3>
                <p style="font-size:13px;color:var(--text-muted);">${b.era} · ${b.year}</p>
                <div style="margin-top:8px;">
                    <span class="badge badge-${b.condition.toLowerCase()}">${b.condition}</span>
                    <span style="margin-left:8px;font-size:12px;color:var(--text-muted);">${b.status || 'Listed'}</span>
                </div>
            </div>
        `).join('');
        
        console.log(' Featured buildings loaded:', featured.length);
        
    } catch (error) {
        console.error('Error loading featured buildings:', error);
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
    console.log('DOM fully loaded - Starting app...');
    
    const path = window.location.hash.slice(1) || '/';
    renderPage(path);
    
    loadBuildingList();
    loadFeaturedBuildings();
    
    setTimeout(function() {
        initHeritageMap();
    }, 500);
    // Ensure page starts at top (fixes stray initial scroll position in some previews)
    try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
        window.scrollTo(0, 0);
    }
});

console.log('app.js loaded successfully');
// Dataset mapping perfectly to the images and attributes in the screenshot
const buildings = [
  {
    id: 1,
    title: "German Administrative Boma",
    era: "German",
    condition: "Good",
    grade: "Grade I Listed",
    location: "City Centre",
    year: 1891,
    image: "../ASSETS/images/oldboma.png", 
    has360: true,
    area: "740 m²",
    description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
    significance: "Documents the evolution of Dar es Salaam as a major East African port.",
    architect: "Unknown",
    ownership: "Tanzania Ports Authority",
    style: "German Colonial Administrative",
    inspected: "2023-11-08"
  },
  {
    id: 2,
    title: "St. Joseph Metropolitan Cathedral",
    era: "German",
    condition: "Excellent",
    grade: "Grade I Listed",
    location: "City Centre",
    year: 1898,
    image: "../ASSETS/images/stjosephcathedral.png",
    area: "740 m²",
    description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
    significance: "Documents the evolution of Dar es Salaam as a major East African port.",
    architect: "Unknown",
    ownership: "Tanzania Ports Authority",
    style: "German Colonial Administrative",
    inspected: "2023-11-08"
  },
  {
    id: 3,
    title: "Azania Front Lutheran Church",
    era: "German",
    condition: "Good",
    grade: "Grade I Listed",
    location: "Kivukoni",
    year: 1898,
    image: "../ASSETS/images/azaniafront.png",
    has360: true,
    area: "740 m²",
    description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
    significance: "Documents the evolution of Dar es Salaam as a major East African port.",
    architect: "Unknown",
    ownership: "Tanzania Ports Authority",
    style: "German Colonial Administrative",
    inspected: "2023-11-08"
  },
  {
    id: 4,
    title: "Old Harbour Master's Office",
    era: "German",
    condition: "Fair",
    grade: "Grade II Listed",
    location: "Kivukoni",
    year: 1915,
    image: "../ASSETS/images/harbordsm.png",
    has360: false,
    area: "740 m²",
    description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
    significance: "Documents the evolution of Dar es Salaam as a major East African port.",
    architect: "Unknown",
    ownership: "Tanzania Ports Authority",
    style: "German Colonial Administrative",
    inspected: "2023-11-08"
  },
  {
    id: 5,
    title: "General Post Office",
    era: "British",
    condition: "Poor",
    grade: "Grade II Listed",
    location: "City Centre",
    year: 1913,
    image: "../ASSETS/images/postayazamani.png",
    has360: false,
    area: "740 m²",
    description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
    significance: "Documents the evolution of Dar es Salaam as a major East African port.",
    architect: "Unknown",
    ownership: "Tanzania Ports Authority",
    style: "German Colonial Administrative",
    inspected: "2023-11-08"
  },
  {
    id: 6,
    title: "Dar es Salaam City Hall",
    era: "Independence",
    condition: "Good",
    grade: "Grade II Listed",
    location: "City Centre",
    year: 1956,
    image: "../ASSETS/images/karimjeehall.png",
    has360: true,
    area: "740 m²",
    description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
    significance: "Documents the evolution of Dar es Salaam as a major East African port.",
    architect: "Unknown",
    ownership: "Tanzania Ports Authority",
    style: "German Colonial Administrative",
    inspected: "2023-11-08"
  },
  {
    id: 7,
    title: "Mnazi Mmoja Hospital Original Block",
    era: "British",
    condition: "Critical",
    grade: "Proposed",
    location: "Upanga",
    year: 1918,
    image: "",
    has360: false,
    atRisk: true,
    area: "740 m²",
    description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
    significance: "Documents the evolution of Dar es Salaam as a major East African port.",
    architect: "Unknown",
    ownership: "Tanzania Ports Authority",
    style: "German Colonial Administrative",
    inspected: "2023-11-08"
  },
  {
    id: 8,
    title: "Dar es Salaam Railway Station",
    era: "German",
    condition: "Fair",
    grade: "Grade I Listed",
    location: "Kariakoo",
    year: 1929,
    image: "../ASSETS/images/tazara.png",
    has360: true,
    area: "740 m²",
    description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
    significance: "Documents the evolution of Dar es Salaam as a major East African port.",
    architect: "Unknown",
    ownership: "Tanzania Ports Authority",
    style: "German Colonial Administrative",
    inspected: "2023-11-08"
  }
];

// DOM references
const buildingGrid = document.getElementById('buildingGrid');
const searchInput = document.getElementById('searchInput');
const resultsCount = document.getElementById('resultsCount');
const modal = document.getElementById('detailModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const formatClassString = (str) => str.replace(/\s+/g, '-').toLowerCase();

function renderGrid(data) {
  buildingGrid.innerHTML = '';
  resultsCount.textContent = `${data.length} results`;

  data.forEach(building => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = building.id;

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${building.image}" alt="${building.title}" class="card-image">
        <span class="badge era-badge era-${formatClassString(building.era)}">${building.era}</span>
        ${building.has360 ? '<span class="badge badge-360">360°</span>' : ''}
        ${building.atRisk ? '<span class="badge at-risk-badge">⚠️ AT RISK</span>' : ''}
      </div>
      <div class="card-content">
        <h3 class="card-title">${building.title}</h3>
        <div class="badge-row">
          <span class="status-tag cond-${formatClassString(building.condition)}">${building.condition}</span>
          <span class="status-tag grade-${formatClassString(building.grade)}">${building.grade}</span>
        </div>
        <div class="card-footer">
          <span class="location-tag">📍 ${building.location}</span>
          <span class="year-tag">${building.year}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openModal(building.id));
    buildingGrid.appendChild(card);
  });
}
function openModal(id) {
  const building = buildings.find(b => b.id === id);
  if (!building) return;
  resetModalTabs();

  // Map database elements to modal nodes dynamically
  document.getElementById('modalTitle').textContent = building.title;
  document.getElementById('modalEra').textContent = building.era;
  document.getElementById('modalCondition').textContent = building.condition;
  document.getElementById('modalHero').style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${building.image}')`;
  
  document.getElementById('modalDistrict').textContent = building.location;
  document.getElementById('modalBuilt').textContent = building.year;
  document.getElementById('modalArea').textContent = building.area || "N/A";
  document.getElementById('modalStatus').textContent = building.grade;

  document.getElementById('modalDescription').textContent = building.description || "";
  document.getElementById('modalSignificance').textContent = building.significance || "";
  document.getElementById('modalArchitect').textContent = building.architect || "Unknown";
  document.getElementById('modalOwnership').textContent = building.ownership || "Public Asset";
  document.getElementById('modalStyle').textContent = building.style || "Vernacular Heritage";
  document.getElementById('modalInspected').textContent = building.inspected || "Pending";
  modal.classList.add('active');
}

closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });


const tabs = document.querySelectorAll('.tab-item');
const panels = document.querySelectorAll('.modal-panel');

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {

    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    
    panels[index].classList.add('active');
  });
});

function resetModalTabs() {
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  
  if(tabs[0]) tabs[0].classList.add('active');
  if(panels[0]) panels[0].classList.add('active');
}
// Live typing Search implementation
searchInput.addEventListener('input', (e) => {
  const text = e.target.value.toLowerCase();
  const filtered = buildings.filter(b => 
    b.title.toLowerCase().includes(text) || 
    b.location.toLowerCase().includes(text)
  );
  renderGrid(filtered);
});

renderGrid(buildings);