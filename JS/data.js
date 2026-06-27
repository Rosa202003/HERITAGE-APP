// ========================================
// STEP 3: MOCK DATA
// ========================================

// This is temporary data until we connect to a real backend
const MOCK_BUILDINGS = [
    {
        id: 1,
        name: 'Old Boma',
        era: 'German Colonial',
        year: 1895,
        condition: 'Good',
        status: 'Protected',
        description: 'Historic German administrative building with characteristic red brick architecture.',
        lat: -6.805,
        lng: 39.288,
        image: 'https://via.placeholder.com/600x400/cc9966/fff?text=Old+Boma',
        architect: 'Unknown',
        ownership: 'Government'
    },
    {
        id: 2,
        name: "St. Joseph's Cathedral",
        era: 'German Colonial',
        year: 1897,
        condition: 'Good',
        status: 'Protected',
        description: 'Neo-Gothic Catholic cathedral with twin towers.',
        lat: -6.812,
        lng: 39.291,
        image: 'https://via.placeholder.com/600x400/9966cc/fff?text=Cathedral',
        architect: 'Unknown',
        ownership: 'Church'
    },
    {
        id: 3,
        name: 'Dar es Salaam Train Station',
        era: 'British Colonial',
        year: 1920,
        condition: 'Fair',
        status: 'Protected',
        description: 'Historic railway station with distinctive colonial architecture.',
        lat: -6.815,
        lng: 39.279,
        image: 'https://via.placeholder.com/600x400/66cc99/fff?text=Train+Station',
        architect: 'Unknown',
        ownership: 'Railway Corporation'
    },
    {
        id: 4,
        name: 'National Museum',
        era: 'Independence',
        year: 1963,
        condition: 'Good',
        status: 'Protected',
        description: 'Museum housing Tanzania\'s cultural and historical artifacts.',
        lat: -6.808,
        lng: 39.295,
        image: 'https://via.placeholder.com/600x400/ffcc66/fff?text=Museum',
        architect: 'Unknown',
        ownership: 'Government'
    }
];

// For stats
const MOCK_STATS = {
    totalBuildings: 48,
    virtualTours: 12,
    eras: 4,
    officers: 8
};