// ========================================
// AUTH MIDDLEWARE
// ========================================

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: " No token provided. Please login first."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_super_secret_jwt_key_here"
        );

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: " Invalid token. Please login again."
            });
        }
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired. Please login again."
            });
        }

        return res.status(401).json({
            message: " Authentication failed."
        });
    }
};

module.exports = authMiddleware;