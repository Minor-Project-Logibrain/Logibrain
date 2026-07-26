import {Router} from "express";
import redisClient from "../redis.js";
import User from "../models/User.js";
import sendOtp from "../utils/sendOtp.js";
import generateOtp from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import errorHandler from "../utils/ExpressError.js";
const router = Router();
router.post("/forgot/passhome-page",errorHandler(async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(501).json({
            success:false,
            message:"All filed are Required",
        });
    }
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(501).json({
            success:false,
            message:"Invalid Request",
        });
    }
    const otp = generateOtp();
    await sendOtp(otp,email);
    const hashedOtp = await bcrypt.hash(otp,5);
    await User.updateOne({email},{
        otp:hashedOtp,
        otpExpiry:Date.now() + 5 * 60 * 1000,
    });
    res.cookie("email",email,{
        httpOnly:true,
        sameSite:"strict",
        maxAge: 7 * 24 *60 *60*1000,
    });
    return res.status(200).json({
        success:true,
        message:"User is verified to proceed",
    });
}));

router.post("/verify-forgot-pass-otp",errorHandler(async(req,res)=>{
    const {otp} = req.body;
    const email = req.cookies.email;
    if(!email || !otp){
        return res.status(501).json({
            success:false,
            message:"All filed are Required",
        });
    };
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(501).json({
            success:false,
            message:"Invalid Request",
        });
    }
    const Otp = existingUser.otp;
    const verifird = await bcrypt.compare(otp,Otp);
    if(!verifird){
        return res.status(400).json({
            success:false,
            message:"Otp is incorrect",
        });
    }
    return res.status(200).json({
        success:true,
        message:"Otp verified successfully",
    });
}));

router.post("/forgot-pass-set-new-pass",errorHandler(async(req,res)=>{
    const {password,newPassword} = req.body;
    const email = req.cookies.email;
    if(!password || !newPassword){
        return res.status(501).json({
            success:false,
            message:"All filed are Required",
        });
    };
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(501).json({
            success:false,
            message:"Invalid Request",
        });
    }
    if(password !== newPassword){
        return res.status(501).json({
            success:false,
            message:"Pleas Enter Same Password",
        });
    }
    const hashedPass = await bcrypt.hash(password,10);
    await User.updateOne({email},{
        password:hashedPass,
    });
    const token = generateToken(existingUser._id); 
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:7 * 24 *60*60*1000,
    });
    res.clearCookie("email");
    return res.status(200).json({
        success:true,
        message:"Password Updated Successfully",
        json:"Password Updated Successfully",
    });
}));

export default router;