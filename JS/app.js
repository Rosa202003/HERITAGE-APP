//
// NAVIGATION MENU
//
function initHamburgerMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");

  if (!menuToggle || !menu) {
    return;
  }

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function (e) {
    if (
      menu.classList.contains("open") &&
      !menu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHamburgerMenu);
} else {
  initHamburgerMenu();
}

// ========================================
// APP STATE
// ========================================
const STATE = {
  currentPage: "/",
  buildings: [],
  user: null,
};

let homeContentSnapshot = "";

function restoreHomePage() {
  const container = document.getElementById("main-content");
  if (!container) return;

  if (homeContentSnapshot) {
    container.innerHTML = homeContentSnapshot;
  } else {
    container.innerHTML = "";
  }

  loadBuildingList();
  loadFeaturedBuildings();
  updateHeroStatsDynamically();
  setTimeout(() => {
    initHeritageMap();
  }, 250);
}

// ========================================
// ROUTER
// ========================================
function navigate(path) {
  if (!path) path = "/";
  let cleanPath = path;
  if (cleanPath.startsWith("#")) cleanPath = cleanPath.substring(1);

  let target = "index.html";
  if (cleanPath.startsWith("/buildings")) target = "buildings.html";
  else if (cleanPath.startsWith("/community")) target = "community.html";
  else if (cleanPath.startsWith("/risk")) target = "risk.html";
  else if (cleanPath.startsWith("/login")) target = "login.html";
  else if (cleanPath.startsWith("/signup")) target = "signup.html";
  else if (cleanPath.startsWith("/search")) {
    target = "buildings.html";
    if (cleanPath.includes("?")) {
      target += cleanPath.substring(cleanPath.indexOf("?"));
    }
  } else if (cleanPath === "/" || cleanPath.startsWith("/home")) {
    target = "index.html";
  }

  if (!target.includes("?") && cleanPath.includes("?")) {
    target += cleanPath.substring(cleanPath.indexOf("?"));
  }

  window.location.href = target;
}

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function renderPage(path) {
  // Disabled SPA renderPage to prevent DOM destruction. Using MPA navigation instead.
  console.log("SPA rendering disabled. Navigating via MPA:", path);
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function updateActiveNav() {
  const currentPath = STATE.currentPage || "/";
  const currentRoute = getRouteFromPath(currentPath);
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const targetRoute = href.replace(/^#\//, "").split("?")[0];
    link.classList.toggle(
      "active",
      targetRoute === currentRoute ||
        (currentRoute === "home" && targetRoute === ""),
    );
  });
}

function renderRiskPage(container) {
  renderReportPage(container);
}

function renderOfficerPage(container) {
  renderLoginPage(container);
}

