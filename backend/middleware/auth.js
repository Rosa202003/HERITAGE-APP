// ========================================
// AUTH MIDDLEWARE — Supabase token verification
// ========================================

const supabase = require("../config/supabase");

// ----------------------------------------
// Base auth: verify token via Supabase
// Attaches req.user with id, email, metadata
// ----------------------------------------
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided. Please login first." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ message: "Invalid or expired token. Please login again." });
        }

        req.user = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata?.role || "citizen",
            full_name: data.user.user_metadata?.full_name || data.user.email,
            is_super_officer: data.user.user_metadata?.is_super_officer === true
        };

        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ message: "Authentication failed." });
    }
};

// ----------------------------------------
// Officer only: must have role === 'officer'
// ----------------------------------------
const officerOnly = async (req, res, next) => {
    // Run authMiddleware first if not already done
    if (!req.user) {
        return authMiddleware(req, res, async () => {
            if (req.user?.role !== "officer") {
                return res.status(403).json({ message: "Access denied. Officers only." });
            }
            next();
        });
    }
    if (req.user.role !== "officer") {
        return res.status(403).json({ message: "Access denied. Officers only." });
    }
    next();
};

// ----------------------------------------
// Super officer only: must have is_super_officer === true
// ----------------------------------------
const superOfficerOnly = async (req, res, next) => {
    if (!req.user?.is_super_officer) {
        return res.status(403).json({ message: "Access denied. Super-officer privileges required." });
    }
    next();
};

module.exports = authMiddleware;
module.exports.officerOnly = officerOnly;
module.exports.superOfficerOnly = superOfficerOnly;