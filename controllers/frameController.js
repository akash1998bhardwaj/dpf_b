const Frame = require('../models/frame');

// Create new frame
exports.createFrame = async (req, res) => {
  try {
    const { deviceId, email } = req.body;
    const userId = req.user.id;

    if (!deviceId || !email) {
      return res.status(400).json({ message: "deviceId and email are required" });
    }

    // Check if deviceId or email already exists
    const existingFrame = await Frame.findOne({ $or: [{ deviceId }, { email }] });
    if (existingFrame) {
      return res.status(400).json({ message: "Frame with this deviceId or email already exists" });
    }

    const frame = await Frame.create({ deviceId, email, userId });
    res.status(201).json({ message: "Frame created", frame });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all frames of logged-in user
exports.getAllFrames = async (req, res) => {
  try {
    const frames = await Frame.find({ userId: req.user.id, isDelete: false });
    res.json({ frames });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single frame by ID
exports.getFrame = async (req, res) => {
  try {
    const { frameId } = req.params;
    const frame = await Frame.findOne({ _id: frameId, userId: req.user.id, isDelete: false });
    if (!frame) return res.status(404).json({ message: "Frame not found" });
    res.json({ frame });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update frame
exports.updateFrame = async (req, res) => {
  try {
    const { frameId } = req.params;
    const { deviceId, email, isActive } = req.body;

    const frame = await Frame.findOneAndUpdate(
      { _id: frameId, userId: req.user.id, isDelete: false },
      { deviceId, email, isActive },
      { new: true }
    );

    if (!frame) return res.status(404).json({ message: "Frame not found" });
    res.json({ message: "Frame updated", frame });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete frame (soft delete)
exports.deleteFrame = async (req, res) => {
  try {
    const { frameId } = req.params;

    const frame = await Frame.findOneAndUpdate(
      { _id: frameId, userId: req.user.id, isDelete: false },
      { isDelete: true },
      { new: true }
    );

    if (!frame) return res.status(404).json({ message: "Frame not found" });
    res.json({ message: "Frame deleted", frame });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
