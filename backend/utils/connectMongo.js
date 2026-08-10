import mongoose from "mongoose";

export const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connected");
    } catch (err) {
        console.log(err || "Error in conneting to database");
        process.exit(1);
    }
};