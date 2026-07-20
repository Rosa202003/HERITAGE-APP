const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { officerOnly, superOfficerOnly } = require("../middleware/auth");
const { getOfficers, inviteOfficer, removeOfficer, getCitizens } = require("../controllers/officerController");

// All routes require: valid Supabase token + role=officer + is_super_officer=true
router.get("/", authMiddleware, officerOnly, superOfficerOnly, getOfficers);
router.post("/invite", authMiddleware, officerOnly, superOfficerOnly, inviteOfficer);
router.get("/citizens", authMiddleware, officerOnly, superOfficerOnly, getCitizens);
router.delete("/:userId", authMiddleware, officerOnly, superOfficerOnly, removeOfficer);

module.exports = router;
