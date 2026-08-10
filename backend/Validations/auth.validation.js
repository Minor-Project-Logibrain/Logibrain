import { email, z } from "zod";

export const signUpSchema = z.object({
    fullName: z.string().min(3, "Full Name must be at least 3 characters"),
    company: z.string().min(6, "Company Name is Required"),
    phone: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid Phone Number"),
    email: z.string().email("Email is Invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),


}).refine((data) => data.password === data.confirmPassword, {
    message: "Password is not match",
    path: ["confirmPassword"],
});

export const verifySignupOtpSchema = z.object({
    otp: z.string().length(6, "Otp must be 6 digits").regex(/^\d{6}$/, "Invalid Otp"),

});

export const loginDriverSchema = z.object({
    phone: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid Phone Number"),
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password is Required"),
});

export const loginOwnerSchema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password is Required"),
})

export const loginOtpSchema = z.object({
    otp: z.string().length(6, "")
})