import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const Transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

Transpoter.verify((err) => {
    if (err) {
        console.log("Nodemailer Error");

    } else {
        console.log("Nodemailer is Ready");

    }
});

export default Transpoter;