const Photo = require('../models/photo');

// Create new photo
exports.createPhoto = async (req, res) => {
  try {
    const { albumId, fileUrl, quote, author } = req.body;
    const userId = req.user.id;

    if (!fileUrl) return res.status(400).json({ message: "fileUrl is required" });

    const photo = await Photo.create({
      userId,
      albumId,
      fileUrl,
      quote: quote || "",
      author: author || "",
      isActive: true,
      isDelete: false,
    });

    res.status(201).json({ message: "Photo created", photo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all photos of logged-in user (optional album filter)
exports.getAllPhotos = async (req, res) => {
  try {
    const { albumId } = req.query;
    const query = { userId: req.user.id, isDelete: false };
    if (albumId) query.albumId = albumId;

    const photos = await Photo.find(query);
    res.json({ photos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single photo by ID
exports.getPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.id, isDelete: false });
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json({ photo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update photo
exports.updatePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { albumId, fileUrl, quote, author, isActive } = req.body;

    const photo = await Photo.findOneAndUpdate(
      { _id: photoId, userId: req.user.id, isDelete: false },
      { albumId, fileUrl, quote, author, isActive },
      { new: true }
    );

    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json({ message: "Photo updated", photo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete photo (soft delete)
exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await Photo.findOneAndUpdate(
      { _id: photoId, userId: req.user.id, isDelete: false },
      { isDelete: true },
      { new: true }
    );

    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json({ message: "Photo deleted", photo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
