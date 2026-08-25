import { getDrivers, addDrivers, updateDriver, deleteDriver } from "../controllers/owner.controller.js";
import errorHandler from "../utils/ExpressError.js";
import { Router } from "express";
import { hasToken } from "../middleware/hastoken.js";
import isAdmin from "../middleware/isAdmin.js";
const router = Router();

router.get("/drivers", hasToken, isAdmin, errorHandler(getDrivers));
router.post("/add-driver", hasToken, isAdmin, errorHandler(addDrivers));
router.put("/drivers/:id", hasToken, isAdmin, errorHandler(updateDriver));
router.delete("/drivers/:id", hasToken, isAdmin, errorHandler(deleteDriver));

export default router;  