const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getReviews,
  createReview,
  upvoteReviewHelpful
} = require("../controllers/reviewController");

// Public route to fetch reviews (optionally filtered by building_id query param)
router.get("/", getReviews);

// Protected route to write/post a new review (requires authentication)
router.post("/", authMiddleware, createReview);

// Public route to mark a review as helpful (increment helpful count)
router.post("/:id/helpful", upvoteReviewHelpful);

module.exports = router;
