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

const uploadBuildingMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No media uploaded" });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const ext = file.originalname.split('.').pop() || 'jpg';
      const fileName = `media-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;

      const { data, error } = await supabase.storage
        .from("building-media") // Assuming this bucket exists
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        // If 'building-media' fails, fallback to 'flag-photos' bucket
        console.warn("Failed to upload to building-media bucket, trying flag-photos bucket...", error.message);
        const fbResponse = await supabase.storage
          .from("flag-photos")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });
        
        if (fbResponse.error) {
          throw new Error("Storage upload failed in both buckets: " + fbResponse.error.message);
        }
        const { data: publicData } = supabase.storage.from("flag-photos").getPublicUrl(fileName);
        uploadedUrls.push(publicData.publicUrl);
      } else {
        const { data: publicData } = supabase.storage.from("building-media").getPublicUrl(fileName);
        uploadedUrls.push(publicData.publicUrl);
      }
    }

    res.json({ urls: uploadedUrls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadFlagPhoto,
  uploadBuildingMedia
};
