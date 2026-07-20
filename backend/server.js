const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const flagRoutes = require("./routes/flagRoutes"); 
const reviewRoutes = require("./routes/reviewRoutes"); 
const uploadRoutes = require("./routes/uploadRoutes");
const officerRoutes = require("./routes/officerRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/flags", flagRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/officers", officerRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Digital Inventory and Virtual Tour System Backend Running",
    endpoints: {
      auth: "/api/auth",
      buildings: "/api/buildings",
      flags: "/api/flags",
      reviews: "/api/reviews"
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});