import { Router } from "express";

import errorHandler from "../utils/ExpressError.js";
import { loginDriver, loginOwner, verifyLoginOtp, signUp, verifySignupOtp } from "../controllers/auth.controller.js"
const router = Router();



router.post("signup", errorHandler(signUp));
router.post("/verify-signup-otp", errorHandler(verifySignupOtp));
router.post("/login/driver", errorHandler(loginDriver));
router.post("/login/owner", errorHandler(loginOwner));
router.post("/verify-login-otp", errorHandler(verifyLoginOtp));



export default router;