const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    fileUrl: { type: String, required: true },
    quote: { type: String, default: "" },
    author: { type: String, default: "" }, 

    // Common fields
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
