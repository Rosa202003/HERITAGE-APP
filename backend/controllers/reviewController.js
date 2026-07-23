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

    // Map building names
    const { data: buildingsData } = await supabase.from("buildings").select("id, name");
    const buildingMap = {};
    if (buildingsData && Array.isArray(buildingsData)) {
      buildingsData.forEach(b => { buildingMap[b.id] = b.name; });
    }

    const mappedData = (data || []).map((r) => {
      const reviewText = r.comment || r.content || r.body || r.review || "";
      const author = r.user_name || r.reviewer_name || r.name || "Community Citizen";
      return {
        ...r,
        user_name: author,
        reviewer_name: author,
        comment: reviewText,
        content: reviewText,
        body: reviewText,
        review: reviewText,
        building_name: r.building_name || buildingMap[r.building_id] || (r.building_id ? `Building #${r.building_id}` : "General Heritage Site")
      };
    });

    res.json(mappedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================================
// CREATE REVIEW
// ========================================
const createReview = async (req, res) => {
  try {
    const { building_id, rating, comment, content, body, user_name, reviewer_name } = req.body;
    const user_id = req.user ? req.user.id : null;
    const authorName = user_name || reviewer_name || (req.user ? (req.user.full_name || req.user.name) : "Community Citizen");
    const text = comment || content || body;

    // Validate inputs
    if (!building_id || !rating || !text) {
      return res.status(400).json({ message: "Building ID, rating, and review comment are required" });
    }

    const ratingInt = parseInt(rating);
    if (ratingInt < 1 || ratingInt > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    const attempts = [
      { reviewer_name: authorName, user_name: authorName, building_id: parseInt(building_id), rating: ratingInt, content: text, comment: text, body: text },
      { reviewer_name: authorName, building_id: parseInt(building_id), rating: ratingInt, content: text, comment: text },
      { user_name: authorName, building_id: parseInt(building_id), rating: ratingInt, comment: text },
      { user_name: authorName, building_id: parseInt(building_id), rating: ratingInt, body: text }
    ];

    let data = null;
    let error = null;

    for (const obj of attempts) {
      const res = await supabase.from("reviews").insert([obj]).select();
      if (!res.error && res.data && res.data.length > 0) {
        data = res.data;
        error = null;
        break;
      }
      error = res.error;
    }

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const reviewRecord = data && data[0] ? data[0] : {};

    // Re-calculate average rating for the building in DB
    try {
      const { data: bReviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("building_id", parseInt(building_id));

      if (bReviews && bReviews.length > 0) {
        const avg = (bReviews.reduce((sum, r) => sum + (parseInt(r.rating) || 0), 0) / bReviews.length).toFixed(1);
        await supabase
          .from("buildings")
          .update({ rating: parseFloat(avg) })
          .eq("id", parseInt(building_id));
      }
    } catch(e) {
      console.warn("Could not auto-update building rating in DB:", e.message);
    }

    res.status(201).json({
      message: "Review submitted successfully",
      review: {
        ...reviewRecord,
        comment: reviewRecord.content || reviewRecord.comment || reviewRecord.body || text
      }
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
