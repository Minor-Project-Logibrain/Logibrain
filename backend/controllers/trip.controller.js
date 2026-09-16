import mongoose from "mongoose";
import User from "../models/User.js";
import Truck from "../models/Truck.js";
import { sendSuccess } from "../utils/response.js";
import { sendError } from "../utils/response.js";
import { createTripSchema } from "../Validations/trip.validations.js";
import bcrypt from "bcrypt";
import fs from "fs";
import Trip from "../models/Trip.js";
import { tr } from "zod/v4/locales";

export const createTrip = async (req, res) => {
    const result = createTripSchema.safeParse(req.body);
    if (!result.success) {

        console.log(
            "Zod Validation Errors:",
            result.error.issues
        );

        return sendError(
            res,
            400,
            result.error.issues[0].message
        );
    }
    const { tripNo, startDate, endDate, pickupLocation, deliveryLocation, cargo, freightAmount, fuelCost, tollCost, otherExpenses, notes, truck, driver } = result.data;
    const { address, city, state, pinCode, latitude, longitude } = pickupLocation;
    const { address: daddress, city: dcity, state: dstate, pinCode: dpinCode, latitude: dlatitude, longitude: dlongitude } = deliveryLocation;
    const { type, description, weight, weightUnit, quantity, value } = cargo;


    const truckExist = await Truck.findById(truck);
    if (!truckExist) {
        return sendError(res, 400, "Truck does not exist");
    }
    if (truckExist.status !== "available") {
        return sendError(res, 400, "Truck is not available");
    }
    const driverExist = await User.findById(driver);
    if (!driverExist || driverExist.role !== "Driver") {
        return sendError(res, 400, "Driver does not exist");
    }
    if (driverExist.status !== "available") {
        return sendError(res, 400, "Driver is not available");
    }
    const trip = await Trip.create({
        tripNo,
        truck: truckExist._id,
        driver: driverExist._id,
        pickupLocation: {
            address,
            city,
            state,
            pinCode,
            latitude,
            longitude
        },
        deliveryLocation: {
            address: daddress,
            city: dcity,
            state: dstate,
            pinCode: dpinCode,
            latitude: dlatitude,
            longitude: dlongitude
        },
        cargo: {
            type,
            description,
            weight,
            weightUnit,
            quantity,
            value
        },
        freightAmount,
        fuelCost,
        tollCost,
        otherExpenses,
        notes,
        plannedStartDate: startDate,
        plannedEndDate: endDate,
    });
    return sendSuccess(res, 200, "Trip created successfully");
};

export const getTripNumber = async (req, res) => {
    try {
        const { number } = req.params;

        const existingTripNumber = await Trip.findOne({
            tripNo: number
        });

        return res.status(200).json({
            exists: !!existingTripNumber
        });

    } catch (error) {
        return sendError(
            res,
            500,
            "Something went wrong"
        );
    }
};

export const getTotleNumbersTrips = async (req, res) => {
    const totleNumbersTrips = await Trip.countDocuments();
    return sendSuccess(res, 200, "Totle numbers of trips", totleNumbersTrips);
}

export const getTrips = async (req, res) => {
    const trips = await Trip.find().populate("driver", "fullName").populate("truck", "truckNo");
    return sendSuccess(res, 200, "Trips", trips);
};