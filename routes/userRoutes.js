const express = require('express');
const router = express.Router();
const {
  updateProfile,
  deleteProfile,
  banUser
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin'); // optional: admin only routes

// Update own profile
router.put('/profile', authMiddleware, updateProfile);

// Soft delete own profile
router.delete('/profile', authMiddleware, deleteProfile);

// Admin: Ban / unban user
router.put('/ban/:userId', authMiddleware, adminMiddleware, banUser);

module.exports = router;
