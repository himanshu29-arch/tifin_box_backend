/** @format */

import { z } from "zod";

const nutritionSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
});

export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
    foodType: z.enum(["VEG", "NON_VEG"]),
    tiffinSize: z.enum(["HALF", "FULL"]).optional(),
    imageUrl: z.string().url().optional(),
    nutrition: z.array(nutritionSchema).optional(),
  }),
});

export const updateMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
    foodType: z.enum(["VEG", "NON_VEG"]).optional(),
    tiffinSize: z.enum(["HALF", "FULL"]).optional(),
    imageUrl: z.string().url().optional(),
    isAvailable: z.boolean().optional(),
    nutrition: z.array(nutritionSchema).optional(),
  }),
});
