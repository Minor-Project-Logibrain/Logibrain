import { z } from "zod";

export const addDriverSchema = z.object({
    fullName: z.string().min(5, "Name should be atlest 5 characters").max(50, "Name is too long"),
    phone: z.string().regex(/^[6-9][0-9]{9}$/, "Invalid Phone Number"),
    email: z.string().email("Invalid Email"),

});

export const addTruckSchema = z.object({
    truckNo: z.string().min(1, "Truck Number is required"),
    chassisNo: z.string().min(1, "Chassis Number is required"),
    vehicleModel: z.string().optional().or(z.literal('')),
    truckType: z.string().optional().or(z.literal('')),
    fuleType: z.string().optional().or(z.literal('')),
    manufacturer: z.string().optional().or(z.literal('')),
    model: z.string().optional().or(z.literal('')),
    manufacturingYear: z.preprocess((val) => (val === "" || val === undefined || val === null ? undefined : Number(val)), z.number().optional()),
    chassisNumber: z.string().optional().or(z.literal('')),
    engineNumber: z.string().optional().or(z.literal('')),
    loadCapacity: z.preprocess((val) => (val === "" || val === undefined || val === null ? undefined : Number(val)), z.number().optional()),
    assignedDriver: z.string().optional().nullable().or(z.literal('')),
    img: z.string().optional().or(z.literal('')),
    rcNumber: z.string().optional().or(z.literal('')),
    insurenceNumber: z.string().optional().or(z.literal('')),
    insurenceExpiry: z.string().optional().nullable().or(z.literal('')),
    status: z.enum(["available", "assigned", "maintenance", "inactive", "sold", "accidental", "insurance_expired"]).optional().default("available")
});
