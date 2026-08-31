import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
    tripNo: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    truck: {
        type: mongoose.Schema.ObjectId,
        ref: "Truck",
        required: true,
    },
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: "Driver",
        required: true,
    },
    pickupLocation: {
        address: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        pinCode: {
            type: Number,
            required: true,
            trim: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        }
    },
    deliveryLocation: {
        address: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        pinCode: {
            type: Number,
            required: true,
            trim: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        }
    },
    plannedStartDate: {
        type: Date,
        required: true
    },
    plannedEndDate: {
        type: Date,
        required: true
    },
    actualEndDate: {
        type: Date
    },
    actualStartDate: {
        type: Date
    },
    cargo: {
        description: {
            type: String,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        weightUnit: {
            type: String,
            enum: ["kg", "ton"],
            default: "kg"
        },

        quantity: {
            type: Number,
            default: 1
        }
    },
    freightAmount: {
        type: Number,
        default: 0
    },

    fuelCost: {
        type: Number,
        default: 0
    },

    tollCost: {
        type: Number,
        default: 0
    },

    otherExpenses: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: [
            "planned",
            "in-progress",
            "completed",
            "cancelled"
        ],
        default: "planned"
    },

    notes: {
        type: String,
        default: ""
    }



}, {
    timestamps: true,
});

const Trip = new mongoose.model("Trip", TripSchema);
export default Trip;