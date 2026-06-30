const express = require("express");
const router = express.Router();

const {
  getBuildings,
  getBuildingById,
} = require("../controllers/buildingController");

console.log("buildingRoutes loaded");

router.get("/", (req, res, next) => {
  console.log("GET /api/buildings received");
  next();
}, getBuildings);

router.get("/:id", (req, res, next) => {
  console.log(`GET /api/buildings/${req.params.id} received`);
  next();
}, getBuildingById);

module.exports = router;