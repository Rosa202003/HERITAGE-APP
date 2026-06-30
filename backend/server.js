const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const buildingRoutes = require("./routes/buildingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

console.log("Server starting: mounting routes...");
console.log("Mounting authRoutes at /api/auth");
console.log("Mounting buildingRoutes at /api/buildings");

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Digital Inventory and Virtual Tour System Backend Running",
  });
});

// Test Route
app.get("/test", (req, res) => {
  res.json({
    message: "Test route works",
  });
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Buildings Routes
app.use("/api/buildings", buildingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});