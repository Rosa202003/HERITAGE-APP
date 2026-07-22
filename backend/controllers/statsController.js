const supabase = require("../config/supabase");

// ========================================
// GET DASHBOARD STATS
// Single endpoint — replaces 3 parallel calls from the frontend
// ========================================
const getStats = async (req, res) => {
  try {
    const [
      { count: totalBuildings, error: bErr },
      { data: flags, error: fErr },
      { count: totalReviews, error: rErr },
      { data: gradeIData, error: gErr },
    ] = await Promise.all([
      supabase.from("buildings").select("*", { count: "exact", head: true }),
      supabase.from("flags").select("id, status"),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
      supabase
        .from("buildings")
        .select("id, status")
        .or("status.ilike.%grade i%,status.ilike.%grade 1%"),
    ]);

    if (bErr) console.error("Stats: buildings error", bErr);
    if (fErr) console.error("Stats: flags error", fErr);
    if (rErr) console.error("Stats: reviews error", rErr);
    if (gErr) console.error("Stats: grade-I error", gErr);

    const pendingFlags = (flags || []).filter(
      (f) => f.status === "pending"
    ).length;

    res.json({
      totalBuildings: totalBuildings || 0,
      pendingFlags,
      totalFlags: (flags || []).length,
      gradeIBuildings: (gradeIData || []).length,
      totalReviews: totalReviews || 0,
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats };
