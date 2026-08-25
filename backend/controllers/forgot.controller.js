import User from "../models/User.js";
import sendOtp from "../utils/sendOtp.js";
import generateOtp from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import errorHandler from "../utils/ExpressError.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { setTokenCookie, setEmailCookie, clearEmailCookie, clearTokenCookie } from "../utils/cookies.js";
import { forgotPassEmailSchema, forgotPassOtpSchema, resetPassSchema } from "../Validations/forgotpass.validations.js";

export const forgotpassEmail = async (req, res) => {
    const result = forgotPassEmailSchema.safeParse(req.body);
    if (!result.success) {
        return sendError(req, 400, result.error.issues[0]?.message || "Invalid data");
    };

    const { email } = req.body;
    if (!email) {
        return sendError(req, 401, "All Fields are Required");
    };
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return sendError(req, 501, "Invalid Request");
    }
    const otp = generateOtp();
    await sendOtp(otp, email);
    const hashedOtp = await bcrypt.hash(otp, 5);
    await User.updateOne({ email }, {
        otp: hashedOtp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
    });
    setEmailCookie(res, email);
    return sendSuccess(res, 200, "User is verified to proceed");
}

export const forgotOtp = async (req, res) => {
    const result = forgotPassOtpSchema.safeParse(req.body);
    if (!result.success) {
        return sendError(res, 400, result.error.issues[0]?.message || "Invalid data");
    };
    const { otp } = result.data;
    const email = req.cookies.email;
    if (!email || !otp) {
        return sendError(res, 401, "All Fields are Required");
    };
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return sendError(res, 501, "Invalid Request");
    }
    const Otp = existingUser.otp;
    const verifird = await bcrypt.compare(otp, Otp);
    if (!verifird) {
        return sendError(res, 400, "Otp incorrect");
    }
    return sendSuccess(res, 200, "Otp verified successfully");
};

export const resetPass = async (req, res) => {
    const result = resetPassSchema.safeParse(req.body);
    if (!result.success) {
        return sendError(res, 400, "Invalid data");
    };
    const { password, newPassword } = result.data;
    const email = req.cookies.email;
    if (!email) {
        return sendError(res, 403, "Access Denied ,Cookie Time Out");
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return sendError(res, 501, "Invalid Request");
    }
    if (password !== newPassword) {
        return sendError(res, 501, "Password is incorrect");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, {
        password: hashedPass,
    });
    const token = generateToken(existingUser._id);
    setTokenCookie(res, token);
    clearEmailCookie(res);
    return sendSuccess(res, 200, "Password reset successfully");
};