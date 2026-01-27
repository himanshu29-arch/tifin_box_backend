/** @format */

import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z.object({
    menuItemId: z.string().uuid(),
    quantity: z.coerce.number().int().min(1).max(10),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.coerce.number().int().min(1).max(10),
  }),
});
