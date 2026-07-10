import express,{Router} from "express";
import dotenv from "dotenv";
import errorHandler from "./utils/ExpressError.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/auth",userRoutes);
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(501).json({
        success:false,
        message:err.message,
    });
    
});
app.listen(port,()=>{
    console.log("App is live");
    
});