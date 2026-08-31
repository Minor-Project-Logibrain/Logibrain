import mongoose from "mongoose";

const TruckSchema = new mongoose.Schema({
    truckNo: {
        type: String,
        unique: true,
        required: true,
    },
    chassisNo: {
        type: String,
        unique: true,
        required: true,
    },
    vehicleModel: {
        type: String,
    },
    truckType: {
        type: String,
    },
    fuleType: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    model: {
        type: String,
    },
    manufacturingYear: {
        type: Number,
    },
    chassisNumber: {
        type: String,
    },
    engineNumber: {
        type: String,
    },
    loadCapacity: {
        type: Number,
    },
    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    img: {
        type: String,
        default: "",
    },
    rcNumber: String,
    insurenceNumber: String,
    insurenceExpiry: Date,
    status: {
        type: String,
        enum: ["available", "assigned", "maintenance", "inactive", "sold", "accidental", "insurance_expired"],
        default: "available",
    },

}, {
    timestamps: true,
});

const Truck = mongoose.model("Truck", TruckSchema);

export default Truck;