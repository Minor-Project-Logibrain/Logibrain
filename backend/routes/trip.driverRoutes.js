import { Router } from "express";
import { getTripsOfDriver, addBill, getBillsOfTrip } from "../controllers/trip.driver.controller.js";
import errorHandler from "../utils/ExpressError.js";
import { hasToken } from "../middleware/hastoken.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/get-trips", hasToken, errorHandler(getTripsOfDriver));
router.post("/add-bill", hasToken, upload.any(), errorHandler(addBill));
router.get("/get-bills/:tripId", hasToken, errorHandler(getBillsOfTrip));

export default router;