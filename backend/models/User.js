import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Driver", "Owner"],
    },
    otp: {
        type: String,

    },
    otpExpiry: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["available", "inactive", "on-trip", "off-duty", "assigned"],
        default: "available"
    }
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;