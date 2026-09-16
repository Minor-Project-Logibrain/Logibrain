import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import { sendError, sendSuccess } from "../utils/response.js";
import Bill from "../models/Bill.js";

export const getTripsOfDriver = async (req, res) => {
    try {
        const id = req.user._id || req.user.id;
        const userRole = req.user.role;
        const userName = req.user.fullName;

        console.log("DRIVER FETCHING TRIPS:", {
            userId: id,
            email: req.user.email,
            role: userRole,
            fullName: userName,
        });

        let queryConditions = [];

        // Only query valid ObjectIds to prevent Mongoose schema CastError
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            queryConditions.push({ driver: id });
            queryConditions.push({ driver: new mongoose.Types.ObjectId(id) });
        }

        let trips = queryConditions.length > 0
            ? await Trip.find({ $or: queryConditions })
                .populate("truck", "truckNo model type status")
                .populate("driver", "fullName email phone")
                .sort({ createdAt: -1 })
            : [];

        // If no trips matched specific driver ID and the user is an Owner or Admin (testing driver view),
        // fetch all trips so owner testing driver view can see trips!
        if (trips.length === 0 && (userRole === "Owner" || userRole === "Admin")) {
            trips = await Trip.find({})
                .populate("truck", "truckNo model type status")
                .populate("driver", "fullName email phone")
                .sort({ createdAt: -1 });
        }

        console.log(`Found ${trips.length} trip(s) for driver:`, userName || id);
        return sendSuccess(res, 200, "Trips of this driver", trips || []);
    } catch (err) {
        console.error("Error in getTripsOfDriver:", err);
        return sendError(res, 500, err.message || "Failed to fetch driver trips");
    }
};

export const addBill = async (req, res) => {
    let { tripId, bills } = req.body;

    if (!tripId) {
        return sendError(res, 400, "Trip ID is required");
    }

    if (typeof bills === "string") {
        try {
            bills = JSON.parse(bills);
        } catch (e) {
            return sendError(res, 400, "Invalid bills data format");
        }
    }

    if (!bills || !Array.isArray(bills) || bills.length === 0) {
        return sendError(res, 400, "At least one bill item is required");
    }

    // Find trip by ObjectId or tripNo
    const trip = mongoose.Types.ObjectId.isValid(tripId)
        ? await Trip.findById(tripId)
        : await Trip.findOne({ tripNo: tripId });

    if (!trip) {
        return sendError(res, 404, "Trip not found");
    }

    const driverId = req.user._id || req.user.id;

    const validBillTypes = [
        "fuel",
        "toll",
        "food",
        "maintenance",
        "parking",
        "loading",
        "unloading",
        "other"
    ];

    const billData = [];

    for (let i = 0; i < bills.length; i++) {
        const bill = bills[i];
        let billType = (bill.billType || "other").toLowerCase().trim();
        if (billType === "fule") billType = "fuel";
        if (!validBillTypes.includes(billType)) {
            billType = "other";
        }

        const amount = Number(bill.amount);
        if (!amount || isNaN(amount) || amount <= 0) {
            return sendError(res, 400, `Bill #${i + 1} has an invalid amount`);
        }

        const description = (bill.description || "").trim();
        if (!description) {
            return sendError(res, 400, `Bill #${i + 1} requires a description`);
        }

        const date = bill.date || bill.billDate ? new Date(bill.date || bill.billDate) : new Date();

        let receiptPath = "";
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const matchedFile = req.files.find(
                (f) =>
                    f.fieldname === `receipt_${i}` ||
                    f.fieldname === `receipt_${bill.id}` ||
                    (bill.receiptName && f.originalname === bill.receiptName)
            );
            if (matchedFile) {
                receiptPath = matchedFile.path.replace(/\\/g, "/");
            }
        }

        if (!receiptPath && typeof bill.receipt === "string") {
            receiptPath = bill.receipt;
        }

        billData.push({
            trip: trip._id,
            driver: driverId,
            billType,
            amount,
            date,
            description,
            receipt: receiptPath || "",
            status: "pending"
        });
    }

    const createdBills = await Bill.insertMany(billData);
    return sendSuccess(res, 201, "Bills added successfully", createdBills);
};

export const getBillsOfTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const driverId = req.user._id || req.user.id;
        const userRole = req.user.role;

        let filter = {};

        // If a specific trip was requested
        if (tripId && tripId !== "all" && typeof tripId === "string" && tripId.trim()) {
            const trimmedTripId = tripId.trim();
            let foundTrip = null;

            if (/^[0-9a-fA-F]{24}$/.test(trimmedTripId)) {
                foundTrip = await Trip.findById(trimmedTripId);
            }
            if (!foundTrip) {
                foundTrip = await Trip.findOne({ tripNo: trimmedTripId });
            }

            if (foundTrip) {
                // Return all bills filed for this trip
                filter = { trip: foundTrip._id };
            } else if (/^[0-9a-fA-F]{24}$/.test(trimmedTripId)) {
                filter = { trip: trimmedTripId };
            } else {
                return sendSuccess(res, 200, "Bills fetched successfully", []);
            }
        } else {
            // When tripId is "all", find all trips assigned to this driver
            if (userRole === "Driver") {
                let driverMatch = [];
                if (driverId && mongoose.Types.ObjectId.isValid(driverId)) {
                    driverMatch.push({ driver: driverId });
                    driverMatch.push({ driver: new mongoose.Types.ObjectId(driverId) });
                }
                const assignedTrips = driverMatch.length > 0
                    ? await Trip.find({ $or: driverMatch }).select("_id")
                    : [];
                const tripIds = assignedTrips.map((t) => t._id);

                let billOrConditions = [];
                if (driverId && mongoose.Types.ObjectId.isValid(driverId)) {
                    billOrConditions.push({ driver: driverId });
                    billOrConditions.push({ driver: new mongoose.Types.ObjectId(driverId) });
                }
                if (tripIds.length > 0) {
                    billOrConditions.push({ trip: { $in: tripIds } });
                }
                filter = billOrConditions.length > 0 ? { $or: billOrConditions } : {};
            } else {
                // If Owner/Admin is testing driver view, show all bills
                filter = {};
            }
        }

        const bills = await Bill.find(filter)
            .populate({
                path: "trip",
                select: "tripNo pickupLocation deliveryLocation truck cargo freightAmount status",
                populate: {
                    path: "truck",
                    select: "truckNo model"
                }
            })
            .populate("driver", "fullName email phone")
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, "Bills fetched successfully", bills || []);
    } catch (err) {
        console.error("Error in getBillsOfTrip:", err);
        return sendError(res, 500, err.message || "Failed to fetch bills");
    }
};