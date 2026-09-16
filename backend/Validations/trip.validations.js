import { z } from "zod";

export const createTripSchema = z.object({
    tripNo: z.string().min(1, "Trip Number is required").regex(/^TRIP-[A-Z]{2}-\d{4}$/, "Invalid Trip Number"),
    startDate: z.coerce.date({ required_error: "Start Date is required" }),
    endDate: z.coerce.date({ required_error: "End Date is required" }),
    pickupLocation: z.object({
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        pinCode: z
            .string()
            .regex(/^\d{6}$/, "Pin Code must be 6 digits"),
        latitude: z.coerce.number({ required_error: "Latitude is required" }),
        longitude: z.coerce.number({ required_error: "Longitude is required" }),
    }),
    deliveryLocation: z.object({
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        pinCode: z
            .string()
            .regex(/^\d{6}$/, "Pin Code must be 6 digits"),
        latitude: z.string().min(1, "Latitude is required"),
        longitude: z.string().min(1, "Longitude is required"),
    }),
    cargo: z.object({
        type: z.string().min(1, "cargo type is required"),
        description: z.string().min(1, "Description is required"),
        weight: z.coerce.number().positive("weight must be positive"),
        weightUnit: z.string().default("kg"),
        quantity: z.coerce.number().positive("quantity must be positive"),
        value: z.coerce.number().min(0, "Cargo value can't be negative"),

    }),
    truck: z.string().min(1, "Truck is required"),
    driver: z.string().min(1, "Driver is required"),

    freightAmount: z.coerce.number().positive("Freight amount must be positive"),
    fuelCost: z.coerce.number().positive("Fuel cost must be positive"),
    tollCost: z.coerce.number().positive("Toll cost must be positive"),
    otherExpenses: z.coerce.number().positive("Other expenses must be positive"),
    notes: z.string().optional(),
});