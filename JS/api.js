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
        const response = await fetch(`${this.baseUrl}/buildings`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    },

    async getBuilding(id) {
        const response = await fetch(`${this.baseUrl}/buildings/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
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
        return await response.json();
    },

    async login(email, password) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
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
        const qs = new URLSearchParams(params).toString();
        const url = qs ? `${this.baseUrl}/flags?${qs}` : `${this.baseUrl}/flags`;
        const response = await fetch(url, {
            headers: { ...this.authHeader() }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
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
        const qs = new URLSearchParams(params).toString();
        const url = qs ? `${this.baseUrl}/reviews?${qs}` : `${this.baseUrl}/reviews`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
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
    // PHOTO UPLOAD (to backend / Supabase Storage)
    // ========================================

    /**
     * Upload a photo file.
     * The backend should accept multipart/form-data and return { url }
     * For now we POST to /api/upload (add that route if needed),
     * or send base64 embedded in the JSON body.
     * This method returns the public URL string.
     */
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