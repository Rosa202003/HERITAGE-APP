const supabase = require("../config/supabase");

const uploadFlagPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    // Get file from multer memory storage
    const file = req.file;
    // Create unique file name
    const ext = file.originalname.split('.').pop() || 'jpg';
    const fileName = `flag-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;

    // Upload to Supabase Storage inside bucket 'flag-photos'
    const { data, error } = await supabase.storage
      .from("flag-photos")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return res.status(500).json({ message: "Failed to upload photo to storage" });
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("flag-photos")
      .getPublicUrl(fileName);

    res.json({ url: publicData.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadFlagPhoto
};
