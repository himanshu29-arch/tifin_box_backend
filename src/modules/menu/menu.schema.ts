/** @format */
import { z } from "zod";

/* ---------------- NUTRITION ---------------- */

const nutritionSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
});

/* ---------------- HELPERS ---------------- */

// string → number (multipart safe)
const numberFromString = z.preprocess(
  (val) => (val === undefined || val === "" ? undefined : Number(val)),
  z.number().positive(),
);

// JSON string → object/array
const jsonFromString = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      return JSON.parse(val);
    }
    return val;
  }, schema);

/* ================= CREATE MENU ================= */

export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),

    price: numberFromString, // ✅ FIXED

    categoryId: z.string().uuid(),
    foodType: z.enum(["VEG", "NON_VEG"]),
    tiffinSize: z.enum(["HALF", "FULL"]).optional(),

    nutrition: jsonFromString(z.array(nutritionSchema)).optional(), // ✅ FIXED
  }),
});

/* ================= UPDATE MENU ================= */

export const updateMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),

    price: numberFromString.optional(), // ✅ FIXED

    categoryId: z.string().uuid().optional(),
    foodType: z.enum(["VEG", "NON_VEG"]).optional(),
    tiffinSize: z.enum(["HALF", "FULL"]).optional(),
    isAvailable: z.preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      z.boolean(),
    ).optional(),

    nutrition: jsonFromString(z.array(nutritionSchema)).optional(), // ✅ FIXED
  }),
});
