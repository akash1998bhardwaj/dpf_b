const express = require('express');
const router = express.Router();
const {
  createSlider,
  getAllSliders,
  getSlider,
  updateSlider,
  deleteSlider
} = require('../controllers/sliderController');
const authMiddleware = require('../middleware/auth'); // admin only

// Create slider
router.post('/', authMiddleware, createSlider);

// Get all sliders
router.get('/', getAllSliders);

// Get single slider
router.get('/:sliderId', getSlider);

// Update slider
router.put('/:sliderId', authMiddleware, updateSlider);

// Delete slider (soft delete)
router.delete('/:sliderId', authMiddleware, deleteSlider);

module.exports = router;
