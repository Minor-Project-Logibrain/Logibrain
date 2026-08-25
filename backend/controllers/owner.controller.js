import mongoose from "mongoose";
import User from "../models/User.js";
import { sendSuccess } from "../utils/response.js";
import { sendError } from "../utils/response.js";
import { addDriverSchema } from "../Validations/owner.validation.js";
import bcrypt from "bcrypt";
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