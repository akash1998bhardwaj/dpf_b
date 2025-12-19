const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default:''
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        plan: {
            type: String,
            enum: ["free", "silver", "gold", "premium"],
            default: "free"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
);

module.exports = mongoose.model("Slider", sliderSchema);