function renderDashboardPage(container) {
  let userData = { name: "Citizen" };
  try {
    const stored = localStorage.getItem("citizen_user");
    if (stored) userData = JSON.parse(stored);
  } catch (e) {}

  container.innerHTML = `
        <div style="max-width: 1000px; margin: 40px auto; padding: 0 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; border-bottom: 1px solid var(--border); padding-bottom: 16px;">
                <div>
                    <h1 style="font-family: var(--font-display); font-size: 28px; margin: 0 0 8px 0; color: var(--text);">Welcome back, ${userData.name}</h1>
                    <p style="color: var(--text-muted); margin: 0;">Manage your heritage profile, virtual tours, and reports.</p>
                </div>
                <div style="      let userName = "Citizen";
      try {
        const u = JSON.parse(localStorage.getItem("citizen_user"));
        if (u && u.name) userName = u.name;
      } catch (e) {}
      
      authContainer.innerHTML = \`
        <div class="auth-user-menu" style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="toggleCitizenDropdown(event)">
            <div style="font-weight:600; color:var(--text); font-size:14px;">${userName}</div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"></path></svg>
        </div>
        <div id="citizen-dropdown" style="display:none; position:absolute; top:40px; right:0; background:white; border:1px solid var(--border); border-radius:var(--radius-sm); box-shadow:var(--shadow-sm); z-index:100; min-width:150px; padding:8px 0;">
            <a href="#" onclick="handleCitizenLogout(); return false;" style="display:block; padding:8px 16px; color:var(--accent); text-decoration:none; font-size:14px;">Sign Out</a>
        </div>
      \`;
      
      // Ensure the dropdown toggling is supported globally
      if (!window.citizenDropdownHandler) {
          window.toggleCitizenDropdown = function(e) {
              e.stopPropagation();
              const dropdown = document.getElementById('citizen-dropdown');
              if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
          };
          window.addEventListener('click', function(e) {
              const dropdown = document.getElementById('citizen-dropdown');
              if (dropdown && !e.target.closest('.auth-user-menu')) {
                  dropdown.style.display = 'none';
              }
          });
          window.citizenDropdownHandler = true;
      } font-size: 28px; font-weight: bold;">
                    ${userData.name.charAt(0).toUpperCase()}
                </div>
            </div>
            
            <div class="grid-2" style="gap: 24px;">
                <!-- Recommendations -->
                <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px; display: flex; justify-content: space-between;">
                        <span>Recommended Places</span>
                        <span style="font-size: 12px; color: var(--primary); cursor: pointer;" onclick="navigate('/map')">View Map</span>
                    </h3>
                    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                        <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&h=150&fit=crop" style="width: 80px; height: 60px; border-radius: 6px; object-fit: cover;">
                        <div>
                            <div style="font-weight: 600; font-size: 14px;">Azania Front Cathedral</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Kivukoni District</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <img src="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=200&h=150&fit=crop" style="width: 80px; height: 60px; border-radius: 6px; object-fit: cover;">
                        <div>
                            <div style="font-weight: 600; font-size: 14px;">Old Boma</div>
                            <div style="font-size: 12px; color: var(--text-muted);">City Centre</div>
                        </div>
                    </div>
                </div>

                <!-- Subscriptions / Virtual Tours -->
                <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px; display: flex; justify-content: space-between;">
                        <span>Virtual Tours History</span>
                        <span style="font-size: 12px; background: var(--muted); padding: 2px 8px; border-radius: 12px;">Active</span>
                    </h3>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <div style="font-size: 14px; font-weight: 500;">Inside the Railway Station</div>
                        <div style="font-size: 12px; color: var(--text-muted);">Watched 2 days ago</div>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <div style="font-size: 14px; font-weight: 500;">St. Joseph's Cathedral 360°</div>
                        <div style="font-size: 12px; color: var(--text-muted);">Watched 1 week ago</div>
                    </div>
                    <button class="btn-secondary" style="width: 100%; padding: 8px; font-size: 13px; margin-top: 8px;" onclick="navigate('/videos')">Explore More Tours</button>
                </div>

                <!-- Reviews -->
                <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">My Reviews</h3>
                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span style="font-weight: 600; font-size: 13px;">Askari Monument</span>
                            <span style="color: var(--gold); font-size: 12px;">★★★★★</span>
                        </div>
                        <div style="font-size: 13px; color: var(--text-muted); line-height: 1.4;">"Beautifully maintained. A great piece of history right in the roundabout."</div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span style="font-weight: 600; font-size: 13px;">Ocean Road Hospital</span>
                            <span style="color: var(--gold); font-size: 12px;">★★★★☆</span>
                        </div>
                        <div style="font-size: 13px; color: var(--text-muted); line-height: 1.4;">"Impressive architecture but needs some restoration work on the exterior."</div>
                    </div>
                </div>

                <!-- Risk Reporting -->
                <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Risk Reporting History</h3>
                    <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: #F0B429; margin-top: 6px;"></div>
                        <div>
                            <div style="font-weight: 600; font-size: 13px;">Water Damage Report</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Karimjee Hall • Reported Oct 12</div>
                            <div style="font-size: 11px; background: rgba(240, 180, 41, 0.1); color: #F0B429; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px;">Under Review</div>
                        </div>
                    </div>
                    <button class="btn-primary" style="width: 100%; padding: 8px; font-size: 13px; margin-top: 8px;" onclick="navigate('/risk')">Submit New Report</button>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// HERO FUNCTIONS
// ========================================
function handleHeroSearch() {
  const input =
    document.getElementById("hero-search") ||
    document.getElementById("hero-search-input");
  const query = input ? input.value.trim() : "";

  if (query) {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  } else if (input) {
    input.style.borderColor = "#F5611D";
    input.placeholder = "Please enter a search term";
    setTimeout(() => {
      input.style.borderColor = "";
      input.placeholder = "Search buildings or districts...";
    }, 2000);
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ========================================
// MAP PAGE
// ========================================
function renderMapPage(container) {
  container.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;padding:20px;">
            <h2 style="font-family:var(--font-display);font-size:28px;margin-bottom:16px;">Full Map View</h2>
            <p style="color:var(--text-muted);margin-bottom:20px;">Interactive map of all heritage buildings in Dar es Salaam.</p>
            <div id="full-map" style="height:600px;width:100%;border-radius:var(--radius);border:1px solid var(--border);background:#e8ecea;"></div>
            <div style="margin-top:16px;">
                <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
            </div>
        </div>
    `;

  // Initialize map after DOM update
  setTimeout(() => {
    const mapContainer = document.getElementById("full-map");
    if (mapContainer && typeof L !== "undefined") {
      const map = L.map(mapContainer).setView([-6.8, 39.28], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      if (typeof MOCK_BUILDINGS !== "undefined") {
        MOCK_BUILDINGS.forEach((b) => {
          let color =
            b.condition === "Good"
              ? "#34D5B8"
              : b.condition === "Fair"
                ? "#F0B429"
                : "#F5611D";
          L.circleMarker([b.lat, b.lng], {
            radius: 9,
            fillColor: color,
            color: "#fff",
            weight: 2,
            fillOpacity: 0.85,
          })
            .bindPopup(`<strong>${b.name}</strong><br>${b.era}`)
            .addTo(map);
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
  try {
    let buildings = [];
    if (typeof API !== "undefined" && API.getBuildings) {
      buildings = await API.getBuildings();
    } else if (typeof MOCK_BUILDINGS !== "undefined") {
      buildings = MOCK_BUILDINGS;
    }

    container.innerHTML = `
            <div style="max-width:1200px;margin:0 auto;padding:20px;">
                <h2 style="font-family:var(--font-display);font-size:28px;margin-bottom:16px;">All Buildings</h2>
                <div class="grid-3">
                    ${buildings
                      .map(
                        (b) => `
                        <div class="card" onclick="navigate('/buildings?id=${b.id}')" style="cursor:pointer;">
                            <img src="${b.image || "https://placehold.co/600x400/eeeeee/666666?text=Building+Placeholder"}" 
                                 alt="${b.name}" 
                                 style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                                 onerror="this.src='https://placehold.co/600x400/eeeeee/666666?text=No+Image'">
                            <h3 style="font-size:17px;font-weight:600;color:var(--text);">${b.name}</h3>
                            <p style="font-size:13px;color:var(--text-muted);">${b.era} · ${b.year}</p>
                            <div style="margin-top:8px;">
                                <span class="badge badge-${b.condition.toLowerCase()}">${b.condition}</span>
                                <span style="margin-left:8px;font-size:12px;color:var(--text-muted);">${b.status || "Listed"}</span>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
                
                <div style="margin-top:20px;">
                    <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
                </div>
            </div>
        `;

    console.log(" All buildings loaded:", buildings.length);
  } catch (error) {
    console.error("Error loading buildings:", error);
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
  console.log("Loading building detail for ID:", id);

  try {
    let building = null;
    if (typeof API !== "undefined" && API.getBuilding) {
      building = await API.getBuilding(id);
    } else if (typeof MOCK_BUILDINGS !== "undefined") {
      building = MOCK_BUILDINGS.find((b) => b.id === parseInt(id));
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

    // Fetch reviews from API or fallback to mock
    let reviews = [];
    try {
      if (typeof API !== "undefined" && API.getReviews) {
        reviews = await API.getReviews({ building_id: building.id });
      }
    } catch (e) {
      /* fallback */
    }
    if (!reviews || reviews.length === 0) reviews = building.reviews || [];

    // Build full images array
    const allImages = [];
    if (building.image) allImages.push(building.image);
    const extraImages = Array.isArray(building.images) ? building.images : [];
    extraImages.forEach((img) => {
      if (img && img !== building.image) allImages.push(img);
    });

    const visits = building.visits
      ? Number(building.visits).toLocaleString()
      : "—";
    const avgRating = reviews.length
      ? (
          reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : building.rating || "—";
    const condClass = (building.condition || "")
      .toLowerCase()
      .replace(/\s/g, "-");
    const panoramaUrl = building.panorama_url || null;
    const tags = Array.isArray(building.tags) ? building.tags : [];
    const has360 = tags.includes("360°") || !!panoramaUrl;
    const isAtRisk =
      tags.includes("At Risk") ||
      ["at risk", "critical"].includes(
        (building.condition || "").toLowerCase(),
      );

    container.innerHTML = `
        <div class="bdetail-page">
            <div class="bdetail-topbar">
                <button class="bdetail-back-btn" onclick="navigate('/buildings')">← All Buildings</button>
                <div class="bdetail-topbar-right">
                    ${isAtRisk ? '<span class="bdetail-risk-pill">⚑ At Risk</span>' : ""}
                    <span class="bdetail-code-pill">${building.code || "DSH-000"}</span>
                </div>
            </div>

            <div class="bdetail-hero" id="bdetail-hero">
                <div class="bdetail-hero-img-wrap">
                    <img id="bdetail-main-img"
                         src="${allImages[0] || "https://placehold.co/1200x600/0B7A69/fff?text=Heritage+Building"}"
                         alt="${building.name}"
                         onerror="this.src='https://placehold.co/1200x600/0B7A69/fff?text=Heritage+Building'"
                         class="bdetail-hero-img">
                    <div class="bdetail-hero-overlay"></div>
                </div>
                <div class="bdetail-hero-meta">
                    <div class="bdetail-hero-badges">
                        <span class="bdetail-era-tag">${building.era || "Colonial"}</span>
                        <span class="badge badge-${condClass}">${building.condition}</span>
                        ${has360 ? '<span class="bdetail-360-tag">⟳ 360°</span>' : ""}
                    </div>
                    <h1 class="bdetail-hero-title">${building.name}</h1>
                    <div class="bdetail-hero-stats">
                        <div class="bdetail-hero-stat">
                            <span class="bdetail-stat-num">${visits}</span>
                            <span class="bdetail-stat-label">Total Visits</span>
                        </div>
                        <div class="bdetail-hero-stat">
                            <span class="bdetail-stat-num">★ ${avgRating}</span>
                            <span class="bdetail-stat-label">Avg. Rating</span>
                        </div>
                        <div class="bdetail-hero-stat">
                            <span class="bdetail-stat-num">${reviews.length}</span>
                            <span class="bdetail-stat-label">Reviews</span>
                        </div>
                        <div class="bdetail-hero-stat">
                            <span class="bdetail-stat-num">${building.year || "—"}</span>
                            <span class="bdetail-stat-label">Year Built</span>
                        </div>
                    </div>
                </div>
            </div>

            ${
              allImages.length > 1
                ? `
            <div class="bdetail-gallery">
                ${allImages
                  .map(
                    (img, i) => `
                    <div class="bdetail-thumb ${i === 0 ? "active" : ""}" onclick="switchBDetailImage('${img.replace(/'/g, "\\'")}', this)">
                        <img src="${img}" alt="Photo ${i + 1}" onerror="this.parentElement.style.display='none'">
                    </div>
                `,
                  )
                  .join("")}
            </div>`
                : ""
            }

            <div class="bdetail-content">
                <div class="bdetail-left">

                    <section class="bdetail-section">
                        <div class="bdetail-section-header"><h2>About This Building</h2></div>
                        <p class="bdetail-description">${building.description || "No description available."}</p>
                        ${
                          building.significance
                            ? `
                        <div class="bdetail-significance">
                            <div class="bdetail-significance-label">Historical Significance</div>
                            <p>${building.significance}</p>
                        </div>`
                            : ""
                        }
                    </section>

                    <section class="bdetail-section">
                        <div class="bdetail-section-header"><h2>Building Details</h2></div>
                        <div class="bdetail-details-grid">
                            <div class="bdetail-detail-item"><span class="bdetail-detail-label">Architect</span><span class="bdetail-detail-value">${building.architect || "Unknown"}</span></div>
                            <div class="bdetail-detail-item"><span class="bdetail-detail-label">Style</span><span class="bdetail-detail-value">${building.style || "Colonial"}</span></div>
                            <div class="bdetail-detail-item"><span class="bdetail-detail-label">Ownership</span><span class="bdetail-detail-value">${building.ownership || "Unknown"}</span></div>
                            <div class="bdetail-detail-item"><span class="bdetail-detail-label">District</span><span class="bdetail-detail-value">${building.location || "Dar es Salaam"}</span></div>
                            <div class="bdetail-detail-item"><span class="bdetail-detail-label">Floor Area</span><span class="bdetail-detail-value">${building.area || "—"}</span></div>
                            <div class="bdetail-detail-item"><span class="bdetail-detail-label">Last Inspected</span><span class="bdetail-detail-value">${building.inspected || "—"}</span></div>
                            <div class="bdetail-detail-item"><span class="bdetail-detail-label">Heritage Status</span><span class="bdetail-detail-value">${building.status || "Listed"}</span></div>
                            <div class="bdetail-detail-item"><span class="bdetail-detail-label">GPS</span><span class="bdetail-detail-value">${building.lat}, ${building.lng}</span></div>
                        </div>
                    </section>

                    <section class="bdetail-section bdetail-tour-section" id="bdetail-tour-section">
                        <div class="bdetail-section-header">
                            <h2>⟳ 360° Virtual Tour</h2>
                            <span style="font-size:13px;color:var(--text-muted)">Drag to look around</span>
                        </div>
                        ${
                          panoramaUrl
                            ? `
                        <div class="bdetail-panorama-wrap">
                            <div id="bdetail-panorama" class="bdetail-panorama"></div>
                            <div class="bdetail-panorama-hint">🖱 Click and drag to explore · Scroll to zoom</div>
                        </div>`
                            : `
                        <div class="bdetail-tour-coming-soon">
                            <div class="bdetail-tour-icon">⟳</div>
                            <h3>Virtual Tour Coming Soon</h3>
                            <p>Our team is capturing a 360° experience of this building. Check back soon.</p>
                        </div>`
                        }
                    </section>

                    <section class="bdetail-section" id="bdetail-reviews">
                        <div class="bdetail-section-header">
                            <h2>Community Reviews</h2>
                            <span class="bdetail-review-count">${reviews.length} review${reviews.length !== 1 ? "s" : ""}</span>
                        </div>
                        ${
                          reviews.length > 0
                            ? `
                        <div class="bdetail-rating-summary">
                            <div class="bdetail-rating-big">
                                <span class="bdetail-rating-number">${avgRating}</span>
                                <div class="bdetail-rating-stars">${renderStars(parseFloat(avgRating))}</div>
                                <span class="bdetail-rating-count">${reviews.length} reviews</span>
                            </div>
                            <div class="bdetail-rating-bars">
                                ${[5, 4, 3, 2, 1]
                                  .map((star) => {
                                    const cnt = reviews.filter(
                                      (r) => r.rating === star,
                                    ).length;
                                    const pct = reviews.length
                                      ? Math.round((cnt / reviews.length) * 100)
                                      : 0;
                                    return `<div class="bdetail-rating-row">
                                        <span class="bdetail-bar-label">${star} ★</span>
                                        <div class="bdetail-bar-track"><div class="bdetail-bar-fill" style="width:${pct}%"></div></div>
                                        <span class="bdetail-bar-pct">${pct}%</span>
                                    </div>`;
                                  })
                                  .join("")}
                            </div>
                        </div>
                        <div class="bdetail-reviews-list">
                            ${reviews
                              .map(
                                (review) => `
                            <div class="bdetail-review-card">
                                <div class="bdetail-review-header">
                                    <div class="bdetail-reviewer-avatar">${review.avatar || (review.user_name || "?").charAt(0).toUpperCase()}</div>
                                    <div class="bdetail-reviewer-info">
                                        <div class="bdetail-reviewer-name">${review.user_name}</div>
                                        <div class="bdetail-review-date">${formatReviewDate(review.created_at)}</div>
                                    </div>
                                    <div class="bdetail-review-rating">${renderStars(review.rating)}</div>
                                </div>
                                <p class="bdetail-review-body">${review.body}</p>
                                <div class="bdetail-review-footer">
                                    <button class="bdetail-helpful-btn" onclick="markHelpful(this, ${review.helpful_count || 0})">
                                        👍 Helpful (${review.helpful_count || 0})
                                    </button>
                                </div>
                            </div>`,
                              )
                              .join("")}
                        </div>`
                            : `
                        <div class="bdetail-no-reviews">
                            <div class="bdetail-no-reviews-icon">💬</div>
                            <h3>No reviews yet</h3>
                            <p>Be the first to share your experience of this heritage building.</p>
                        </div>`
                        }

                        <div class="bdetail-write-review">
                            <h3>Write a Review</h3>
                            <form onsubmit="submitBuildingReview(event, ${building.id})" class="bdetail-review-form">
                                <div class="bdetail-star-picker">
                                    ${[1, 2, 3, 4, 5].map((s) => `<button type="button" class="bdetail-star-btn" onclick="selectStar(${s})" title="${s} stars">★</button>`).join("")}
                                    <input type="hidden" id="reviewRating" value="0">
                                </div>
                                <div class="bdetail-form-row">
                                    <input type="text" id="reviewName" placeholder="Your name" required class="bdetail-input">
                                </div>
                                <div class="bdetail-form-row">
                                    <textarea id="reviewBody" placeholder="Share your experience visiting or viewing this heritage building..." required rows="4" class="bdetail-textarea"></textarea>
                                </div>
                                <button type="submit" class="bdetail-submit-review-btn">Submit Review</button>
                                <div id="reviewStatus" class="bdetail-review-status"></div>
                            </form>
                        </div>
                    </section>
                </div>

                <aside class="bdetail-sidebar">
                    <div class="bdetail-sidebar-card">
                        <div class="bdetail-sidebar-card-title">📍 Location</div>
                        <div id="bdetail-mini-map" class="bdetail-mini-map"></div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:8px;">${building.location}, Dar es Salaam</div>
                        <button class="btn-primary" onclick="navigate('/map')" style="width:100%;margin-top:12px;font-size:13px;">Open Full Map</button>
                    </div>
                    <div class="bdetail-sidebar-card">
                        <div class="bdetail-sidebar-card-title">📋 Quick Facts</div>
                        <ul class="bdetail-facts-list">
                            <li><span>Built</span><strong>${building.year}</strong></li>
                            <li><span>Era</span><strong>${building.era}</strong></li>
                            <li><span>Condition</span><strong>${building.condition}</strong></li>
                            <li><span>Status</span><strong>${building.status}</strong></li>
                            <li><span>Total Visits</span><strong>${visits}</strong></li>
                        </ul>
                    </div>
                    ${
                      has360
                        ? `
                    <div class="bdetail-sidebar-card bdetail-tour-card" onclick="document.getElementById('bdetail-tour-section').scrollIntoView({behavior:'smooth'})">
                        <div class="bdetail-tour-card-inner">
                            <span class="bdetail-tour-card-icon">⟳</span>
                            <div>
                                <div class="bdetail-sidebar-card-title" style="margin-bottom:4px;color:#fff;">Virtual 360° Tour</div>
                                <div style="font-size:12px;color:rgba(255,255,255,0.7);">Interactive panoramic view</div>
                            </div>
                        </div>
                    </div>`
                        : ""
                    }
                    <button class="bdetail-report-btn" onclick="navigate('/risk')">⚑ Report This Building At Risk</button>
                </aside>
            </div>
        </div>
        `;

    if (panoramaUrl && typeof pannellum !== "undefined") {
      setTimeout(() => {
        try {
          pannellum.viewer("bdetail-panorama", {
            type: "equirectangular",
            panorama: panoramaUrl,
            autoLoad: true,
            autoRotate: -2,
            compass: true,
            title: building.name,
            hfov: 100,
            minHfov: 50,
            maxHfov: 120,
          });
        } catch (e) {
          console.warn("Pannellum error:", e);
        }
      }, 300);
    }

    if (building.lat && building.lng && typeof L !== "undefined") {
      setTimeout(() => {
        try {
          const miniMap = L.map("bdetail-mini-map", {
            zoomControl: false,
            scrollWheelZoom: false,
          }).setView([building.lat, building.lng], 15);
          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          ).addTo(miniMap);
          L.circleMarker([building.lat, building.lng], {
            radius: 10,
            fillColor: "#F0B429",
            color: "#fff",
            weight: 3,
            fillOpacity: 1,
          })
            .bindPopup(`<strong>${building.name}</strong>`)
            .addTo(miniMap)
            .openPopup();
          setTimeout(() => miniMap.invalidateSize(), 200);
        } catch (e) {
          console.warn("Mini map error:", e);
        }
      }, 400);
    }

    console.log("✓ Building detail loaded for:", building.name);
  } catch (error) {
    console.error("Error loading building detail:", error);
    container.innerHTML = `
            <div style="max-width:800px;margin:40px auto;text-align:center;padding:40px;">
                <h2 style="font-family:var(--font-display);">Error Loading Building</h2>
                <p style="color:var(--text-muted);margin:16px 0;">Something went wrong. Please try again.</p>
                <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
            </div>
        `;
  }
}

function renderStars(rating) {
  rating = parseFloat(rating) || 0;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= full) html += '<span class="bdetail-star filled">★</span>';
    else if (i === full + 1 && half)
      html += '<span class="bdetail-star half">★</span>';
    else html += '<span class="bdetail-star empty">★</span>';
  }
  return html;
}

function formatReviewDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

function switchBDetailImage(imgUrl, thumbEl) {
  const mainImg = document.getElementById("bdetail-main-img");
  if (mainImg) {
    mainImg.style.opacity = "0";
    setTimeout(() => {
      mainImg.src = imgUrl;
      mainImg.style.opacity = "1";
    }, 180);
  }
  document
    .querySelectorAll(".bdetail-thumb")
    .forEach((t) => t.classList.remove("active"));
  if (thumbEl) thumbEl.classList.add("active");
}

function selectStar(val) {
  const input = document.getElementById("reviewRating");
  if (input) input.value = val;
  document
    .querySelectorAll(".bdetail-star-btn")
    .forEach((btn, i) => btn.classList.toggle("selected", i < val));
}

function markHelpful(btn, currentCount) {
  if (btn.classList.contains("voted")) return;
  btn.classList.add("voted");
  btn.innerHTML = `✓ Helpful (${currentCount + 1})`;
}

async function submitBuildingReview(e, buildingId) {
  e.preventDefault();
  const name = document.getElementById("reviewName").value.trim();
  const body = document.getElementById("reviewBody").value.trim();
  const rating = parseInt(document.getElementById("reviewRating").value);
  const statusEl = document.getElementById("reviewStatus");
  if (!rating || rating < 1) {
    statusEl.textContent = "Please select a star rating.";
    statusEl.style.color = "var(--accent)";
    return;
  }
  try {
    if (typeof API !== "undefined" && API.createReview) {
      await API.createReview({
        building_id: buildingId,
        user_name: name,
        body,
        rating,
        helpful_count: 0,
      });
    }
    statusEl.textContent = "✓ Your review has been submitted. Thank you!";
    statusEl.style.color = "var(--primary)";
    document.getElementById("reviewName").value = "";
    document.getElementById("reviewBody").value = "";
    document.getElementById("reviewRating").value = "0";
    document
      .querySelectorAll(".bdetail-star-btn")
      .forEach((b) => b.classList.remove("selected"));
  } catch (err) {
    statusEl.textContent = "Could not submit. Please try again later.";
    statusEl.style.color = "var(--accent)";
  }
}

// ========================================
// LOGIN PAGE
// ========================================
function renderLoginPage(container) {
  container.innerHTML = `
        <div style="max-width:420px;margin:40px auto;">
            <div class="card" style="padding:32px;">
                <h2 style="font-family:var(--font-display);text-align:center;font-size:24px;">Officer Login</h2>
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
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");

  errorEl.textContent = "";

  try {
    if (typeof API !== "undefined" && API.login) {
      const result = await API.login(email, password);
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/");
        return;
      }
    }

    // Mock login
    if (email === "admin@heritage.go.tz" && password === "password") {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Admin", role: "officer" }),
      );
      navigate("/");
    } else {
      errorEl.textContent =
        " Invalid credentials. Try admin@heritage.go.tz / password";
    }
  } catch (err) {
    errorEl.textContent = "Login error. Please try again.";
  }
}

// ========================================
// SEARCH RESULTS PAGE
// ========================================
async function renderSearchResults(container, query) {
  if (!query) {
    navigate("/");
    return;
  }

  console.log("Searching for:", query);

  try {
    let buildings = [];
    if (typeof API !== "undefined" && API.getBuildings) {
      buildings = await API.getBuildings();
    } else if (typeof MOCK_BUILDINGS !== "undefined") {
      buildings = MOCK_BUILDINGS;
    }

    const results = buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.era.toLowerCase().includes(query.toLowerCase()) ||
        b.description.toLowerCase().includes(query.toLowerCase()),
    );

    container.innerHTML = `
            <div style="max-width:1200px;margin:0 auto;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
                    <h2 style="font-family:var(--font-display);font-size:28px;">Search Results</h2>
                    <span style="color:var(--text-muted);font-size:14px;">${results.length} results for "${query}"</span>
                </div>
                
                ${
                  results.length === 0
                    ? `
                    <div style="text-align:center;padding:60px 20px;">
                        <p style="font-size:48px;margin-bottom:16px;"></p>
                        <h3 style="font-family:var(--font-display);font-size:24px;">No buildings found</h3>
                        <p style="color:var(--text-muted);margin:8px 0 20px;">Try searching for a different term.</p>
                        <button class="btn-primary" onclick="navigate('/')">← Back to Home</button>
                    </div>
                `
                    : `
                    <div class="grid-3">
                        ${results
                          .map(
                            (b) => `
                            <div class="card" onclick="navigate('/buildings?id=${b.id}')" style="cursor:pointer;">
                                <img src="${b.image || "https://placehold.co/600x400/eeeeee/666666?text=Building+Placeholder"}" 
                                     alt="${b.name}" 
                                     style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                                     onerror="this.src='https://placehold.co/600x400/eeeeee/666666?text=No+Image'">
                                <h3 style="font-size:17px;font-weight:600;color:var(--text);">${b.name}</h3>
                                <p style="font-size:13px;color:var(--text-muted);">${b.era} · ${b.year}</p>
                                <div style="margin-top:8px;">
                                    <span class="badge badge-${b.condition.toLowerCase()}">${b.condition}</span>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                }
                
                <div style="margin-top:20px;">
                    <button class="btn-secondary" onclick="navigate('/')">← Back to Home</button>
                </div>
            </div>
        `;
  } catch (error) {
    console.error(" Search error:", error);
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
            <h2 style="font-family:var(--font-display);font-size:28px;">Get Involved</h2>
            <p style="color:var(--text-muted);margin-bottom:20px;">Help preserve Dar es Salaam's heritage buildings.</p>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <div class="card">
                    <h3 style="font-family:var(--font-display);font-size:18px;"> Volunteer</h3>
                    <p style="color:var(--text-muted);font-size:14px;margin:8px 0;">Join our team of heritage volunteers.</p>
                    <button class="btn-secondary" onclick="navigate('/contact')">Learn More</button>
                </div>
                <div class="card">
                    <h3 style="font-family:var(--font-display);font-size:18px;">Contribute Photos</h3>
                    <p style="color:var(--text-muted);font-size:14px;margin:8px 0;">Share photos of heritage buildings.</p>
                    <button class="btn-secondary" onclick="navigate('/contact')">Submit Photos</button>
                </div>
                <div class="card">
                    <h3 style="font-family:var(--font-display);font-size:18px;">Research</h3>
                    <p style="color:var(--text-muted);font-size:14px;margin:8px 0;">Access our research database.</p>
                    <button class="btn-secondary" onclick="navigate('/about')">Learn More</button>
                </div>
                <div class="card">
                    <h3 style="font-family:var(--font-display);font-size:18px;">Share Stories</h3>
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
            <h2 style="font-family:var(--font-display);font-size:28px;">About Urithi Majengo</h2>
            <p style="color:var(--text-muted);margin-bottom:20px;">Preserving Dar es Salaam's architectural heritage.</p>
            
            <div class="card" style="padding:24px;margin-bottom:20px;">
                <h3 style="font-family:var(--font-display);font-size:20px;">Our Mission</h3>
                <p style="color:var(--text-muted);line-height:1.8;">Urithi Majengo is a digital inventory and virtual-tour system for Dar es Salaam's heritage buildings. We document, preserve, and promote the city's architectural legacy.</p>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <div class="card">
                    <h4 style="font-family:var(--font-display);font-size:16px;"> 48+ Buildings</h4>
                    <p style="color:var(--text-muted);font-size:14px;">Documented and mapped</p>
                </div>
                <div class="card">
                    <h4 style="font-family:var(--font-display);font-size:16px;"> 5 Virtual Tours</h4>
                    <p style="color:var(--text-muted);font-size:14px;">Immersive 360° experiences</p>
                </div>
                <div class="card">
                    <h4 style="font-family:var(--font-display);font-size:16px;">6 Districts</h4>
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
            <h2 style="font-family:var(--font-display);font-size:28px;">Contact Us</h2>
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
  const mapWrapper = document.querySelector(".map-wrapper");
  const mapContainer = document.getElementById("heritage-map");
  const sidebar = document.querySelector(".map-sidebar");
  const toggleBtns = document.querySelectorAll(".toggle-btn");

  // Update active button
  toggleBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-view") === view);
  });

  if (view === "map") {
    // Show map, hide sidebar
    mapContainer.style.display = "block";
    // Show the sidebar for map view
    if (sidebar) sidebar.style.display = "";
    // Hide any grid overlay if present
    const gridContainer = document.getElementById("grid-view-container");
    if (gridContainer) gridContainer.style.display = "none";
    // Invalidate Leaflet map size so tiles render correctly after showing
    [250, 700].forEach((delay) => {
      setTimeout(() => {
        if (
          window._heritageMap &&
          typeof window._heritageMap.invalidateSize === "function"
        ) {
          try {
            window._heritageMap.invalidateSize();
          } catch (e) {
            console.warn("invalidateSize error", e);
          }
        }
      }, delay);
    });
    // ensure sidebar visible (if present)
    // (kept above for safety)
    console.log(" Switched to Map View");
  } else if (view === "grid") {
    // Hide map, show grid view
    mapContainer.style.display = "none";
    // Keep sidebar visible in grid view
    if (sidebar) sidebar.style.display = "";
    const gridContainer = document.getElementById("grid-view-container");
    if (!gridContainer) {
      createGridView();
    } else {
      gridContainer.style.display = "block";
    }
    console.log(" Switched to Grid View");
  }
}

// ========================================
// CREATE GRID VIEW WITH DOTS
// ========================================
function createGridView() {
  const mapWrapper = document.querySelector(".map-wrapper");

  // Check if already exists
  if (document.getElementById("grid-view-container")) {
    document.getElementById("grid-view-container").style.display = "block";
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

  mapWrapper.insertAdjacentHTML("afterbegin", gridHTML);

  // Add building dots
  renderGridDots();
}

// ========================================
// RENDER BUILDING DOTS ON GRID
// ========================================
function renderGridDots() {
  const dotsContainer = document.getElementById("dots-container");
  if (!dotsContainer || !MOCK_BUILDINGS) return;

  // Normalize building coordinates to SVG viewBox (0-800, 0-450)
  const minLat = -6.82,
    maxLat = -6.79,
    minLng = 39.25,
    maxLng = 39.31;

  MOCK_BUILDINGS.forEach((b) => {
    // Map lat/lng to SVG coordinates
    const x = ((b.lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - b.lat) / (maxLat - minLat)) * 450;

    // Determine color based on condition
    let color = "#34D5B8"; // Good/Excellent - teal
    if (b.condition === "Fair") color = "#F0B429"; // Yellow/gold
    if (b.condition === "Poor") color = "#F5611D"; // Orange
    if (b.condition === "Critical") color = "#E63946"; // Red

    // Create circle marker
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "10");
    circle.setAttribute("fill", color);
    circle.setAttribute("stroke", "white");
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("opacity", "0.85");
    circle.setAttribute("class", "grid-dot");
    circle.setAttribute("data-id", b.id);
    circle.setAttribute("data-name", b.name);

    // Add hover effect
    circle.style.cursor = "pointer";
    circle.style.transition = "all 0.3s ease";

    circle.addEventListener("mouseenter", function () {
      circle.setAttribute("r", "14");
      circle.setAttribute("opacity", "1");
    });

    circle.addEventListener("mouseleave", function () {
      circle.setAttribute("r", "10");
      circle.setAttribute("opacity", "0.85");
    });

    circle.addEventListener("click", function () {
      navigate(`/buildings?id=${b.id}`);
    });

    dotsContainer.appendChild(circle);
  });
}
// Removed duplicate initHeritageMap to allow index.html's full-featured map init to run.

// ========================================
// LOAD BUILDING LIST FOR SIDEBAR
// ========================================
async function loadBuildingList() {
  const list = document.getElementById("building-list");
  if (!list) {
    console.log("building-list not found");
    return;
  }

  console.log("Loading building list...");

  try {
    let buildings = [];
    if (typeof API !== "undefined" && API.getBuildings) {
      buildings = await API.getBuildings();
    } else if (typeof MOCK_BUILDINGS !== "undefined") {
      buildings = MOCK_BUILDINGS;
    }

    if (!buildings || buildings.length === 0) {
      list.innerHTML = `<p style="color:var(--text-muted);padding:20px;">No buildings found</p>`;
      return;
    }

    const sorted = buildings.sort((a, b) => a.id - b.id);

    list.innerHTML = sorted
      .map(
        (b) => `
            <div class="building-list-item" onclick="navigate('/buildings?id=${b.id}')">
                <span class="item-number">DSH-${String(b.id).padStart(3, "0")}</span>
                <div class="item-info">
                    <div class="item-name">${b.name}</div>
                    <div class="item-meta">
                        <span class="era">${b.era} · ${b.year}</span>
                        <span class="item-badge ${b.condition.toLowerCase()}">${b.condition}</span>
                    </div>
                </div>
                <span class="item-arrow">→</span>
            </div>
        `,
      )
      .join("");

    const countBadge = document.querySelector(".building-count");
    if (countBadge) countBadge.textContent = `${sorted.length} Buildings`;

    console.log("Building list loaded:", sorted.length);
  } catch (error) {
    console.error("Error loading building list:", error);
    list.innerHTML = `<p style="color:var(--text-muted);padding:20px;">Error loading buildings</p>`;
  }
}

// ========================================
// CITIZEN AUTHENTICATION MODAL
// ========================================
function showCitizenModal() {
  let modal = document.getElementById("citizen-modal");
  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeCitizenModal() {
  let modal = document.getElementById("citizen-modal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

function toggleCitizenModalView(view) {
  const loginView = document.getElementById("modal-login-view");
  const signupView = document.getElementById("modal-signup-view");
  if (view === "signup") {
    loginView.style.display = "none";
    signupView.style.display = "block";
  } else {
    loginView.style.display = "block";
    signupView.style.display = "none";
  }
}

async function handleCitizenLogin(e) {
  e.preventDefault();
  const email = document.getElementById("citizen-login-email").value;
  const password = document.getElementById("citizen-login-password").value;
  const msg = document.getElementById("citizen-login-msg");
  const btn = document.getElementById("citizen-login-btn");

  msg.textContent = "";
  msg.style.color = "var(--text)";
  btn.disabled = true;
  btn.textContent = "Signing In...";

  try {
    // API.login now handles storing token & citizen_user
    const result = await API.login(email, password);

    if (result.user && result.user.role === "officer") {
      window.location.href = "officer.html";
      return;
    }

    localStorage.setItem("citizen_auth", "true");

    closeCitizenModal();
    updateAuthUI();

    if (
      window.location.hash.includes("/risk") ||
      window.location.pathname.includes("risk.html")
    ) {
      window.location.reload();
    }
    
    // Refresh building modal if open
    const modal = document.getElementById("building-modal");
    if (modal && !modal.classList.contains("hidden")) {
      const activeBuildingId = modal.dataset.buildingId;
      if (activeBuildingId && typeof buildings !== "undefined") {
          const b = buildings.find(x => String(x.id) === String(activeBuildingId)) || (typeof MOCK_BUILDINGS !== 'undefined' ? MOCK_BUILDINGS.find(x => String(x.id) === String(activeBuildingId)) : null);
          if (b) openBuildingModal(b);
      }
    }
  } catch (err) {
    msg.textContent =
      err.message || "Login failed. Please check your credentials.";
    msg.style.color = "var(--accent)";
  } finally {
    btn.disabled = false;
    btn.textContent = "Sign In";
  }
}

async function handleCitizenSignup(e) {
  e.preventDefault();
  const name = document.getElementById("citizen-signup-name").value;
  const email = document.getElementById("citizen-signup-email").value;
  const password = document.getElementById("citizen-signup-password").value;
  const msg = document.getElementById("citizen-signup-msg");
  const btn = document.getElementById("citizen-signup-btn");

  msg.textContent = "";
  msg.style.color = "var(--text)";
  btn.disabled = true;
  btn.textContent = "Creating Account...";

  try {
    // API.register stores token & citizen_user if session is returned immediately
    const result = await API.register(name, email, password);

    if (result.token) {
      // Logged in directly (email confirmation disabled in Supabase)
      localStorage.setItem("citizen_auth", "true");
      closeCitizenModal();
      updateAuthUI();
    } else {
      // Email confirmation required — show message, don't close modal
      msg.style.color = "var(--primary)";
      msg.textContent =
        "✓ Account created! Please check your email to confirm, then sign in.";
      btn.textContent = "Check Your Email";
      return;
    }

    if (
      window.location.hash.includes("/risk") ||
      window.location.pathname.includes("risk.html")
    ) {
      window.location.reload();
    }
  } catch (err) {
    msg.textContent = err.message || "Registration failed.";
    msg.style.color = "var(--accent)";
  } finally {
    btn.disabled = false;
    if (btn.textContent !== "Check Your Email")
      btn.textContent = "Create Account";
  }
}

function handleCitizenLogout() {
  localStorage.removeItem("citizen_auth");
  localStorage.removeItem("citizen_user");
  updateAuthUI();
  if (window.location.hash === "#/dashboard") {
    navigate("/");
  } else {
    window.location.reload();
  }
}

function toggleAvatarDropdown() {
  const dropdown = document.getElementById("avatar-dropdown-menu");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

function updateAuthUI() {
  const isAuth = localStorage.getItem("citizen_auth") === "true";
  const authContainer = document.getElementById("nav-auth-container");

  if (authContainer) {
    if (isAuth) {
      let userData = { name: "Citizen" };
      try {
        const stored = localStorage.getItem("citizen_user");
        if (stored) userData = JSON.parse(stored);
      } catch (e) {}

      const initial = userData.name.charAt(0).toUpperCase();

      authContainer.innerHTML = `
                <div style="position: relative;" id="avatar-container">
                    <button class="nav-avatar-btn" onclick="toggleAvatarDropdown()" aria-label="User menu">
                        ${initial}
                    </button>
                    <div id="avatar-dropdown-menu" class="avatar-dropdown">
                        <div style="padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--muted); margin-bottom: 4px;">
                            <div style="font-size: 13px; font-weight: 600; color: var(--text);">${userData.name}</div>
                            <div style="font-size: 11px; color: var(--text-muted); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${userData.email || "citizen@urithi.go.tz"}</div>
                        </div>
                        <a href="#/dashboard" onclick="navigate('/dashboard'); toggleAvatarDropdown(); return false;">Dashboard</a>
                        <a href="#" onclick="handleCitizenLogout(); return false;">Sign Out</a>
                    </div>
                </div>
            `;

      // Re-attach close dropdown event listener precisely once
      document.removeEventListener("click", _closeAvatarDropdown);
      document.addEventListener("click", _closeAvatarDropdown);
    } else {
      authContainer.innerHTML =
        '<a href="#" onclick="showCitizenModal(); return false;" style="font-weight: 600; color: var(--accent) !important;">Sign In</a>';
    }
  }
}

function _closeAvatarDropdown(e) {
  const container = document.getElementById("avatar-container");
  if (container && !container.contains(e.target)) {
    const dropdown = document.getElementById("avatar-dropdown-menu");
    if (dropdown && dropdown.classList.contains("active")) {
      dropdown.classList.remove("active");
    }
  }
}

// Ensure auth UI is updated on load
document.addEventListener("DOMContentLoaded", updateAuthUI);

// ========================================
// VIDEO LIGHTBOX FUNCTIONS
// ========================================
function openVideoLightbox(videoId, title, embedUrl) {
  const isCitizenAuthenticated =
    localStorage.getItem("citizen_auth") === "true";
  let watchCount = parseInt(localStorage.getItem("video_watch_count") || "0");

  if (!isCitizenAuthenticated && watchCount >= 3) {
    showCitizenModal();
    return; // Prevent opening video
  }

  const lightbox = document.getElementById("video-lightbox");
  const player = document.getElementById("video-lightbox-player");

  if (lightbox && player) {
    if (!isCitizenAuthenticated) {
      localStorage.setItem("video_watch_count", (watchCount + 1).toString());
    }
    player.src = embedUrl + (embedUrl.includes("?") ? "&" : "?") + "autoplay=1";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeVideoLightbox() {
  const lightbox = document.getElementById("video-lightbox");
  const player = document.getElementById("video-lightbox-player");

  if (lightbox && player) {
    lightbox.classList.remove("active");
    player.src = "";
    document.body.style.overflow = "";
  }
}

// Close lightbox on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeVideoLightbox();
  }
});

// Close lightbox on background click
document.addEventListener("click", function (e) {
  const lightbox = document.getElementById("video-lightbox");
  if (e.target === lightbox) {
    closeVideoLightbox();
  }

  const modal = document.getElementById("citizen-modal");
  if (modal && e.target === modal) {
    closeCitizenModal();
  }
});

// ========================================
// LOAD FEATURED BUILDINGS
// ========================================
async function loadFeaturedBuildings() {
  const grid = document.getElementById("building-grid");
  if (!grid) return;

  console.log("Loading featured buildings...");

  try {
    let buildings = [];
    if (typeof API !== "undefined" && API.getBuildings) {
      buildings = await API.getBuildings();
    } else if (typeof MOCK_BUILDINGS !== "undefined") {
      buildings = MOCK_BUILDINGS;
    }

    if (!buildings || buildings.length === 0) {
      grid.innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center;">No buildings found</p>`;
      return;
    }

    const featured = buildings.slice(0, 3);
    grid.innerHTML = featured
      .map(
        (b) => `
            <div class="card" onclick="navigate('/buildings?id=${b.id}')" style="cursor:pointer;">
                <img src="${b.image || "https://images.unsplash.com/photo-1759837107238-7637c2446e6c"}" 
                     alt="${b.name}" 
                     style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;"
                     onerror="this.src='https://placehold.co/600x400/eeeeee/666666?text=No+Image'">
                <h3 style="font-size:17px;font-weight:600;color:var(--text);">${b.name}</h3>
                <p style="font-size:13px;color:var(--text-muted);">${b.era} · ${b.year}</p>
                <div style="margin-top:8px;">
                    <span class="badge badge-${b.condition.toLowerCase()}">${b.condition}</span>
                    <span style="margin-left:8px;font-size:12px;color:var(--text-muted);">${b.status || "Listed"}</span>
                </div>
            </div>
        `,
      )
      .join("");

    console.log(" Featured buildings loaded:", featured.length);
  } catch (error) {
    console.error("Error loading featured buildings:", error);
    grid.innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center;">Error loading buildings</p>`;
  }
}

// ========================================
// ========================================
// HASH CHANGE LISTENER (DISABLED)
// ========================================
// window.addEventListener('hashchange', function() {
//     const path = window.location.hash.slice(1) || '/';
//     renderPage(path);
// });

// ========================================
// INITIALIZE EVERYTHING ON PAGE LOAD
// ========================================
async function updateHeroStatsDynamically() {
  try {
    if (typeof API !== "undefined") {
      let buildingsData = [];
      if (API.getBuildings) {
        buildingsData = await API.getBuildings();
      } else if (typeof MOCK_BUILDINGS !== "undefined") {
        buildingsData = MOCK_BUILDINGS;
      }
      
      let pendingFlagsCount = 0;
      if (API.getFlags) {
         try {
             const flags = await API.getFlags();
             pendingFlagsCount = flags.filter(f => f.status === 'pending').length;
         } catch(e) {
             console.warn("Failed to fetch flags for hero stats", e);
         }
      }

      if (buildingsData && buildingsData.length > 0) {
        const totalBuildings = buildingsData.length;
        const bElement = document.getElementById("hero-stat-buildings");
        const bSubtitle = document.getElementById("hero-stat-subtitle-count");
        if (bElement) bElement.textContent = totalBuildings;
        if (bSubtitle) bSubtitle.textContent = totalBuildings;

        const toursCount = buildingsData.filter(b => b.panorama_url || (b.tags && b.tags.includes("360°"))).length;
        const tElement = document.getElementById("hero-stat-tours");
        if (tElement) tElement.textContent = toursCount;

        const districts = new Set(buildingsData.map(b => b.location).filter(Boolean));
        const dElement = document.getElementById("hero-stat-districts");
        if (dElement) dElement.textContent = districts.size;
      }

      const rElement = document.getElementById("hero-stat-risks");
      if (rElement) {
          // If no pending flags are found in the dynamic fetch, keep the hardcoded fallback or use 0 if API is responsive
          if (pendingFlagsCount > 0 || (buildingsData && buildingsData.length > 0)) {
              rElement.textContent = pendingFlagsCount;
          }
      }
    }
  } catch (error) {
    console.error("Failed to update hero stats dynamically:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded - Starting app...");
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    homeContentSnapshot = mainContent.innerHTML;
  }

  // SPA rendering disabled
  // const path = window.location.hash.slice(1) || '/';
  // renderPage(path);

  loadBuildingList();
  loadFeaturedBuildings();
  updateHeroStatsDynamically();

  setTimeout(function () {
    initHeritageMap();
  }, 500);
  // Ensure page starts at top (fixes stray initial scroll position in some previews)
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } catch (e) {
    window.scrollTo(0, 0);
  }
});

console.log("app.js loaded successfully");
// ========================================
// LOAD BUILDINGS FROM API
// ========================================

let buildings = [];

async function loadBuildingsData() {
  try {
    // Try API first
    if (typeof API !== "undefined" && API.getBuildings) {
      buildings = await API.getBuildings();
      console.log(" Buildings loaded from API:", buildings.length);
    } else {
      // Fallback to MOCK_BUILDINGS
      if (typeof MOCK_BUILDINGS !== "undefined") {
        buildings = MOCK_BUILDINGS;
        console.log("Using MOCK_BUILDINGS as fallback");
      }
    }

    // If still empty, use hardcoded fallback
    if (!buildings || buildings.length === 0) {
      buildings = getFallbackBuildings();
      console.log("Using hardcoded fallback data");
    }

    // Render the grid
    renderGrid(buildings);
  } catch (error) {
    console.error(" Error loading buildings:", error);
    // Fallback to hardcoded
    buildings = getFallbackBuildings();
    renderGrid(buildings);
  }
}

// ========================================
// FALLBACK BUILDINGS (Hardcoded)
// ========================================

function getFallbackBuildings() {
  return [
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
      description:
        "Late German colonial building overseeing the commercial harbour.",
      significance:
        "Documents the evolution of Dar es Salaam as a major East African port.",
      architect: "Unknown",
      ownership: "Tanzania Ports Authority",
      style: "German Colonial Administrative",
      inspected: "2023-11-08",
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
      description: "Neo-Gothic Catholic cathedral with twin towers.",
      significance: "One of the oldest religious buildings in Dar es Salaam.",
      architect: "Unknown",
      ownership: "Catholic Archdiocese",
      style: "Neo-Gothic",
      inspected: "2023-11-08",
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
      description: "Historic Lutheran church with distinctive architecture.",
      significance: "A landmark on the Dar es Salaam waterfront.",
      architect: "Unknown",
      ownership: "Lutheran Church of Tanzania",
      style: "Romanesque Revival",
      inspected: "2023-11-08",
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
      description: "Historic harbour master's office building.",
      significance: "Represents British colonial maritime administration.",
      architect: "Unknown",
      ownership: "Tanzania Ports Authority",
      style: "Colonial Maritime",
      inspected: "2023-11-08",
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
      description: "Historic post office building in need of restoration.",
      significance: "A key example of British colonial public architecture.",
      architect: "Unknown",
      ownership: "Government of Tanzania",
      style: "Edwardian Colonial",
      inspected: "2023-11-08",
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
      description: "Historic city hall building with colonial architecture.",
      significance:
        "Represents the transition from colonial to independent governance.",
      architect: "Unknown",
      ownership: "Dar es Salaam City Council",
      style: "Modern Colonial",
      inspected: "2023-11-08",
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
      description:
        "Original hospital building currently at risk of demolition.",
      significance: "Represents the development of healthcare infrastructure.",
      architect: "Unknown",
      ownership: "Government of Tanzania",
      style: "Colonial Medical",
      inspected: "2023-11-08",
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
      description:
        "Historic railway station with distinctive colonial architecture.",
      significance: "A major gateway to Dar es Salaam.",
      architect: "Unknown",
      ownership: "Tanzania Railways Corporation",
      style: "Colonial Railway",
      inspected: "2023-11-08",
    },
  ];
}

// ========================================
// RENDER GRID FUNCTION
// ========================================

function renderGrid(data) {
  const buildingGrid = document.getElementById("buildingGrid");
  const resultsCount = document.getElementById("resultsCount");

  if (!buildingGrid) return;

  if (resultsCount) {
    resultsCount.textContent = `${data.length} results`;
  }

  buildingGrid.innerHTML = "";

  data.forEach((building) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = building.id;

    const imageSrc =
      building.image ||
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop";
    const eraClass = building.era
      ? building.era.toLowerCase().replace(/\s+/g, "-")
      : "unknown";
    const conditionClass = building.condition
      ? building.condition.toLowerCase().replace(/\s+/g, "-")
      : "unknown";
    const gradeClass = building.grade
      ? building.grade.toLowerCase().replace(/\s+/g, "-")
      : "unknown";

    card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${imageSrc}" alt="${building.title}" class="card-image" onerror="this.src='https://via.placeholder.com/600x400/cccccc/666?text=No+Image'">
                <span class="badge era-badge era-${eraClass}">${building.era || "Unknown"}</span>
                ${building.has360 ? '<span class="badge badge-360">360°</span>' : ""}
                ${building.atRisk ? '<span class="badge at-risk-badge">⚑ AT RISK</span>' : ""}
            </div>
            <div class="card-content">
                <h3 class="card-title">${building.title || building.name || "Unnamed Building"}</h3>
                <div class="badge-row">
                    <span class="status-tag cond-${conditionClass}">${building.condition || "Unknown"}</span>
                    <span class="status-tag grade-${gradeClass}">${building.grade || "Listed"}</span>
                </div>
                <div class="card-footer">
                    <span class="location-tag"> ${building.location || "Dar es Salaam"}</span>
                    <span class="year-tag"> ${building.year || "N/A"}</span>
                </div>
            </div>
        `;
    card.addEventListener("click", () => openModal(building.id));
    buildingGrid.appendChild(card);
  });
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("Loading buildings from API...");
  loadBuildingsData();
});

// ========================================
// OPEN MODAL FUNCTION

function openModal(id) {
  const building = buildings.find((b) => b.id === id);
  if (!building) return;
  resetModalTabs();

  // Map database elements to modal nodes dynamically
  if (document.getElementById("modalTitle"))
    document.getElementById("modalTitle").textContent =
      building.title || building.name;
  if (document.getElementById("modalEra"))
    document.getElementById("modalEra").textContent = building.era;
  if (document.getElementById("modalCondition"))
    document.getElementById("modalCondition").textContent = building.condition;
  if (document.getElementById("modalHero"))
    document.getElementById("modalHero").style.backgroundImage =
      `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${building.image}')`;

  if (document.getElementById("modalDistrict"))
    document.getElementById("modalDistrict").textContent = building.location;
  if (document.getElementById("modalBuilt"))
    document.getElementById("modalBuilt").textContent = building.year;
  if (document.getElementById("modalArea"))
    document.getElementById("modalArea").textContent = building.area || "N/A";
  if (document.getElementById("modalStatus"))
    document.getElementById("modalStatus").textContent =
      building.grade || building.status;

  if (document.getElementById("modalDescription"))
    document.getElementById("modalDescription").textContent =
      building.description || "";
  if (document.getElementById("modalSignificance"))
    document.getElementById("modalSignificance").textContent =
      building.significance || "";
  if (document.getElementById("modalArchitect"))
    document.getElementById("modalArchitect").textContent =
      building.architect || "Unknown";
  if (document.getElementById("modalOwnership"))
    document.getElementById("modalOwnership").textContent =
      building.ownership || "Public Asset";
  if (document.getElementById("modalStyle"))
    document.getElementById("modalStyle").textContent =
      building.style || "Vernacular Heritage";
  if (document.getElementById("modalInspected"))
    document.getElementById("modalInspected").textContent =
      building.inspected || "Pending";

  const detailModal = document.getElementById("detailModal");
  if (detailModal) detailModal.classList.add("active");
}

const theCloseModalBtn = document.getElementById("closeModalBtn");
const theDetailModal = document.getElementById("detailModal");
if (theCloseModalBtn && theDetailModal) {
  theCloseModalBtn.addEventListener("click", () =>
    theDetailModal.classList.remove("active"),
  );
}
window.addEventListener("click", (e) => {
  if (theDetailModal && e.target === theDetailModal)
    theDetailModal.classList.remove("active");
});

const tabs = document.querySelectorAll(".tab-item");
const panels = document.querySelectorAll(".modal-panel");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");

    if (panels[index]) panels[index].classList.add("active");
  });
});

function resetModalTabs() {
  tabs.forEach((t) => t.classList.remove("active"));
  panels.forEach((p) => p.classList.remove("active"));

  if (tabs[0]) tabs[0].classList.add("active");
  if (panels[0]) panels[0].classList.add("active");
}
// Live typing Search implementation
const searchInputElement = document.getElementById("searchInput");
if (searchInputElement) {
  searchInputElement.addEventListener("input", (e) => {
    const text = e.target.value.toLowerCase();
    const filtered = buildings.filter(
      (b) =>
        (b.title || b.name || "").toLowerCase().includes(text) ||
        (b.location || "").toLowerCase().includes(text),
    );
    renderGrid(filtered);
  });
}

if (typeof renderGrid === "function") {
  renderGrid(buildings);
}

// ========================================
// BUILDING MODAL FUNCTIONS
// ========================================

async function renderBuildingReviewsTab(building) {
  const reviewsContent = document.getElementById("bm-tab-reviews");
  if (!reviewsContent) return;
  reviewsContent.innerHTML = `<div style="padding:40px;text-align:center;">Loading reviews...</div>`;
  
  let reviews = [];
  try {
    if (typeof API !== "undefined" && API.getReviews) {
      reviews = await API.getReviews({ building_id: building.id });
    }
  } catch (e) {
    reviews = building.reviews || [];
  }
  
  const isLoggedIn = localStorage.getItem("citizen_auth") === "true";
  
  let html = `<div style="max-width:800px; margin: 0 auto; text-align: left;">`;
  html += `<h3 style="margin-bottom:16px;">Community Reviews (${reviews.length})</h3>`;
  
  if (reviews.length === 0) {
      html += `<div class="bm-reviews-empty" style="text-align:center; padding: 40px; background: var(--bg-alt); border-radius: var(--radius-md);">
          <div style="font-size:48px;margin-bottom:16px;">💬</div>
          <h3>No reviews yet</h3>
          <p>Be the first to share your experience of this heritage building.</p>
      </div>`;
  } else {
      html += `<div style="display:flex; flex-direction:column; gap:16px; margin-bottom: 32px;">`;
      reviews.forEach(review => {
          html += `<div style="padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                    ${review.avatar || (review.user_name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                    <div style="font-weight: 600;">${review.user_name}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${new Date(review.created_at).toLocaleDateString()}</div>
                </div>
                <div style="margin-left: auto; color: #F0B429;">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <p style="font-size: 14px; line-height: 1.5; margin:0;">${review.body}</p>
          </div>`;
      });
      html += `</div>`;
  }
  
  if (isLoggedIn) {
      let currentUserName = "Citizen";
      try { currentUserName = JSON.parse(localStorage.getItem('citizen_user') || '{}').name || "Citizen"; } catch(e){}
      html += `<div style="margin-top: 32px; padding: 24px; background: var(--bg-alt); border-radius: var(--radius-md);">
          <h3 style="margin-bottom: 16px;">Write a Review</h3>
          <form onsubmit="submitBuildingReview(event, ${building.id})" style="display:flex; flex-direction:column; gap: 16px;">
              <div>
                  <label style="display:block; margin-bottom: 8px; font-weight: 500;">Rating</label>
                  <select id="reviewRating" required style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-family: inherit;">
                      <option value="">Select a rating...</option>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Terrible</option>
                  </select>
              </div>
              <input type="hidden" id="reviewName" value="${currentUserName}">
              <div>
                  <label style="display:block; margin-bottom: 8px; font-weight: 500;">Review</label>
                  <textarea id="reviewBody" placeholder="Share your experience..." required rows="4" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-sm); resize: vertical; font-family: inherit;"></textarea>
              </div>
              <button type="submit" class="btn-primary" style="align-self: flex-start;">Submit Review</button>
              <div id="reviewStatus" style="font-size: 14px; margin-top: 8px;"></div>
          </form>
      </div>`;
  } else {
      html += `<div style="margin-top: 32px; text-align: center; padding: 32px; border: 1px dashed var(--border); border-radius: var(--radius-md);">
          <h3 style="margin-bottom: 12px;">Share your experience</h3>
          <button class="btn-primary" onclick="showCitizenModal()">Sign In to Review</button>
      </div>`;
  }
  
  html += `</div>`;
  reviewsContent.innerHTML = html;
}

function openBuildingModal(building) {
  const modal = document.getElementById("building-modal");
  if (!modal) return;

  // Populate modal data
  document.getElementById("bm-img").src =
    building.image ||
    "https://via.placeholder.com/800x400/cccccc/666?text=Heritage+Building";
  document.getElementById("bm-id").textContent =
    building.code || "DSH-" + String(building.id).padStart(3, "0");
  document.getElementById("bm-name").textContent = building.name;
  document.getElementById("bm-district").textContent =
    building.district || building.location || "Dar es Salaam";
  document.getElementById("bm-year").textContent = building.year || "—";
  document.getElementById("bm-area").textContent = building.area || "—";
  document.getElementById("bm-legal").textContent =
    building.legal || building.status || "Listed";

  // Populate badges
  const badgesContainer = document.getElementById("bm-badges");
  const tags = Array.isArray(building.tags) ? building.tags : [];
  let badgesHTML = "";

  // Era badge
  if (building.era) {
    badgesHTML += `<span class="badge" style="background:var(--gold);color:var(--dark)">${building.era}</span>`;
  }

  // Condition badge
  const condClass = (building.condition || "").toLowerCase();
  badgesHTML += `<span class="badge badge-${condClass}">${building.condition || "Unknown"}</span>`;

  // 360° badge
  if (tags.includes("360°") || building.panorama_url) {
    badgesHTML += `<span class="badge" style="background:#6366F1;color:#fff">⟳ 360°</span>`;
  }

  // At Risk badge
  if (tags.includes("At Risk")) {
    badgesHTML += `<span class="badge" style="background:var(--accent);color:#fff">⚑ AT RISK</span>`;
  }

  badgesContainer.innerHTML = badgesHTML;

  // Populate overview tab
  const overviewContent = document.getElementById("bm-tab-overview");
  overviewContent.innerHTML = `
        <div class="bm-overview-content">
            <p>${building.description || "No description available."}</p>
            ${
              building.significance
                ? `
                <div class="bm-significance">
                    <div class="bm-significance-label">Historical Significance</div>
                    <p>${building.significance}</p>
                </div>
            `
                : ""
            }
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:16px;">
                <div style="background:var(--muted);padding:12px;border-radius:8px;">
                    <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Architect</div>
                    <div style="font-weight:600;">${building.architect || "Unknown"}</div>
                </div>
                <div style="background:var(--muted);padding:12px;border-radius:8px;">
                    <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Style</div>
                    <div style="font-weight:600;">${building.style || "Colonial"}</div>
                </div>
                <div style="background:var(--muted);padding:12px;border-radius:8px;">
                    <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Ownership</div>
                    <div style="font-weight:600;">${building.ownership || "Unknown"}</div>
                </div>
                <div style="background:var(--muted);padding:12px;border-radius:8px;">
                    <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Last Inspected</div>
                    <div style="font-weight:600;">${building.inspected || "—"}</div>
                </div>
            </div>
        </div>
    `;

  // Populate tour tab
  const tourContent = document.getElementById("bm-tab-tour");
  if (building.panorama_url) {
    tourContent.innerHTML = `
            <div id="bm-panorama-container" style="height:400px;border-radius:8px;overflow:hidden;"></div>
            <div style="text-align:center;color:var(--text-muted);font-size:13px;margin-top:8px;">🖱 Click and drag to explore · Scroll to zoom</div>
        `;
    // Initialize pannellum if available
    if (typeof pannellum !== "undefined") {
      setTimeout(() => {
        try {
          pannellum.viewer("bm-panorama-container", {
            type: "equirectangular",
            panorama: building.panorama_url,
            autoLoad: true,
            autoRotate: -2,
            compass: true,
            title: building.name,
            hfov: 100,
            minHfov: 50,
            maxHfov: 120,
          });
        } catch (e) {
          console.warn("Pannellum error:", e);
        }
      }, 300);
    }
  } else {
    tourContent.innerHTML = `
            <div class="bm-tour-placeholder">
                <div style="font-size:48px;margin-bottom:16px;">⟳</div>
                <h3>Virtual Tour Coming Soon</h3>
                <p>Our team is capturing a 360° experience of this building. Check back soon.</p>
            </div>
        `;
  }

  // Populate reviews tab
  modal.dataset.buildingId = building.id;
  renderBuildingReviewsTab(building);

  // Reset tabs to overview
  switchBMTab("overview", document.querySelector(".bm-tab"));

  // Show modal
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function handleOverlayClick(event, modalId) {
  if (event.target.classList.contains("modal-overlay")) {
    closeModal(modalId);
  }
}

function switchBMTab(tabName, tabElement) {
  // Update tab styles
  document.querySelectorAll(".bm-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  if (tabElement) {
    tabElement.classList.add("active");
  }

  // Show/hide content
  document.getElementById("bm-tab-overview").style.display =
    tabName === "overview" ? "block" : "none";
  document.getElementById("bm-tab-tour").style.display =
    tabName === "tour" ? "block" : "none";
  document.getElementById("bm-tab-reviews").style.display =
    tabName === "reviews" ? "block" : "none";
}
