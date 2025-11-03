const Album = require('../models/album');

// Create new album
exports.createAlbum = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name) return res.status(400).json({ message: "Album name is required" });

    const album = await Album.create({
      userId: userId,
      name,
      isActive: true,
      isDelete: false,
    });

    res.status(201).json({ message: "Album created", album });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all albums of logged-in user
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ userId: req.user.id, isDelete: false });
    res.json({ albums });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single album by ID
exports.getAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findOne({ _id: albumId, userId: req.user.id, isDelete: false });
    if (!album) return res.status(404).json({ message: "Album not found" });
    res.json({ album });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update album
exports.updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { name, isActive } = req.body;

    const album = await Album.findOneAndUpdate(
      { _id: albumId, userId: req.user.id, isDelete: false },
      { name, isActive },
      { new: true }
    );

    if (!album) return res.status(404).json({ message: "Album not found" });
    res.json({ message: "Album updated", album });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete album (soft delete)
exports.deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findOneAndUpdate(
      { _id: albumId, userId: req.user.id, isDelete: false },
      { isDelete: true },
      { new: true }
    );

    if (!album) return res.status(404).json({ message: "Album not found" });
    res.json({ message: "Album deleted", album });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
