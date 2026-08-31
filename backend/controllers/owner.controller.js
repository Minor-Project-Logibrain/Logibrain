import mongoose from "mongoose";
import User from "../models/User.js";
import Truck from "../models/Truck.js";
import { sendSuccess } from "../utils/response.js";
import { sendError } from "../utils/response.js";
import { addDriverSchema, addTruckSchema } from "../Validations/owner.validation.js";
import bcrypt from "bcrypt";
import fs from "fs";

export const getDrivers = async (req, res) => {
    const drivers = await User.find({ role: "Driver" });
    if (drivers.length === 0) return sendError(res, 200, "No drivers found from the db");
    return sendSuccess(res, 200, "Drivers found successfully", drivers);
};

export const addDrivers = async (req, res) => {
    const result = addDriverSchema.safeParse(req.body);
    if (!result.success) {
        return sendError(res, 400, "All fileds are required");
    };
    const { fullName, phone, email } = result.data;
    const hashedPass = await bcrypt.hash(phone, 10);
    await User.create({
        fullName,
        phone: phone,
        email: email,
        role: "Driver",
        password: hashedPass,
    });
    return sendSuccess(res, 200, "Driver added successfully");
};

export const updateDriver = async (req, res) => {
    const { id } = req.params;
    const { fullName, phone, email } = req.body;
    if (!fullName && !phone && !email) return sendError(res, 400, "All feilds are required");
    const updated = await User.updateOne({ _id: id }, {
        fullName,
        phone,
        email
    });
    if (!updated.modifiedCount) return sendError(res, 400, "No changes found");
    return sendSuccess(res, 200, "Driver updated successfully");

}
export const deleteDriver = async (req, res) => {
    const { id } = req.params;
    try {
        const driver = await User.findOneAndDelete({ _id: id, role: "Driver" });
        if (!driver) {
            return sendError(res, 404, "Driver not found");
        }
        return sendSuccess(res, 200, "Driver deleted successfully");
    } catch (err) {
        return sendError(res, 500, "Internal Server Error", err);
    }
};

// TRUCK CONTROLLERS
export const getTrucks = async (req, res) => {
    const truck = await Truck.find({}).populate("assignedDriver", "fullName email phone");
    if (truck.length === 0) return sendError(res, 200, "No trucks found from the db");
    return sendSuccess(res, 200, "Trucks found successfully", truck);
}

export const addTruck = async (req, res) => {
    const result = addTruckSchema.safeParse(req.body);

    if (!result.success) {
        // If image file was uploaded, clean it up since validation failed
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error("Cleanup error:", err);
            }
        }
        return sendError(res, 400, result.error.errors[0]?.message || "All required fields must be valid");
    }
    const truckData = result.data;

    // Check unique truckNo and chassisNo
    const existingTruckNo = await Truck.findOne({ truckNo: truckData.truckNo });
    if (existingTruckNo) {
        if (req.file) fs.unlinkSync(req.file.path);
        return sendError(res, 400, "Truck number already exists");
    }

    const existingChassisNo = await Truck.findOne({ chassisNo: truckData.chassisNo });
    if (existingChassisNo) {
        if (req.file) fs.unlinkSync(req.file.path);
        return sendError(res, 400, "Chassis number already exists");
    }

    const imgPath = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const newTruck = await Truck.create({
        ...truckData,
        img: imgPath,
        assignedDriver: truckData.assignedDriver || null,
        insurenceExpiry: truckData.insurenceExpiry ? new Date(truckData.insurenceExpiry) : null
    });

    if (newTruck.assignedDriver && newTruck.status === "available") {
        newTruck.status = "assigned";
        await newTruck.save();
    }

    return sendSuccess(res, 200, "Truck added successfully", newTruck);
};

