const User = require('../models/user');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (photo) updateData.photo = photo;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soft delete user (deactivate)
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isDelete: true, isActive: false },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile deleted", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Ban / Unban user
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ban } = req.body; // true = ban, false = unban

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: ban },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: ban ? "User banned" : "User unbanned", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
