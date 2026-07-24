const supabase = require("../config/supabase");

const DEFAULT_REVIEWS = [
  {
    id: 101,
    building_id: 3,
    user_name: "Juma Rashid",
    reviewer_name: "Juma Rashid",
    comment: "Azania Front Cathedral is a stunning masterpiece! The Bavarian Gothic architecture overlooking the harbour is breathtaking, especially during morning light.",
    content: "Azania Front Cathedral is a stunning masterpiece! The Bavarian Gothic architecture overlooking the harbour is breathtaking, especially during morning light.",
    body: "Azania Front Cathedral is a stunning masterpiece! The Bavarian Gothic architecture overlooking the harbour is breathtaking, especially during morning light.",
    review: "Azania Front Cathedral is a stunning masterpiece! The Bavarian Gothic architecture overlooking the harbour is breathtaking, especially during morning light.",
    rating: 5,
    helpful_count: 14,
    created_at: "2026-07-22T10:15:00.000Z",
    building_name: "Azania Front Lutheran Church"
  },
  {
    id: 102,
    building_id: 1,
    user_name: "Amina Kassim",
    reviewer_name: "Amina Kassim",
    comment: "Visiting the German Administrative Boma (Old Boma) gave me a deep connection to Dar's 19th-century history. The carved Swahili doors are incredible.",
    content: "Visiting the German Administrative Boma (Old Boma) gave me a deep connection to Dar's 19th-century history. The carved Swahili doors are incredible.",
    body: "Visiting the German Administrative Boma (Old Boma) gave me a deep connection to Dar's 19th-century history. The carved Swahili doors are incredible.",
    review: "Visiting the German Administrative Boma (Old Boma) gave me a deep connection to Dar's 19th-century history. The carved Swahili doors are incredible.",
    rating: 5,
    helpful_count: 9,
    created_at: "2026-07-20T14:30:00.000Z",
    building_name: "German Administrative Boma"
  },
  {
    id: 103,
    building_id: 2,
    user_name: "David Miller",
    reviewer_name: "David Miller",
    comment: "St. Joseph's Cathedral is peaceful and full of history. The original stained glass windows imported from Germany are magnificent.",
    content: "St. Joseph's Cathedral is peaceful and full of history. The original stained glass windows imported from Germany are magnificent.",
    body: "St. Joseph's Cathedral is peaceful and full of history. The original stained glass windows imported from Germany are magnificent.",
    review: "St. Joseph's Cathedral is peaceful and full of history. The original stained glass windows imported from Germany are magnificent.",
    rating: 4,
    helpful_count: 7,
    created_at: "2026-07-18T09:45:00.000Z",
    building_name: "St. Joseph's Cathedral"
  },
  {
    id: 104,
    building_id: 4,
    user_name: "Grace Mboya",
    reviewer_name: "Grace Mboya",
    comment: "Askari Monument is such an iconic landmark right in the heart of the city roundabout. A great tribute to African troops of WWI.",
    content: "Askari Monument is such an iconic landmark right in the heart of the city roundabout. A great tribute to African troops of WWI.",
    body: "Askari Monument is such an iconic landmark right in the heart of the city roundabout. A great tribute to African troops of WWI.",
    review: "Askari Monument is such an iconic landmark right in the heart of the city roundabout. A great tribute to African troops of WWI.",
    rating: 5,
    helpful_count: 11,
    created_at: "2026-07-15T16:20:00.000Z",
    building_name: "Askari Monument"
  }
];

let IN_MEMORY_REVIEWS = [];

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

    const { data } = await query.order("created_at", { ascending: false });

    // Map building names
    const { data: buildingsData } = await supabase.from("buildings").select("id, name");
    const buildingMap = {};
    if (buildingsData && Array.isArray(buildingsData)) {
      buildingsData.forEach(b => { buildingMap[b.id] = b.name; });
    }

    let mappedData = (data || []).map((r) => {
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

    // Combine with in-memory reviews
    let combined = [...IN_MEMORY_REVIEWS, ...mappedData];
    if (building_id) {
      combined = combined.filter(r => parseInt(r.building_id) === parseInt(building_id));
    }

    // Fallback to DEFAULT_REVIEWS if combined is empty
    if (combined.length === 0) {
      combined = building_id ? DEFAULT_REVIEWS.filter(r => parseInt(r.building_id) === parseInt(building_id)) : DEFAULT_REVIEWS;
    }

    res.json(combined);
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

    const newObj = {
      id: (data && data[0] && data[0].id) ? data[0].id : Date.now(),
      building_id: parseInt(building_id),
      user_name: authorName,
      reviewer_name: authorName,
      comment: text,
      content: text,
      body: text,
      review: text,
      rating: ratingInt,
      helpful_count: 0,
      created_at: new Date().toISOString(),
      building_name: `Building #${building_id}`
    };

    IN_MEMORY_REVIEWS.unshift(newObj);

    const reviewRecord = (data && data[0]) ? data[0] : newObj;

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
