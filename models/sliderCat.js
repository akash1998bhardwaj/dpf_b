import mongoose from "mongoose";

const sliderCatSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
            // e.g. "Nature"
        },
        icon: {
            type: String,
            default: ""
            // emoji / icon url / icon name
        },
        isActive: { type: Boolean, default: true },
        isDelete: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    }
);

export default mongoose.model("SliderCategory", sliderCatSchema);
