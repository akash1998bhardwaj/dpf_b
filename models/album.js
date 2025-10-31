const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },

  // Common fields
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
