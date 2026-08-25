import { z } from "zod";

export const addDriverSchema = z.object({
    fullName: z.string().min(5, "Name should be atlest 5 characters").max(50, "Name is too long"),
    phone: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid Phone Number"),
    email: z.string().email("Invalid Email"),

});