const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const flagRoutes = require("./routes/flagRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/flags", flagRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Digital Inventory and Virtual Tour System Backend Running",
    endpoints: {
      auth: "/api/auth",
      buildings: "/api/buildings",
      flags: "/api/flags"
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});