export const updateTruck = async (req, res) => {
    const { id } = req.params;
    const result = addTruckSchema.partial().safeParse(req.body);
    if (!result.success) {
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error("Cleanup error:", err);
            }
        }
        return sendError(res, 400, result.error.errors[0]?.message || "Invalid update data");
    }
    const updateData = result.data;
    const currentTruck = await Truck.findById(id);
    if (!currentTruck) {
        if (req.file) fs.unlinkSync(req.file.path);
        return sendError(res, 404, "Truck not found");
    }
    if (updateData.truckNo !== currentTruck.truckNo) {
        const existing = await Truck.findOne({ truckNo: updateData.truckNo, _id: { $ne: id } });
        if (existing) {
            if (req.file) fs.unlinkSync(req.file.path);
            return sendError(res, 400, "Tru ck number already exists");
        }
    }
    if (updateData.chassisNo !== currentTruck.chassisNo) {
        const existing = await Truck.findOne({ chassisNo: updateData.chassisNo, _id: { $ne: id } });
        if (existing) {
            const count = await Truck.countDocuments({ chassisNo: updateData.chassisNo });
            if (count >= 2) {
                if (req.file) fs.unlinkSync(req.file.path);
                return sendError(res, 400, "Chassis number already exists");
            }
        }
    }

    let imgPath = currentTruck.img;
    if (req.file) {
        if (currentTruck.img && fs.existsSync(currentTruck.img)) {
            try {
                fs.unlinkSync(currentTruck.img);
            } catch (unlinkErr) {
                console.error("Failed to delete old image:", unlinkErr);
            }
        }
        imgPath = req.file.path.replace(/\\/g, "/");
    }
    let assignedDriver = currentTruck.assignedDriver;
    let status;
    if (Object.prototype.hasOwnProperty.call(updateData, "assignedDriver")) {
        if (updateData.assignedDriver === "Unassigned" || updateData.assignedDriver === null || updateData.assignedDriver === "") {
            assignedDriver = null;
            status = "available";
        } else {
            assignedDriver = updateData.assignedDriver;
            status = "assigned";
        }
    }
    let insurenceExpiry = currentTruck.insurenceExpiry;
    if (Object.prototype.hasOwnProperty.call(updateData, "insurenceExpiry")) {
        if (updateData.insurenceExpiry === "" || updateData.insurenceExpiry === null) {
            insurenceExpiry = null;
        } else {
            insurenceExpiry = new Date(updateData.insurenceExpiry);
        }
    }
    const fieldsToUpdate = {
        ...updateData,
        img: imgPath,
        assignedDriver,
        insurenceExpiry,
        status,
    };

    if (fieldsToUpdate.assignedDriver && fieldsToUpdate.status === "available") {
        fieldsToUpdate.status = "assigned";
    } else if (!fieldsToUpdate.assignedDriver && currentTruck.assignedDriver && fieldsToUpdate.status === "assigned") {
        fieldsToUpdate.status = "available";
    }

    const updatedTruck = await Truck.findByIdAndUpdate(id, fieldsToUpdate, { new: true, runValidators: true });
    return sendSuccess(res, 200, "Truck updated successfully", updatedTruck);
};

export const deleteTruck = async (req, res) => {
    const { id } = req.params;
    const currentTruck = await Truck.findById(id);
    if (!currentTruck) return sendError(res, 404, "Truck not found");

    if (currentTruck.img && fs.existsSync(currentTruck.img)) {
        try {
            fs.unlinkSync(currentTruck.img);
        } catch (unlinkErr) {
            console.error("Failed to delete truck image file:", unlinkErr);
        }
    }

    await Truck.findByIdAndDelete(id);
    return sendSuccess(res, 200, "Truck deleted successfully");
};


export const getAvailableDrivers = async (req, res) => {
    const drivers = await User.find({ role: "Driver", status: "available" });
    if (drivers.length === 0) return sendError(res, 404, "No drivers available");
    return sendSuccess(res, 200, "Available drivers found successfully", drivers);
};
export const getAvailableTrucks = async (req, res) => {
    const trucks = await Truck.find({ status: "available" });
    if (trucks.length === 0) return sendError(res, 404, "No trucks available");
    return sendSuccess(res, 200, "Available trucks found successfully", trucks);
};