const Slider = require('../models/Slider');

// Create new slider
exports.createSlider = async (req, res) => {
  try {
    const { title, imageUrl, category, description, active } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: "Title and imageUrl are required" });
    }

    const slider = await Slider.create({
      title,
      imageUrl,
      category: category || 'free',
      description: description || '',
      active: active !== undefined ? active : true,
    });

    res.status(201).json({ message: "Slider created", slider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all sliders
exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({ active: true });
    res.json({ sliders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single slider by ID
const Slider = require("../models/Slider");

// Get sliders based on user subscription
exports.getSliders = async (req, res) => {
  try {
    const user = req.user; // auth middleware se aa raha hai
    if (!user) return res.status(401).json({ message: "User not authenticated" });

    // Default: free sliders
    let allowedCategories = ['free'];

    // Map subscription to categories
    switch (user.subscriptionType) {
      case 'silver':
        allowedCategories.push('silver');
        break;
      case 'gold':
        allowedCategories.push('silver', 'gold');
        break;
      case 'fullAccess':
        allowedCategories = ['free', 'silver', 'gold', 'premium'];
        break;
    }

    // Fetch sliders that match allowed categories and active
    const sliders = await Slider.find({ 
      category: { $in: allowedCategories },
      active: true
    }).sort({ createdAt: -1 }); // optional: latest first

    res.json({ sliders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update slider
exports.updateSlider = async (req, res) => {
  try {
    const { sliderId } = req.params;
    const { title, imageUrl, category, description, active } = req.body;

    const slider = await Slider.findByIdAndUpdate(
      sliderId,
      { title, imageUrl, category, description, active },
      { new: true }
    );

    if (!slider) return res.status(404).json({ message: "Slider not found" });
    res.json({ message: "Slider updated", slider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete slider (soft delete by setting active = false)
exports.deleteSlider = async (req, res) => {
  try {
    const { sliderId } = req.params;

    const slider = await Slider.findByIdAndUpdate(
      sliderId,
      { active: false },
      { new: true }
    );

    if (!slider) return res.status(404).json({ message: "Slider not found" });
    res.json({ message: "Slider deactivated", slider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
