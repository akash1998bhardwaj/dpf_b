const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  otp: {
    type: String, unique: true,
    sparse: true,
  },
  deviceId: {
    type: String,
    unique: true,
    sparse: true
  },
  otpExpiresAt: { type: Date },
  subscriptionType: {
    type: String,
    enum: ['free', 'silver', 'gold', 'fullAccess'],
    default: 'free',
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
