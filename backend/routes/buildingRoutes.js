const express = require('express');
const router = express.Router();
const {
    getBuildings,
    getBuilding,
    createBuilding,   // ← MAKE SURE THIS IS HERE
    updateBuilding,   // ← MAKE SURE THIS IS HERE
    deleteBuilding    // ← MAKE SURE THIS IS HERE
} = require('../controllers/buildingController');

router.get('/', getBuildings);
router.get('/:id', getBuilding);
router.post('/', createBuilding);
router.put('/:id', updateBuilding);
router.delete('/:id', deleteBuilding);

module.exports = router;