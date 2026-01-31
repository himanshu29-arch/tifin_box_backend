/** @format */

import { z } from "zod";

export const placeOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid(),
    paymentMode: z.enum(["UPI", "COD"]),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "ACCEPTED",
      "PREPARED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ]),
  }),
});
