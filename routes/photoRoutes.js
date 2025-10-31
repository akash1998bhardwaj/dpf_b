const express = require('express');
const router = express.Router();
const {
  createPhoto,
  getAllPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto
} = require('../controllers/photoController');
const authMiddleware = require('../middleware/auth');

// Create photo
router.post('/', authMiddleware, createPhoto);

// Get all photos (optional album filter)
router.get('/', authMiddleware, getAllPhotos);

// Get single photo
router.get('/:photoId', authMiddleware, getPhoto);

// Update photo
router.put('/:photoId', authMiddleware, updatePhoto);

// Delete photo (soft delete)
router.delete('/:photoId', authMiddleware, deletePhoto);

module.exports = router;
