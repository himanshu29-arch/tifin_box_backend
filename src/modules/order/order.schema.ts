/** @format */

// src/modules/order/order.schema.ts
import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "PREPARED", "OUT_FOR_DELIVERY", "DELIVERED"]),
});
