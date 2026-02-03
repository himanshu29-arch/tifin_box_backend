/** @format */

import { z } from "zod";

/**
 * Admin: Create kitchen (only once)
 */
export const createKitchenSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Kitchen name must be at least 3 characters"),
    description: z.string().max(255).optional(),

    imageUrl: z.string().url().optional(),
    type: z.enum(["VEG", "NON_VEG", "BOTH"]),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address: z.string().optional(),
  }),
});
/**
 * Admin: Update kitchen
 */

export const updateKitchenSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().max(255).optional(),

    imageUrl: z.string().url().optional(),
    type: z.enum(["VEG", "NON_VEG", "BOTH"]).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address: z.string().optional(),
  }),
});

