// ========================================
// MOCK BUILDINGS DATA
// ========================================

const MOCK_BUILDINGS = [
    {
        id: 1,
        name: 'German Administrative Boma',
        code: 'DSH-001',
        era: 'German Colonial',
        year: 1891,
        condition: 'Good',
        status: 'Grade I Listed',
        location: 'City Centre',
        // You can use an online link (http://...) OR a local file path (../assets/buildings/boma.jpg)
        image: 'https://images.unsplash.com/photo-1674334264912-704cb2a24b37?w=600&h=400&fit=crop',
        description: 'Historic German administrative building with characteristic red brick architecture.',
        tags: ['Protected', 'Grade I', '360°'],
        lat: -6.805,
        lng: 39.288
    },
    {
        id: 2,
        name: "St. Joseph's Cathedral",
        code: 'DSH-002',
        era: 'German Colonial',
        year: 1898,
        condition: 'Excellent',
        status: 'Grade I Listed',
        location: 'City Centre',
        // Example of a local uploaded file path:
        // image: '../assets/buildings/cathedral.jpg',
        image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop',
        description: 'Neo-Gothic Catholic cathedral with twin towers.',
        tags: ['Protected', 'Grade I', '360°'],
        lat: -6.812,
        lng: 39.291
    },
    {
        id: 3,
        name: 'Azania Front Lutheran Church',
        code: 'DSH-003',
        era: 'German Colonial',
        year: 1898,
        condition: 'Good',
        status: 'Grade II Listed',
        location: 'Kivukoni',
        // You can use an online link (http://...) OR a local file path (../assets/buildings/boma.jpg)
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
        description: 'Historic Lutheran church with distinctive architecture.',
        tags: ['Protected', 'Grade II'],
        lat: -6.814,
        lng: 39.292
    },
    {
        id: 4,
        name: "Old Harbour Master's Office",
        code: 'DSH-004',
        era: 'British Colonial',
        year: 1915,
        condition: 'Fair',
        status: 'Grade II Listed',
        location: 'Kivukoni',
        // You can use an online link (http://...) OR a local file path (../assets/buildings/boma.jpg)
        image: 'https://images.unsplash.com/photo-1589177900326-900782f88a55?w=600&h=400&fit=crop',
        description: 'Former harbour master office, now part of the port authority.',
        tags: ['Protected', 'Grade II'],
        lat: -6.816,
        lng: 39.285
    },
    {
        id: 5,
        name: 'General Post Office',
        code: 'DSH-005',
        era: 'British Colonial',
        year: 1913,
        condition: 'Poor',
        status: 'Grade II Listed',
        location: 'City Centre',
        image: 'https://placehold.co/600x400/eeeeee/666666?text=Building+Placeholder',
        description: 'Historic post office building in need of restoration.',
        tags: ['Protected', 'Grade II', 'At Risk'],
        lat: -6.810,
        lng: 39.290
    },
    {
        id: 6,
        name: 'Dar es Salaam City Hall',
        code: 'DSH-006',
        era: 'Independence',
        year: 1956,
        condition: 'Good',
        status: 'Grade II Listed',
        location: 'City Centre',
        image: 'https://placehold.co/600x400/eeeeee/666666?text=Building+Placeholder',
        description: 'Historic city hall building with colonial architecture.',
        tags: ['Protected', 'Grade II'],
        lat: -6.808,
        lng: 39.287
    },
    {
        id: 7,
        name: 'Mnazi Mmoja Hospital Original',
        code: 'DSH-007',
        era: 'British Colonial',
        year: 1920,
        condition: 'At Risk',
        status: 'Proposed',
        location: 'Mnazi Mmoja',
        image: 'https://placehold.co/600x400/eeeeee/666666?text=Building+Placeholder',
        description: 'Original hospital building currently at risk of demolition.',
        tags: ['At Risk', 'Proposed', 'Urgent'],
        lat: -6.802,
        lng: 39.280
    },
    {
        id: 8,
        name: 'Dar es Salaam Railway Station',
        code: 'DSH-008',
        era: 'British Colonial',
        year: 1929,
        condition: 'Fair',
        status: 'Grade II Listed',
        location: 'Kariakoo',
        image: 'https://placehold.co/600x400/eeeeee/666666?text=Building+Placeholder',
        description: 'Historic railway station with distinctive colonial architecture.',
        tags: ['Protected', 'Grade II', '360°'],
        lat: -6.815,
        lng: 39.279
    }
];

console.log(' MOCK_BUILDINGS loaded:', MOCK_BUILDINGS.length, 'buildings');