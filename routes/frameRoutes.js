const express = require('express');
const router = express.Router();
const {
  createFrame,
  getAllFrames,
  getFrame,
  updateFrame,
  deleteFrame,
} = require('../controllers/frameController');
const authMiddleware = require('../middleware/auth');

// Create frame
router.post('/', authMiddleware, createFrame);

// Get all frames
router.get('/', authMiddleware, getAllFrames);

// Get single frame
router.get('/:frameId', authMiddleware, getFrame);

// Update frame
router.put('/:frameId', authMiddleware, updateFrame);

// Delete frame (soft delete)
router.delete('/:frameId', authMiddleware, deleteFrame);

module.exports = router;
