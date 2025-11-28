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
    sparse: true,
    default: null,  // ✅ null allows multiple users without error
  },
  otpExpiresAt: { type: Date },
  subscriptionType: {
    type: String,
    enum: ['free', 'silver', 'gold', 'fullAccess'],
    default: 'free',
  },
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
