const express = require('express');
const router = express.Router();
const { getBuildings, getBuilding } = require('../controllers/buildingController');

router.get('/', getBuildings);
router.get('/:id', getBuilding);

module.exports = router;
