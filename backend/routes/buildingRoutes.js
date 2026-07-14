const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getBuildings,
    getBuilding,
    createBuilding,   // ← MAKE SURE THIS IS HERE
    updateBuilding,   // ← MAKE SURE THIS IS HERE
    deleteBuilding    // ← MAKE SURE THIS IS HERE
} = require('../controllers/buildingController');

// Public routes (no auth required)
router.get('/', getBuildings);
router.get('/:id', getBuilding);

// Protected routes (auth required - officers only)
router.post('/', authMiddleware, createBuilding);
router.put('/:id', authMiddleware, updateBuilding);
router.delete('/:id', authMiddleware, deleteBuilding);

module.exports = router;