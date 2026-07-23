const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const flagRoutes = require("./routes/flagRoutes"); 
const reviewRoutes = require("./routes/reviewRoutes"); 
const uploadRoutes = require("./routes/uploadRoutes");
const officerRoutes = require("./routes/officerRoutes");
const statsRoutes = require("./routes/statsRoutes");

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
app.use("/api/stats", statsRoutes);

// Root redirect to main frontend page
app.get("/", (req, res) => {
  res.redirect("/HTML/index.html");
});

app.get("/officer", (req, res) => {
  res.redirect("/HTML/officer.html");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` Urithi Majengo Server Running on Port ${PORT}`);
  console.log(`Open App in Browser:    http://localhost:${PORT}/HTML/index.html`);
  console.log(` Officer Portal:        http://localhost:${PORT}/HTML/officer.html`);
  console.log(` Live Server Compatible: Port 5500 auto-connects to http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);
});