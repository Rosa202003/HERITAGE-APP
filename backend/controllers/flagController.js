const supabase = require("../config/supabase");

// Get all flags
const getFlags = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("flags")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single flag
const getFlag = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("flags")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "Flag not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new flag (citizen report)
const createFlag = async (req, res) => {
  try {
    const { building_id, risk_type, description, reporter_name, reporter_email, photo_url } = req.body;

    const { data, error } = await supabase
      .from("flags")
      .insert([{
        building_id,
        risk_type,
        description,
        reporter_name: reporter_name || "Anonymous",
        reporter_email,
        photo_url,
        status: "pending"
      }])
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ message: "Flag report submitted", flag: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update flag status (officer response)
const updateFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response_notes } = req.body;

    const updatePayload = {};
    if (status !== undefined) updatePayload.status = status;
    if (response_notes !== undefined) updatePayload.response_notes = response_notes;

    let { data, error } = await supabase
      .from("flags")
      .update({ ...updatePayload, updated_at: new Date() })
      .eq("id", parseInt(id))
      .select();

    if (error) {
      // Fallback in case updated_at column is not present
      const fallback = await supabase
        .from("flags")
        .update(updatePayload)
        .eq("id", parseInt(id))
        .select();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Flag not found" });
    }

    res.json({ message: "Flag updated", flag: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getFlags,
  getFlag,
  createFlag,
  updateFlag
};