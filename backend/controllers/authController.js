const register = async (req, res) => {
  try {
    res.status(201).json({
      message: "User registered successfully (temporary mode)",
      user: req.body,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  res.json({
    message: "Login route coming next",
  });
};

module.exports = {
  register,
  login,
};