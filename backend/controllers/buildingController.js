const supabase = require("../config/supabase");

// Helper to extract tour URL and media from tags array
const mapBuildingData = (b) => {
  if (!b) return b;
  let tourUrl = null;
  if (Array.isArray(b.tags)) {
    const tourTag = b.tags.find(t => typeof t === "string" && t.startsWith("TOUR:"));
    if (tourTag) {
      tourUrl = tourTag.substring(5);
    }
  }
  return {
    ...b,
    panorama_url: tourUrl || null
  };
};

// Get all buildings
const getBuildings = async (req, res) => {
  try {
    const { q } = req.query;
    
    let query = supabase
      .from("buildings")
      .select("*")
      .order("id", { ascending: true });

    if (q) {
      query = query.or(`name.ilike.%${q}%,location.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error (getBuildings):", error);
      return res.status(500).json({ message: error.message });
    }

    const mappedData = (data || []).map(mapBuildingData);
    res.json(mappedData);
  } catch (err) {
    console.error("getBuildings error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get single building by ID
const getBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("buildings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.json(mapBuildingData(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper to automatically generate the next sequential building code (e.g. DSH-014, DSH-015)
const generateNextBuildingCode = async () => {
  try {
    const { data } = await supabase
      .from("buildings")
      .select("code");

    let maxNum = 0;
    if (data && Array.isArray(data)) {
      data.forEach(b => {
        if (b.code && typeof b.code === "string" && b.code.startsWith("DSH-")) {
          const numStr = b.code.replace("DSH-", "").trim();
          const num = parseInt(numStr, 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
    }
    return `DSH-${String(maxNum + 1).padStart(3, "0")}`;
  } catch (err) {
    return `DSH-${Date.now().toString().slice(-4)}`;
  }
};

// Create new building
const createBuilding = async (req, res) => {
  try {
    const {
      name,
      code,
      era,
      year,
      condition,
      status,
      location,
      area,
      architect,
      ownership,
      style,
      inspected,
      rating,
      image,
      description,
      significance,
      tags,
      lat,
      lng,
      mediaUrls,
      panorama_url
    } = req.body;

    // Only building name is mandatory
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Building name is required."
      });
    }

    let finalTags = Array.isArray(tags) ? [...tags] : [];

    // Store media URLs in tags
    if (mediaUrls && Array.isArray(mediaUrls)) {
      const mediaTags = mediaUrls.map(url => `MEDIA:${url}`);
      finalTags = [...finalTags, ...mediaTags];
    }

    // Store tour URL in tags if provided
    if (panorama_url && panorama_url.trim()) {
      finalTags.push(`TOUR:${panorama_url.trim()}`);
      if (!finalTags.includes("360°")) {
        finalTags.push("360°");
      }
    }

    // Automatically generate next code (e.g. DSH-014) if code not supplied or is placeholder
    const finalCode = (code && code.trim() && code.trim() !== "Auto") ? code.trim() : await generateNextBuildingCode();

    const buildingRecord = {
      name: name.trim(),
      code: finalCode,
      era: era || "German Colonial",
      year: parseInt(year) || 1910,
      condition: condition || "Good",
      status: status || "Listed",
      location: location || "Dar es Salaam",
      area: area || "N/A",
      architect: architect || "Unknown",
      ownership: ownership || "Public",
      style: style || "Colonial",
      inspected: inspected || new Date().toISOString().split('T')[0],
      rating: parseInt(rating) || 0,
      image: image || "https://images.unsplash.com/photo-1589177900326-900782f88a55?w=600&h=400&fit=crop",
      description: description || "Historical heritage building in Dar es Salaam.",
      significance: significance || "Historically listed building under Antiquities Department.",
      tags: finalTags,
      lat: parseFloat(lat) || -6.8160,
      lng: parseFloat(lng) || 39.2890,
      created_at: new Date(),
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from("buildings")
      .insert([buildingRecord])
      .select();

    if (error) {
      console.error("Supabase createBuilding error:", error);
      return res.status(400).json({
        message: error.message
      });
    }

    const createdBuilding = mapBuildingData(data[0]);
    res.status(201).json({
      message: "Building created successfully",
      building: createdBuilding
    });

  } catch (err) {
    console.error("Create building server error:", err);
    res.status(500).json({
      message: "Server error: " + err.message
    });
  }
};

// Update building
const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    let finalTags = Array.isArray(updates.tags) ? [...updates.tags] : [];

    if (updates.mediaUrls && Array.isArray(updates.mediaUrls)) {
      const mediaTags = updates.mediaUrls.map(url => `MEDIA:${url}`);
      finalTags = [...finalTags, ...mediaTags];
      delete updates.mediaUrls;
    }

    if (updates.panorama_url) {
      finalTags = finalTags.filter(t => typeof t !== "string" || !t.startsWith("TOUR:"));
      if (updates.panorama_url.trim()) {
        finalTags.push(`TOUR:${updates.panorama_url.trim()}`);
        if (!finalTags.includes("360°")) finalTags.push("360°");
      }
      delete updates.panorama_url;
    }

    updates.tags = finalTags;
    delete updates.panorama_url; // Prevent PostgREST schema cache missing column error

    const { data, error } = await supabase
      .from("buildings")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Building not found" });
    }

    const updatedBuilding = mapBuildingData(data[0]);
    res.json({ message: "Building updated", building: updatedBuilding });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete building
const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("buildings")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.json({ message: "Building deleted", building: data[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding
};