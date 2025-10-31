const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String },              // store latest OTP
    diviceId: { type: String, required: true, unique: true },
    otpExpiresAt: { type: Date },       // OTP expiration time
    subscriptionType: {
        type: String,
        enum: ['free', 'silver', 'gold', 'fullAccess'],
        default: 'free'
    },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
