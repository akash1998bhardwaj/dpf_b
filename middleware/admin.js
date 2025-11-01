// middleware/admin.js
module.exports = async (req, res, next) => {
  try {
    const user = req.user; // assume authMiddleware ran first
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
