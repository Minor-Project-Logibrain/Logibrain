import { Router } from "express";
import { getTripsOfDriver } from "../controllers/trip.driver.controller.js";
import errorHandler from "../utils/ExpressError.js";
import { hasToken } from "../middleware/hastoken.js";

const router = Router();

router.get("/get-trips", hasToken, errorHandler(getTripsOfDriver));
export default router;