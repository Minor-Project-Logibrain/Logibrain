import { Router } from "express";

import errorHandler from "../utils/ExpressError.js";
import { loginDriver, loginOwner, verifyLoginOtp, signUp, verifySignupOtp, resendOtpforSignup, resendOtpforLogin } from "../controllers/auth.controller.js"
const router = Router();



router.post("/signup", errorHandler(signUp));
router.post("/verify-signup-otp", errorHandler(verifySignupOtp));
router.post("/login/driver", errorHandler(loginDriver));
router.post("/login/owner", errorHandler(loginOwner));
router.post("/verify-login-otp", errorHandler(verifyLoginOtp));
router.post("/resend-signup-otp", errorHandler(resendOtpforSignup));
router.post("/resend-login-otp", errorHandler(resendOtpforLogin));



export default router;