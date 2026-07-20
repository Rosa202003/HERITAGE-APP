const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { officerOnly } = require('../middleware/auth');
const {
    getBuildings,
    getBuilding,
    createBuilding,
    updateBuilding,
    deleteBuilding
} = require('../controllers/buildingController');

// Public routes (no auth required)
router.get('/', getBuildings);
router.get('/:id', getBuilding);

// Protected routes (officers only)
router.post('/', authMiddleware, officerOnly, createBuilding);
router.put('/:id', authMiddleware, officerOnly, updateBuilding);
router.patch('/:id', authMiddleware, officerOnly, updateBuilding);
router.delete('/:id', authMiddleware, officerOnly, deleteBuilding);

module.exports = router;