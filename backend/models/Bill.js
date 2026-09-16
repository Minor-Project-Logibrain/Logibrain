import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true
    },
    billType: {
        type: "String",
        enum: [
            "fuel",
            "toll",
            "food",
            "maintenance",
            "parking",
            "loading",
            "unloading",
            "other"
        ]
    },
    amount: {
        type: Number,
        required: true,
        min: 1,
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    receipt: {
        type: String,
        default: null,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    rejectionReason: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

export default mongoose.model("Bill", billSchema);