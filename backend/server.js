import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import forgotPassRoutes from "./routes/forgotPassRoutes.js";
import { connectDB } from "./utils/connectMongo.js";
import ownerRoutes from "./routes/ownerRoutes.js";
const app = express();
dotenv.config();
const port = process.env.PORT;
(
    async () => await connectDB()
)();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
}));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("App is live");
});

app.use("/auth", userRoutes);
app.use("/forgotPass", forgotPassRoutes);
app.use("/owners", ownerRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(501).json({
        success: false,
        message: err.message,
    });

});
app.listen(port, () => {
    console.log("App is live");

});