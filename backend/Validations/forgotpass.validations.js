import { z } from "zod";

export const forgotPassEmailSchema = z.object({
    email: z.string().email("Invalid Email"),
})
export const forgotPassOtpSchema = z.object({
    otp: z.string().length(6, "Otp should be 6 digits"),
})
export const resetPassSchema = z.object({
    password: z.string().min(8, "Password should be atleast 8 characters").max(20, "Password should be atmost 20 characters"),
    newPassword: z.string().min(8, "Password should be atleast 8 characters").max(20, "Password should be atmost 20 characters"),
});

