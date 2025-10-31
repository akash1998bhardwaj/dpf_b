const User = require("../models/user");

// ✅ Update user subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { userId, plan } = req.body;

    // Valid subscription types
    const validPlans = ["free", "silver", "gold", "fullAccess"];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    // Update user plan
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subscriptionType: plan },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `Subscription updated to ${plan}`,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        subscriptionType: updatedUser.subscriptionType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
