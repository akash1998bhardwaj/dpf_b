const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  status: {
    type: String,
    enum: ['unassigned', 'active', 'inactive', 'deleted'],
    default: 'unassigned',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional: user system se link hoga
    default: null,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // kis admin ne add kiya
    default: null,
  },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
