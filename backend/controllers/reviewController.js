const supabase = require("../config/supabase");

// ========================================
// GET REVIEWS
// ========================================
const getReviews = async (req, res) => {
  try {
    const { building_id } = req.query;

    let query = supabase
      .from("reviews")
      .select("*");

    if (building_id) {
      query = query.eq("building_id", parseInt(building_id));
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// CREATE REVIEW
// ========================================
const createReview = async (req, res) => {
  try {
    const { building_id, rating, comment } = req.body;
    const user_id = req.user.id;
    const user_name = req.user.full_name || req.user.name || "Anonymous";

    // Validate inputs
    if (!building_id || !rating || !comment) {
      return res.status(400).json({ message: "Building ID, rating, and review comment are required" });
    }

    const ratingInt = parseInt(rating);
    if (ratingInt < 1 || ratingInt > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    // Insert review in Supabase
    const { data, error } = await supabase
      .from("reviews")
      .insert([{
        user_id,
        user_name,
        building_id: parseInt(building_id),
        rating: ratingInt,
        comment
      }])
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      message: "Review submitted successfully",
      review: data[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// UPVOTE HELPFUL COUNT
// ========================================
const upvoteReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch current review helpful count
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("helpful_count")
      .eq("id", id)
      .single();

    if (fetchError || !review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const currentHelpful = review.helpful_count || 0;

    // 2. Increment and save
    const { data, error } = await supabase
      .from("reviews")
      .update({ helpful_count: currentHelpful + 1 })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      message: "Review upvoted",
      review: data[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  upvoteReviewHelpful
};
