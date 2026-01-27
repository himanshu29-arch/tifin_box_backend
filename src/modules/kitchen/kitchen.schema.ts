/** @format */

import { z } from "zod";

/**
 * Admin: Create kitchen (only once)
 */
export const createKitchenSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Kitchen name must be at least 3 characters"),
    description: z.string().max(255, "Description too long").optional(),
  }),
});

/**
 * Admin: Update kitchen
 */
export const updateKitchenSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Kitchen name must be at least 3 characters")
      .optional(),
    description: z.string().max(255, "Description too long").optional(),
  }),
});
