// ========================================
// API LAYER - CONNECTED TO BACKEND
// ========================================

const API = {
    // Backend URL (change this when deploying)
    baseUrl: 'http://localhost:5000/api',
    
    // ========================================
    // BUILDINGS
    // ========================================
    
    // Get all buildings
    async getBuildings() {
        try {
            const response = await fetch(`${this.baseUrl}/buildings`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching buildings:', error);
            // Fallback to mock data if backend fails
            if (typeof MOCK_BUILDINGS !== 'undefined') {
                console.log(' Using mock building data as fallback');
                return MOCK_BUILDINGS;
            }
            throw error;
        }
    },
    
    // Get a single building by ID
    async getBuilding(id) {
        try {
            const response = await fetch(`${this.baseUrl}/buildings/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching building:', error);
            // Fallback to mock data
            if (typeof MOCK_BUILDINGS !== 'undefined') {
                console.log('⚠️ Using mock building data as fallback');
                return MOCK_BUILDINGS.find(b => b.id === parseInt(id));
            }
            throw error;
        }
    },
    
    // ========================================
    // AUTHENTICATION
    // ========================================
    
    // Register a new user
    async register(full_name, email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ full_name, email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Error registering:', error);
            throw error;
        }
    },
    
    // Login user
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },
    
    // Get current user (protected)
    async getMe(token) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    },
    
    // ========================================
    // FLAGS (Citizen Reports)
    // ========================================
    
    // Get all flags
    async getFlags() {
        try {
            const response = await fetch(`${this.baseUrl}/flags`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching flags:', error);
            // Fallback to mock flags
            if (typeof MOCK_FLAGS !== 'undefined') {
                console.log('⚠️ Using mock flags as fallback');
                return MOCK_FLAGS;
            }
            throw error;
        }
    },
    
    // Create a new flag (citizen report)
    async createFlag(data) {
        try {
            const response = await fetch(`${this.baseUrl}/flags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating flag:', error);
            throw error;
        }
    },
    
    // Update flag status (officer)
    async updateFlag(id, data) {
        try {
            const response = await fetch(`${this.baseUrl}/flags/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating flag:', error);
            throw error;
        }
    },
    
    // ========================================
    // STATS
    // ========================================
    
    // Get stats (if backend has stats endpoint)
    async getStats() {
        try {
            const response = await fetch(`${this.baseUrl}/stats`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Fallback to mock stats
            if (typeof MOCK_STATS !== 'undefined') {
                console.log(' Using mock stats as fallback');
                return MOCK_STATS;
            }
            return {
                totalBuildings: 48,
                virtualTours: 12,
                eras: 4,
                officers: 8
            };
        }
    }
};

console.log('API connected to backend at:', API.baseUrl);