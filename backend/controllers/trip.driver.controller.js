import Trip from "../models/Trip.js";
import { sendError, sendSuccess } from "../utils/response.js";
import Bill from "../models/Bill.js";


export const getTripsOfDriver = async (req, res) => {
    const id = req.user.id;
    console.log("REQ USER:", req.user);
    const trips = await Trip.find({ driver: id }).populate("truck", "truckNo").populate("driver", "fullName");
    console.log("TRIPS:", trips);
    return sendSuccess(res, 200, "Trips of this driver", trips);
};

export const addBill = async (req, res) => {
    const { tripId, bills } = req.body;
    if (!tripId) {
        return sendError(res, 404, "Trip Not founded");
    }
    const trip = await Trip.findById(tripId)
    if (!trip) {
        return sendError(res, 404, "Trip Not founded");
    }
    const driverId = req.user.id;
    const billData = bills.map((bill) => (
        {
            trip: tripId,
            driver: driverId,
            billType: bill.billType,
            amount: bill.amount,
            date: bill.date,
            description: bill.description,
            receipt: bill.receipt,

        }
    )
    );
    const createdBills = await Bill.insertMany(billData);
    return sendSuccess(res, 200, "Bill added successfully", createdBills);
}