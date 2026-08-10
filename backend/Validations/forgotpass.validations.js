import { z } from "zod";

export const forgotPassEmailSchema = z.object({
    email: z.string().email("Invalid Email"),
})
export const forgotPassOtpSchema = z.object({
    otp: z.string().length(6, "Otp should be 6 digits"),
})
export const resetPassSchema = z.object({
    password: z.string().length(8, "Password should be 8 characters"),
    newPassword: z.string().length(8, "Password should be 8 characters"),
});

