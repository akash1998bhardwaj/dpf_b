const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  imageUrl: { type: String, required: true }, // store image path or URL
  caption: { type: String },

  // Common fields
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
