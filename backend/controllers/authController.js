const supabase = require("../config/supabase");

// ========================================
// REGISTER — Uses Supabase Native Auth
// ========================================
const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Attempt admin user creation first (auto-confirms email so user can log in right away)
    let userObj = null;
    let sessionToken = null;

    try {
      const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          role: "citizen"
        }
      });

      if (!adminErr && adminData?.user) {
        userObj = adminData.user;
        // Attempt sign in to generate token
        const { data: loginData } = await supabase.auth.signInWithPassword({ email, password });
        sessionToken = loginData?.session?.access_token || null;
      }
    } catch (_) {
      // Fallback to standard signUp
    }

    if (!userObj) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role: "citizen"
          }
        }
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }
      userObj = data.user;
      sessionToken = data.session?.access_token || null;
    }

    return res.status(201).json({
      message: "Account created successfully! You can now log in.",
      user: {
        id: userObj.id,
        email: userObj.email,
        full_name: userObj.user_metadata?.full_name || full_name,
        role: userObj.user_metadata?.role || "citizen"
      },
      token: sessionToken
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// LOGIN — Uses Supabase Native Auth
// ========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      return res.status(401).json({ message: error ? error.message : "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || email.split("@")[0],
        role: data.user.user_metadata?.role || "citizen",
        is_super_officer: data.user.user_metadata?.is_super_officer || false
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ========================================
// GET ME — Verifies Supabase session token
// ========================================
const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token against Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    return res.json({
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name,
      role: data.user.user_metadata?.role || "citizen",
      is_super_officer: data.user.user_metadata?.is_super_officer || false
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  getMe
};