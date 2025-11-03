const Slider = require('../models/Slider');

// Create new slider
exports.createSlider = async (req, res) => {
  try {
    const { title, imageUrl, category, description, active, settings } = req.body;

    // 🔸 Step 1: Validate required fields
    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and imageUrl are required"
      });
    }

    // 🔸 Step 2: Check for existing slider with same title
    const existingSlider = await Slider.findOne({ title });
    if (existingSlider) {
      return res.status(400).json({
        success: false,
        message: "Slider with this title already exists",
      });
    }

    // 🔸 Step 3: Create new slider
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
      },
    });

    // 🔸 Step 4: Send success response
    res.status(201).json({
      success: true,
      message: "Slider created successfully",
      slider
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};


// Get all active sliders (for admin or public)
exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({ createdAt: -1 });
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
      isActive: true
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
    const { title, imageUrl, category, description, isActive, settings } = req.body;

    const slider = await Slider.findById(sliderId);
    if (!slider) return res.status(404).json({ message: "Slider not found" });

    slider.title = title ?? slider.title;
    slider.imageUrl = imageUrl ?? slider.imageUrl;
    slider.category = category ?? slider.category;
    slider.description = description ?? slider.description;
    slider.isActive = isActive !== undefined ? isActive : slider.isActive;

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
      { isActive: false },
      { new: true }
    );

    if (!slider) return res.status(404).json({ message: "Slider not found" });
    res.json({ message: "Slider deactivated", slider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
