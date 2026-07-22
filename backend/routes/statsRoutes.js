const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");

// Public — dashboard stats (buildings count, flags, reviews, grade-I)
router.get("/", getStats);

module.exports = router;
