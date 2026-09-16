import redisClient from "../redis.js";
import User from "../models/User.js";
import sendOtp from "../utils/sendOtp.js";
import generateOtp from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { setTokenCookie, setEmailCookie, clearEmailCookie, clearTokenCookie } from "../utils/cookies.js";
import { OTP_EXPIRY, BCRYPT_PASSWORD_ROUNDS, BCRYPT_OTP_ROUNDS, REDIS_OTP_EXPIRY } from "../utils/constants.js";
import { signUpSchema, verifySignupOtpSchema, loginDriverSchema, loginOwnerSchema, loginOtpSchema } from "../Validations/auth.validation.js";
import cookieParser from "cookie-parser";


export const signUp = async (req, res) => {
    const result = signUpSchema.safeParse(req.body);

    if (!result.success) {
        console.log(result.error.issues);

        return sendError(
            res,
            400,
            result.error.issues[0].message
        );
    }
    const { fullName, company, phone, confirmPassword, email, password } = result.data

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return sendError(res, 403, "The user is already existing");
    }
    const otp = generateOtp();
    const hashedPass = await bcrypt.hash(password, BCRYPT_PASSWORD_ROUNDS);
    const hashedOtp = await bcrypt.hash(otp, BCRYPT_OTP_ROUNDS);
    await sendOtp(otp, email);

    await redisClient.hset(`signup:${email}`, {
        fullName,
        company,
        phone,
        email,
        password: hashedPass,
        otp: hashedOtp,
        otpExpiry: Date.now() + OTP_EXPIRY,
    });
    await redisClient.expire(`signup:${email}`, REDIS_OTP_EXPIRY);
    console.log(email);
    setEmailCookie(res, email);
    console.log(res.getHeaders());
    return sendSuccess(res, 200, "User will Registerd after otp confirmation");
};

export const verifySignupOtp = async (req, res) => {
    console.log(req.body);
    const result = verifySignupOtpSchema.safeParse(req.body);
    if (!result.success) {
        return sendError(res, 400, "All fileds required");
    }
    const { otp } = result.data;
    const email = req.cookies.email;
    console.log("Cookies:", req.cookies);
    if (!email) {
        return sendError(res, 400, "All fildes are required");
    };
    const userData = await redisClient.hgetall(`signup:${email}`);
    if (!userData.email) {
        return sendError(res, 404, "The user data dose not exsist");
    };
    const isOtpTrue = await bcrypt.compare(otp, userData.otp);
    if (!isOtpTrue) {
        return sendError(res, 401, "The Otp is incorrect");
    };
    if (userData.otpExpiry && Number(userData.otpExpiry) < Date.now()) {
        return sendError(res, 401, "The Otp is expired");
    }
    const newUser = await User.create({
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        company: userData.company,

        password: userData.password,
        otp: userData.otp,
        otpExpiry: userData.otpExpiry,
        role: "Owner",
    });
    const token = generateToken(newUser._id);
    setTokenCookie(res, token);
    await redisClient.del(`signup:${email}`);
    clearEmailCookie(res);
    return sendSuccess(res, 200, "Otp verified");
};


export const loginDriver = async (req, res) => {

    const result = loginDriverSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(
            res,
            400,
            result.error.errors[0].message
        );
    }


    const { phone, email, password } = result.data;


    const isNum = /^[6-9][0-9]{9}$/;


    if (!isNum.test(phone)) {

        return sendError(
            res,
            400,
            "The Phone number is incorrect"
        );

    }


    const existingUser = await User.findOne({ email });


    if (!existingUser) {

        return sendError(
            res,
            404,
            "The user does not exist"
        );

    }


    const isPasswordTrue = await bcrypt.compare(
        password,
        existingUser.password
    );


    if (!isPasswordTrue) {

        return sendError(
            res,
            401,
            "The Password is incorrect"
        );

    }


    // USER IS ALREADY A DRIVER

    if (existingUser.role === "Driver") {

        const token = generateToken(
            existingUser._id
        );

        setEmailCookie(
            res,
            email
        );

        setTokenCookie(
            res,
            token
        );

        return sendSuccess(
            res,
            200,
            "Driver Logged in successfully"
        );

    }


    // USER IS NOT A DRIVER
    // SEND OTP

    const otp = generateOtp();


    const hashedOtp = await bcrypt.hash(
        otp,
        BCRYPT_OTP_ROUNDS
    );


    await sendOtp(
        otp,
        email
    );


    await User.updateOne(
        { email },
        {
            otp: hashedOtp,

            otpExpiry:
                Date.now() + OTP_EXPIRY,

            role: "Driver"
        }
    );


    setEmailCookie(
        res,
        email
    );


    return sendSuccess(
        res,
        200,
        "OTP sent successfully"
    );

};



export const loginOwner = async (req, res) => {
    const result = loginOwnerSchema.safeParse(req.body);
    if (!result.success) {
        return sendError(res, 400, "All the fields are Required");
    }
    const { email, password } = result.data;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return sendError(res, 404, "User is not existing");
    };
    const compair = await bcrypt.compare(password, existingUser.password);
    if (!compair) {
        return sendError(res, 400, "Password is incorrect");
    };
    const token = generateToken(existingUser._id);
    await User.updateOne({ email }, {
        role: "Owner",
    });
    setEmailCookie(res, email);
    setTokenCookie(res, token);

    return sendSuccess(res, 200, "Email is verified");
}

export const verifyLoginOtp = async (req, res) => {
    const result = loginOtpSchema.safeParse(req.body);
    if (!result.success) {
        return sendError(res, 400, "All filed are Required");
    }
    const { otp } = result.data;
    const email = req.cookies.email;
    if (!email) {
        return sendError(res, 400, "Email is Required");
    };
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return sendError(res, 404, "Invalid Request");
    }
    const Otp = existingUser.otp;
    const verifird = bcrypt.compare(otp, Otp);
    if (!verifird) {
        return sendError(res, 400, "Otp is incorrect");
    }
    const token = generateToken(existingUser._id);
    setTokenCookie(res, token);
    clearEmailCookie(res);
    return sendSuccess(res, 200, "Otp verified successfully");
};

export const resendOtpforSignup = async (req, res) => {
    const email = req.cookies.email;
    if (!email) {
        return sendError(req, 400, "Cookie expires, Please Login Again");
    }
    const userData = await redisClient.hgetall(`signup:${email}`);
    if (!userData.email) {
        return sendError(req, 404, "data not found");
    };
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await sendOtp(otp, userData.email);
    await redisClient.hset(`signup:${email}`, {
        otp: hashedOtp,
        otpExpiry: Date.now() + OTP_EXPIRY,
    });
    await redisClient.expire(`signup:${email}`, REDIS_OTP_EXPIRY);
    return sendSuccess(res, 200, "Otp Resend Successfully");

};

export const resendOtpforLogin = async (req, res) => {
    const email = req.cookies.email;
    if (!email) {
        return sendError(res, 400, "Cookie expires, Please Login Again");
    };
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return sendError(res, 404, "User dose not exist");
    };
    const otp = generateOtp();
    await sendOtp(otp, email);
    const hashedOtp = await bcrypt.hash(otp, BCRYPT_OTP_ROUNDS);
    await User.updateOne({
        otp: hashedOtp,
        otpExpiry: Date.now() + OTP_EXPIRY,
    });
    return sendSuccess(res, 200, "Otp Resend Successfully");
};

export const check = async (req, res) => {
    return sendSuccess(res, 200, "User is Verified", req.user);
};