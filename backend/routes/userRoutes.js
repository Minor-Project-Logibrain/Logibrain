import {Router} from "express";
import redisClient from "../redis.js";
import User from "../models/User.js";
import sendOtp from "../utils/sendOtp.js";
import generateOtp from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import errorHandler from "../utils/ExpressError.js";
const router = Router();



router.post("/signup",errorHandler(async(req,res)=>{
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
    await redisClient.expire(`signup:${email}`,600);
    res.cookie('email',email,{
        httpOnly:true,
        maxAge:2 * 24 * 60 * 60 * 1000,
        sameSite:"strict",
    });
    return res.status(200).json({
        success:true,
        message:"User will Registerd after otp confirmation",
    });
}));
router.post("/verify-signup-otp",errorHandler(async(req,res)=>{
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
    const isOtpTrue = await bcrypt.compare(otp,userData.otp);
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
    const newUser = await User.create({
        email:userData.email,
        password:userData.password,
        userName:userData.userName,
        otp:userData.otp,
        otpExpiry:userData.otpExpiry,
    });
    const token = generateToken(newUser._id);
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        maxAge: 7 * 24 * 60 *60 *1000,
    });
    await redisClient.del(`signup:${email}`);
    res.clearCookie("email");
    return res.status(200).json({
        success:true,
        message:"Otp verified",
    });
}));
router.post("/login",errorHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password ){
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
    const isPasswordTrue = await bcrypt.compare(password,existingUser.password);
    if(!isPasswordTrue){
        return res.status(401).json({
            success:false,
            message:"The Password is incorrect",
        });
    };
    if(existingUser.role === "driver"){
        const token = generateToken(existingUser._id);
        return res.cookie("token",token,{
            httpOnly:true,
            sameSite:"strict",
            maxAge: 7 *24 *60*60*1000,
        }).status(200).json({
            success:true,
            message:"Diver Logged in successfully",
        });
    }
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp,5);
    await sendOtp(otp,email);
    await User.updateOne({email},{
        otp:hashedOtp,
        otpExpiry:Date.now() + 5*60*1000,
    });
    res.cookie('email',email,{
        maxAge:2*24*60*60*1000,
        sameSite:"strict",
        httpOnly:true,
    });
    
    return res.status(200).json({
        success:true,
        message:"User is Logged in successfully",
    });
}));

router.post("/verify-login-otp",errorHandler(async(req,res)=>{
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
            message:"Otp is not wrong",
        });
    }
    const token = generateToken(existingUser._id);
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.clearCookie("email");
    return res.status(200).json({
        success:true,
        message:"Otp verified successfully",
    });
}));

router.post("/test", (req, res) => {
    res.cookie("test", "123");
    res.send("Cookie set");
});

export default router;