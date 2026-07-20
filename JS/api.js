// ========================================
// API LAYER - CONNECTED TO BACKEND
// ========================================

const API = {
    // Backend URL (change this when deploying)
    baseUrl: 'http://localhost:5000/api',

    // ========================================
    // HELPERS
    // ========================================

    /** Get the JWT token from localStorage */
    getToken() {
        return localStorage.getItem('token');
    },

    /** Build Authorization header if token exists */
    authHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // ========================================
    // BUILDINGS
    // ========================================

    async getBuildings() {
        try {
            const response = await fetch(`${this.baseUrl}/buildings`, { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.warn('API getBuildings failed, using MOCK_BUILDINGS fallback');
            if (typeof MOCK_BUILDINGS !== 'undefined') return MOCK_BUILDINGS;
            throw e;
        }
    },

    async getBuilding(id) {
        try {
            const response = await fetch(`${this.baseUrl}/buildings/${id}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.warn('API getBuilding failed, using MOCK_BUILDINGS fallback');
            if (typeof MOCK_BUILDINGS !== 'undefined') {
                const b = MOCK_BUILDINGS.find(b => b.id === parseInt(id));
                if (b) return b;
            }
            throw e;
        }
    },

    async createBuilding(data) {
        const response = await fetch(`${this.baseUrl}/buildings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to create building');
        return result;
    },

    async updateBuilding(id, data) {
        const response = await fetch(`${this.baseUrl}/buildings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to update building');
        return result;
    },

    async deleteBuilding(id) {
        const response = await fetch(`${this.baseUrl}/buildings/${id}`, {
            method: 'DELETE',
            headers: { ...this.authHeader() }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to delete building');
        return result;
    },

    // ========================================
    // AUTHENTICATION
    // ========================================

    async register(full_name, email, password) {
        const response = await fetch(`${this.baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        if (data.token) localStorage.setItem('token', data.token);
        return data;
    },

    async login(email, password) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        // Store token and full user info
        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        // Legacy key for other pages
        if (data.user) localStorage.setItem('citizen_user', JSON.stringify({
            name: data.user.full_name || email.split('@')[0],
            email: data.user.email,
            role: data.user.role
        }));
        return data;
    },

    async getMe() {
        const response = await fetch(`${this.baseUrl}/auth/me`, {
            headers: { ...this.authHeader() }
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
                cache: 'no-store'
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.warn('API getFlags failed, returning mock flags');
            return [
                { id: 1, building_id: 5, risk_type: 'structural', status: 'pending', reporter_name: 'Citizen A', created_at: new Date().toISOString() },
                { id: 2, building_id: 7, risk_type: 'neglect', status: 'reviewing', reporter_name: 'Citizen B', created_at: new Date().toISOString() },
                { id: 3, building_id: 11, risk_type: 'development', status: 'pending', reporter_name: 'Citizen C', created_at: new Date().toISOString() }
            ];
        }
    },

    async createFlag(data) {
        const response = await fetch(`${this.baseUrl}/flags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async updateFlag(id, data) {
        const response = await fetch(`${this.baseUrl}/flags/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    // ========================================
    // REVIEWS
    // ========================================

    async getReviews(params = {}) {
        try {
            const qs = new URLSearchParams(params).toString();
            const url = qs ? `${this.baseUrl}/reviews?${qs}` : `${this.baseUrl}/reviews`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.warn('API getReviews failed, returning empty reviews');
            return [];
        }
    },

    async createReview(data) {
        const response = await fetch(`${this.baseUrl}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async upvoteReview(id) {
        const response = await fetch(`${this.baseUrl}/reviews/${id}/helpful`, {
            method: 'POST',
            headers: { ...this.authHeader() }
        });
        return await response.json();
    },

    // ========================================
    // OFFICERS (super-officer only)
    // ========================================

    async getOfficers() {
        const response = await fetch(`${this.baseUrl}/officers`, {
            headers: { ...this.authHeader() }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load officers');
        return data;
    },

    async getCitizens() {
        const response = await fetch(`${this.baseUrl}/officers/citizens`, {
            headers: { ...this.authHeader() }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load citizens');
        return data;
    },

    async inviteOfficer(email) {
        const response = await fetch(`${this.baseUrl}/officers/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.authHeader()
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to add officer');
        return data;
    },

    async removeOfficer(userId) {
        const response = await fetch(`${this.baseUrl}/officers/${userId}`, {
            method: 'DELETE',
            headers: { ...this.authHeader() }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to remove officer');
        return data;
    },

    // ========================================
    // PHOTO UPLOAD (to backend / Supabase Storage)
    // ========================================

    async uploadFlagPhoto(file) {
        const formData = new FormData();
        formData.append('photo', file);

        const response = await fetch(`${this.baseUrl}/upload/flag-photo`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.warn('Photo upload failed, continuing without photo.');
            return null;
        }
        const result = await response.json();
        return result.url || null;
    },

    // ========================================
    // STATS (dashboard)
    // ========================================

    async getStats() {
        try {
            const [buildings, flags, reviews] = await Promise.all([
                this.getBuildings(),
                this.getFlags(),
                this.getReviews()
            ]);

            const pendingFlags = flags.filter(f => f.status === 'pending').length;
            const listedBuildings = buildings.filter(b =>
                b.status && b.status.toLowerCase().includes('grade i')
            ).length;

            return {
                totalBuildings: buildings.length,
                pendingFlags: pendingFlags,
                totalFlags: flags.length,
                gradeIBuildings: listedBuildings,
                totalReviews: reviews.length
            };
        } catch (err) {
            console.error('Stats error:', err);
            return { totalBuildings: 0, pendingFlags: 0, totalFlags: 0, gradeIBuildings: 0, totalReviews: 0 };
        }
    }
};

console.log('API connected to backend at:', API.baseUrl);