const Slider = require('../models/Slider');

// Create new slider
exports.createSlider = async (req, res) => {
  try {
    const { title, imageUrl, category, description, active, settings } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: "Title and imageUrl are required" });
    }

    const slider = await Slider.create({
      title,
      imageUrl,
      category: category || 'free',
      description: description || '',
      active: active !== undefined ? active : true,
      settings: {
        autoplay: settings?.autoplay ?? true,
        delay: settings?.delay ?? 3000,
        loop: settings?.loop ?? true,
        spaceBetween: settings?.spaceBetween ?? 10,
        slidesPerView: settings?.slidesPerView ?? 1,
        stopOnHover: settings?.stopOnHover ?? true,
      }
    });

    res.status(201).json({ message: "Slider created", slider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all active sliders (for admin or public)
exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({ active: true }).sort({ createdAt: -1 });
    res.json({ sliders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get sliders filtered by user subscription
exports.getSliders = async (req, res) => {
  try {
    const user = req.user; // auth middleware required
    if (!user) return res.status(401).json({ message: "User not authenticated" });

    let allowedCategories = ['free'];
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

    const sliders = await Slider.find({
      category: { $in: allowedCategories },
      active: true
    }).sort({ createdAt: -1 });

    res.json({ sliders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update slider
exports.updateSlider = async (req, res) => {
  try {
    const { sliderId } = req.params;
    const { title, imageUrl, category, description, active, settings } = req.body;

    const slider = await Slider.findById(sliderId);
    if (!slider) return res.status(404).json({ message: "Slider not found" });

    slider.title = title ?? slider.title;
    slider.imageUrl = imageUrl ?? slider.imageUrl;
    slider.category = category ?? slider.category;
    slider.description = description ?? slider.description;
    slider.active = active !== undefined ? active : slider.active;

    // Update settings if provided
    if (settings) {
      slider.settings = {
        autoplay: settings?.autoplay ?? slider.settings.autoplay,
        delay: settings?.delay ?? slider.settings.delay,
        loop: settings?.loop ?? slider.settings.loop,
        spaceBetween: settings?.spaceBetween ?? slider.settings.spaceBetween,
        slidesPerView: settings?.slidesPerView ?? slider.settings.slidesPerView,
        stopOnHover: settings?.stopOnHover ?? slider.settings.stopOnHover,
      };
    }

    await slider.save();
    res.json({ message: "Slider updated", slider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete slider (soft delete)
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
