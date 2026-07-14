const supabase = require("../config/supabase");
const mockBuildings = require("../data/mockBuildings.json");

// Get all buildings
const getBuildings = async (req, res) => {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from("buildings")
      .select("*");

    if (error) {
      // Fallback to mock data if Supabase fails
      console.log(" Using mock building data");
      return res.json(mockBuildings);
    }

    res.json(data);
  } catch (err) {
    // Fallback to mock data on error
    console.log(" Using mock building data (error fallback)");
    res.json(mockBuildings);
  }
};

// Get single building by ID
const getBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    // Try Supabase first
    const { data, error } = await supabase
      .from("buildings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // Fallback to mock data
      const building = mockBuildings.find(b => b.id === parseInt(id));
      if (building) {
        return res.json(building);
      }
      return res.status(404).json({ message: "Building not found" });
    }

    res.json(data);
  } catch (err) {
    // Fallback to mock data
    const building = mockBuildings.find(b => b.id === parseInt(id));
    if (building) {
      return res.json(building);
    }
    res.status(404).json({ message: "Building not found" });
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
      lng
    } = req.body;

    // Validate required fields
    if (!name || !era || !year || !condition) {
      return res.status(400).json({
        message: "Missing required fields: name, era, year, condition"
      });
    }

    const { data, error } = await supabase
      .from("buildings")
      .insert([{
        name,
        code: code || `DSH-${Date.now()}`,
        era,
        year,
        condition,
        status: status || "Listed",
        location: location || "Dar es Salaam",
        area: area || "N/A",
        architect: architect || "Unknown",
        ownership: ownership || "Unknown",
        style: style || "Colonial",
        inspected: inspected || new Date().toISOString().split('T')[0],
        rating: rating || 0,
        image: image || "https://via.placeholder.com/600x400/cccccc/666?text=Heritage+Building",
        description: description || "No description available.",
        significance: significance || "Historical significance pending.",
        tags: tags || [],
        lat: lat || 0,
        lng: lng || 0,
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(201).json({
      message: "Building created successfully",
      building: data[0]
    });

  } catch (err) {
    console.error("Create building error:", err);
    res.status(500).json({
      message: "Server error: " + err.message
    });
  }
};

// Update building
const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("buildings")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.json({ message: "Building updated", building: data });
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

    if (data.length === 0) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.json({ message: "Building deleted", building: data });
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