import express,{Router} from "express";
import dotenv from "dotenv";
import errorHandler from "./utils/ExpressError";
import cros from "cros";
const app = express();
dotenv.config();
const port = process.env.PORT;

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