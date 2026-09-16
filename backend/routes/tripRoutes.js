import { Router } from "express";
import { createTrip, getTripNumber, getTotleNumbersTrips, getTrips } from "../controllers/trip.controller.js";
import isAdmin from "../middleware/isAdmin.js";
import errorHandler from "../utils/ExpressError.js";
import { hasToken } from "../middleware/hastoken.js";

const router = Router();

router.post("/create-trip", hasToken, isAdmin, errorHandler(createTrip));
router.get("/check-trip-number/:tripNumber", hasToken, isAdmin, errorHandler(getTripNumber));
router.get("/totle-numbers-trips", hasToken, isAdmin, errorHandler(getTotleNumbersTrips));
router.get("/get-trips", hasToken, isAdmin, errorHandler(getTrips));
export default router;