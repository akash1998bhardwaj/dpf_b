module.exports = (req, res, next) => {
  // Ensure authMiddleware ran first
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (!user.isAdmin) {  // isAdmin field in User model
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};
