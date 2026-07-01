const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");

router.get("/test", (req, res) => {
  res.json({ message: "Auth route works" });
});

router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);

module.exports = router;