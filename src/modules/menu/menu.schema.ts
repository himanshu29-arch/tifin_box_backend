/** @format */

import { z } from "zod";

export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.number().positive(),
    tiffinSize: z.enum(["HALF", "FULL"]),
    imageUrl: z.string().url().optional(),
  }),
});

export const updateMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    tiffinSize: z.enum(["HALF", "FULL"]).optional(),
    imageUrl: z.string().url().optional(),
    isAvailable: z.boolean().optional(),
  }),
});
