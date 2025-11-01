const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: {
        type: String,
        enum: ['free', 'silver', 'gold', 'premium'],
        default: 'free'
    },
    description: { type: String },
    settings: {
        autoplay: { type: Boolean, default: true },           // auto play enable/disable
        delay: { type: Number, default: 3000 },              // delay in ms
        loop: { type: Boolean, default: true },             // loop slider
        spaceBetween: { type: Number, default: 10 },        // px between slides
        slidesPerView: { type: String, default: 1 },        // slides visible at once
        stopOnHover: { type: Boolean, default: true },      // stop autoplay on hover
    },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Slider', sliderSchema);
