import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const generateToken = (id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"},

    );
};

export default generateToken;