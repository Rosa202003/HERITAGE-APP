const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getReviews,
  createReview,
  upvoteReviewHelpful
} = require("../controllers/reviewController");

const supabase = require("../config/supabase");

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    const { data } = await supabase.auth.getUser(token);
    if (data && data.user) {
      req.user = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || "citizen",
        full_name: data.user.user_metadata?.full_name || data.user.email
      };
    }
  } catch (err) {}
  next();
};

// Public route to fetch reviews (optionally filtered by building_id query param)
router.get("/", getReviews);

// Route to write/post a new review (uses optional auth so token identity is verified when present)
router.post("/", optionalAuth, createReview);

// Public route to mark a review as helpful (increment helpful count)
router.post("/:id/helpful", upvoteReviewHelpful);

module.exports = router;
