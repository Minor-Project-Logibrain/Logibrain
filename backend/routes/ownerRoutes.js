import { getDrivers, addDrivers, updateDriver, deleteDriver, getTrucks, addTruck, updateTruck, deleteTruck, getAvailableDrivers, getAvailableTrucks } from "../controllers/owner.controller.js";
import errorHandler from "../utils/ExpressError.js";
import { Router } from "express";
import { hasToken } from "../middleware/hastoken.js";
import isAdmin from "../middleware/isAdmin.js";
import { upload } from "../middleware/upload.js";
const router = Router();

router.get("/drivers", hasToken, isAdmin, errorHandler(getDrivers));
router.post("/add-driver", hasToken, isAdmin, errorHandler(addDrivers));
router.put("/drivers/:id", hasToken, isAdmin, errorHandler(updateDriver));
router.delete("/drivers/:id", hasToken, isAdmin, errorHandler(deleteDriver));
router.get("/available-drivers", hasToken, isAdmin, errorHandler(getAvailableDrivers));

// TRUCK ROUTES
router.get("/trucks", hasToken, isAdmin, errorHandler(getTrucks));
router.post("/add-truck", hasToken, isAdmin, upload.single("img"), errorHandler(addTruck));
router.put("/trucks/:id", hasToken, isAdmin, upload.single("img"), errorHandler(updateTruck));
router.delete("/trucks/:id", hasToken, isAdmin, errorHandler(deleteTruck));
router.get("/available-trucks", hasToken, isAdmin, errorHandler(getAvailableTrucks));

export default router;
