import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.js";
import User from "../models/User.js";

export const hasToken = async (req, res, next) => {
    console.log("========== AUTH MIDDLEWARE ==========");
    console.log("Cookies received:", req.cookies);
    const token = req.cookies.token;
    if (!token) {
        return sendError(res, 401, "Token not found");
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id).select("-password");
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        req.user = user;
        console.log("token checked", req.cookies);
        next();

    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return sendError(res, 401, "Token Expired");
        }
        return sendError(res, 401, "Invalid Token");
    }
}