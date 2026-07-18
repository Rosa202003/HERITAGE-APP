const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFlagPhoto } = require("../controllers/uploadController");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public route to upload a flag photo
// 'photo' matches the form field appended in FormData from api.js
router.post("/flag-photo", upload.single("photo"), uploadFlagPhoto);

module.exports = router;
