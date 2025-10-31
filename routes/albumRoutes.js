const express = require('express');
const router = express.Router();
const {
  createAlbum,
  getAllAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
} = require('../controllers/albumController');
const authMiddleware = require('../middleware/auth');

// Create album
router.post('/', authMiddleware, createAlbum);

// Get all albums of logged-in user
router.get('/', authMiddleware, getAllAlbums);

// Get single album
router.get('/:albumId', authMiddleware, getAlbum);

// Update album
router.put('/:albumId', authMiddleware, updateAlbum);

// Delete album (soft delete)
router.delete('/:albumId', authMiddleware, deleteAlbum);

module.exports = router;
