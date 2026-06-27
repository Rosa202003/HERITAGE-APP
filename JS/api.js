// ========================================
// STEP 4: API LAYER
// ========================================

// This handles ALL data fetching
const API = {
    // Switch to true when backend is ready
    useRealBackend: false,
    baseUrl: 'http://localhost:3000/api',
    
    // Get all buildings
    async getBuildings() {
        if (this.useRealBackend) {
            // Real API call
            const response = await fetch(`${this.baseUrl}/buildings`);
            const data = await response.json();
            return data;
        } else {
            // Mock data (for now)
            return MOCK_BUILDINGS;
        }
    },
    
    // Get a single building by ID
    async getBuilding(id) {
        if (this.useRealBackend) {
            const response = await fetch(`${this.baseUrl}/buildings/${id}`);
            const data = await response.json();
            return data;
        } else {
            // Find in mock data
            return MOCK_BUILDINGS.find(b => b.id === parseInt(id));
        }
    },
    
    // Get stats
    async getStats() {
        if (this.useRealBackend) {
            const response = await fetch(`${this.baseUrl}/stats`);
            const data = await response.json();
            return data;
        } else {
            return MOCK_STATS;
        }
    }
};