import { Router } from "express";
import { forgotpassEmail, forgotOtp, resetPass } from "../controllers/forgot.controller.js";
import errorHandler from "../utils/ExpressError.js";
const router = Router();
router.post("/forgot/passhome-page", errorHandler(forgotpassEmail));

router.post("/verify-forgot-pass-otp", errorHandler(forgotOtp));

router.post("/forgot-pass-set-new-pass", errorHandler(resetPass));

export default router;