import {Router} from "express";
import redisClient from "../redis";
import User from "../models/User";
import sendOtp from "../utils/sendOtp";
import generateOtp from "../utils/generateOtp";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken";
import errorHandler from "../utils/ExpressError";
const router = Router();

router.post("/signup",errorHandler,async(req,res)=>{
    const {email,password,username} = req.body;
    if(!email || !password || !username){
        return res.status(501).json({
            success:false,
            message:"All fileds are required",
        });
    };
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(501).json({
            success:false,
            message:"The user is already existing",
        });
    }
    const otp = generateOtp();
    const hashedPass = await bcrypt.hash(password,10);
    const hashedOtp = await bcrypt.hash(otp,5);
    await sendOtp(otp,email);

    await redisClient.hset(`signup:${email}`,{
        email,
        password:hashedPass,
        otp:hashedOtp,
        otpExpiry:Date.now() + 5*60*1000,
    });
    await redisClient.expire(10*60*1000);
    res.cookie('email',email,{
        httpOnly:true,
        maxAge:2 * 24 * 60 * 60 * 1000,
        sameSite:"strict",
    });
    return res.status(200).json({
        success:true,
        message:"User will Registerd after otp confirmation",
    });
});
router.post("/verify-signup-otp",async(req,res)=>{
    const {otp} = req.body;
    const email = req.cookies.email;
    
    if(!otp || !email){
        return res.status(501).json({
            success:false,
            message:"All fileds are required",
        });
    };
    const userData = await redisClient.hgetall(`signup:${email}`);
    if(!userData.email){
        return res.status(501).json({
            success:false,
            message:"The user data dose not exsist",
        });
    };
    const isOtpTrue = await bcrypt.compare(userData.otp,otp);
    if(!isOtpTrue){
        return res.status(401).json({
            success:false,
            message:"The Otp is incorrect",
        });
    };
    if(userData.otpExpiry && Number(userData.otpExpiry) < Date.now()){
        return  res.status(401).json({
        success:false,
        message:"The Otp is expired",
    });
    }
    await User.create({
        email:userData.email,
        password:userData.password,
        userName:userData.userName,
        otp:userData.otp,
        otpExpiry:userData.otpExpiry,
    });
    return res.status(200).json({
        success:true,
        message:"Otp verified",
    });
});
router.post("/login",errorHandler,async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password || !username){
        return res.status(501).json({
            success:false,
            message:"All fileds are required",
        });
    };
    const existingUser = await User.findOne({email});
    if(!existingUser){
        return res.status(501).json({
            success:false,
            message:"The user dose not existing",
        });
    };
    const isPasswordTrue = await bcrypt.compare(existingUser.password,password);
    if(!isPasswordTrue){
        return res.status(401).json({
            success:false,
            message:"The Password is incorrect",
        });
    };
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp,5);
    await sendOtp(otp,email);
    res.cookie('email',email,{
        maxAge:2*24*60*60*1000,
        sameSite:"strict",
        httpOnly:true,
    });
    await User.updateOne({email},{
        otp:hashedOtp,
        otpExpiry:Date.now() + 5*60*1000,
    });
    return res.status(200).json({
        success:true,
        message:"User is Logged in successfully",
    });
});