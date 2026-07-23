// ========================================
// API LAYER - CONNECTED TO BACKEND
// ========================================

const API = {
  // Backend URL (dynamic based on current host)
  get baseUrl() {
    if (typeof window !== "undefined" && window.location) {
      const port = window.location.port;
      if (port === "5000") {
        return "/api";
      }
    }
    return "http://localhost:5000/api";
  },

  // ========================================
  // HELPERS
  // ========================================

  /** Get the JWT token from localStorage */
  getToken() {
    return localStorage.getItem("token");
  },

  /** Build Authorization header if token exists */
  authHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /** Handle fetch response, parse JSON, and intercept 401/403 errors */
  async handleResponse(response) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname.includes("officer.html")) {
        window.location.href = "login.html?session_expired=true";
      }
      throw new Error("Unauthorized or session expired.");
    }
    
    // Some responses might not have JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      return data;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return null;
  },

  // ========================================
  // BUILDINGS
  // ========================================

  async getBuildings(params = {}) {
    const bypassCache = params.bypassCache === true;
    delete params.bypassCache; // remove so it doesn't go to URL
    const qs = new URLSearchParams(params).toString();
    const hasParams = qs.length > 0;

    // Cache check removed for real-time data

    try {
      const url = hasParams
        ? `${this.baseUrl}/buildings?${qs}`
        : `${this.baseUrl}/buildings`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      let data = await response.json();
      data = Array.isArray(data) ? data : (data.buildings || data.data || []);

      // Cache the response only if no params (cache removed)
      return data;
    } catch (e) {
      console.warn("API getBuildings failed, using MOCK_BUILDINGS fallback");
      if (typeof MOCK_BUILDINGS !== "undefined") {
        if (hasParams && params.q) {
          const q = params.q.toLowerCase();
          return MOCK_BUILDINGS.filter(
            (b) =>
              b.name.toLowerCase().includes(q) ||
              b.location.toLowerCase().includes(q),
          );
        }
        return MOCK_BUILDINGS;
      }
      throw e;
    }
  },

  async getBuilding(id) {
    // Cache check removed for real-time data

    try {
      const response = await fetch(`${this.baseUrl}/buildings/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      // Cache the response (cache removed)
      return data;
    } catch (e) {
      console.warn("API getBuilding failed, using MOCK_BUILDINGS fallback");
      if (typeof MOCK_BUILDINGS !== "undefined") {
        const b = MOCK_BUILDINGS.find((b) => b.id === parseInt(id));
        if (b) return b;
      }
      throw e;
    }
  },

  async createBuilding(data) {
    const response = await fetch(`${this.baseUrl}/buildings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeader(),
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to create building");
    // Clear cache on successful creation
    localStorage.removeItem("cached_buildings");
    localStorage.removeItem("buildings_cache_time");
    return result;
  },

  async updateBuilding(id, data) {
    const response = await fetch(`${this.baseUrl}/buildings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeader(),
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to update building");
    // Clear cache on successful update
    localStorage.removeItem("cached_buildings");
    localStorage.removeItem("buildings_cache_time");
    localStorage.removeItem(`cached_building_${id}`);
    localStorage.removeItem(`building_cache_time_${id}`);
    return result;
  },

  async deleteBuilding(id) {
    const response = await fetch(`${this.baseUrl}/buildings/${id}`, {
      method: "DELETE",
      headers: { ...this.authHeader() },
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to delete building");
    // Clear cache on successful deletion
    localStorage.removeItem("cached_buildings");
    localStorage.removeItem("buildings_cache_time");
    localStorage.removeItem(`cached_building_${id}`);
    localStorage.removeItem(`building_cache_time_${id}`);
    return result;
  },

  // ========================================
  // AUTHENTICATION
  // ========================================

  async register(full_name, email, password) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  },

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    // Store token and full user info
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    // Legacy key for other pages
    if (data.user)
      localStorage.setItem(
        "citizen_user",
        JSON.stringify({
          name: data.user.full_name || email.split("@")[0],
          email: data.user.email,
          role: data.user.role,
        }),
      );
    return data;
  },

  async getMe() {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: { ...this.authHeader() },
    });
    return await response.json();
  },

  // ========================================
  // FLAGS (Citizen Reports)
  // ========================================

  async getFlags(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const url = qs ? `${this.baseUrl}/flags?${qs}` : `${this.baseUrl}/flags`;
      const response = await fetch(url, {
        headers: { ...this.authHeader() },
        cache: "no-store",
      });
      const data = await this.handleResponse(response);
      return Array.isArray(data) ? data : (data.flags || data.data || []);
    } catch (e) {
      console.warn("API getFlags failed, returning mock flags");
      return typeof MOCK_FLAGS !== "undefined" ? MOCK_FLAGS : [];
    }
  },

  async createFlag(data) {
    try {
      const response = await fetch(`${this.baseUrl}/flags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit flag");
      return result;
    } catch (e) {
      console.warn("API createFlag failed, mocking success", e);
      if (typeof MOCK_FLAGS !== "undefined") {
        MOCK_FLAGS.push({
          id: MOCK_FLAGS.length ? Math.max(...MOCK_FLAGS.map(f => f.id)) + 1 : 1,
          ...data,
          status: "pending",
          created_at: new Date().toISOString()
        });
      }
      return { flag: data, message: "Flag report submitted" };
    }
  },

  async updateFlag(id, data) {
    const response = await fetch(`${this.baseUrl}/flags/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeader(),
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to update flag status");
    }
    return result;
  },

  // ========================================
  // REVIEWS
  // ========================================

  async getReviews(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const url = qs
        ? `${this.baseUrl}/reviews?${qs}`
        : `${this.baseUrl}/reviews`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      // Normalize to array — backend may return array or { reviews: [] }
      return Array.isArray(data) ? data : (data.reviews || data.data || []);
    } catch (e) {
      console.warn("API getReviews failed, returning MOCK_REVIEWS");
      return typeof MOCK_REVIEWS !== "undefined" ? MOCK_REVIEWS : [];
    }
  },

  async createReview(data) {
    try {
      const response = await fetch(`${this.baseUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.authHeader(),
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit review");
      return result;
    } catch (e) {
      console.warn("API createReview failed, mocking success", e);
      if (typeof MOCK_REVIEWS !== "undefined") {
        MOCK_REVIEWS.unshift({
          id: MOCK_REVIEWS.length ? Math.max(...MOCK_REVIEWS.map(r => r.id)) + 1 : 1,
          ...data,
          created_at: new Date().toISOString()
        });
      }
      return { review: data, message: "Review submitted" };
    }
  },

  async upvoteReview(id) {
    const response = await fetch(`${this.baseUrl}/reviews/${id}/helpful`, {
      method: "POST",
      headers: { ...this.authHeader() },
    });
    return await response.json();
  },

  // ========================================
  // OFFICERS (super-officer only)
  // ========================================
  // OFFICERS (super-officer only)
  // ========================================

  async getOfficers() {
    const response = await fetch(`${this.baseUrl}/officers`, {
      headers: { ...this.authHeader() },
    });
    return this.handleResponse(response);
  },

  async getCitizens() {
    const response = await fetch(`${this.baseUrl}/officers/citizens`, {
      headers: { ...this.authHeader() },
    });
    return this.handleResponse(response);
  },

  async inviteOfficer(email) {
    const response = await fetch(`${this.baseUrl}/officers/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeader(),
      },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
  },

  async removeOfficer(userId) {
    const response = await fetch(`${this.baseUrl}/officers/${userId}`, {
      method: "DELETE",
      headers: { ...this.authHeader() },
    });
    return this.handleResponse(response);
  },

  // ========================================
  // PHOTO UPLOAD (to backend / Supabase Storage)
  // ========================================

  async uploadFlagPhoto(file) {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(`${this.baseUrl}/upload/flag-photo`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn("Photo upload failed, continuing without photo.");
      return null;
    }
    const result = await response.json();
    return result.url || null;
  },

  async uploadBuildingMedia(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("media", files[i]);
    }

    const response = await fetch(`${this.baseUrl}/upload/building-media`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn("Building media upload failed.");
      return null;
    }
    const result = await response.json();
    return result.urls || null;
  },

  // ========================================
  // STATS (dashboard)
  // ========================================

  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      throw new Error(`Stats HTTP ${response.status}`);
    } catch (err) {
      console.error("Stats API error:", err);
      // Return zeroes if stats fail, instead of downloading everything
      return {
        totalBuildings: 0,
        pendingFlags: 0,
        totalFlags: 0,
        gradeIBuildings: 0,
        totalReviews: 0,
      };
    }
  },
};

console.log("API connected to backend at:", API.baseUrl);

localStorage.removeItem('cached_buildings');
localStorage.removeItem('buildings_cache_time');

