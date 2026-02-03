/** @format */

import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    receiverName: z.string().min(2),
    contactNumber: z.string().min(8),
    houseNumber: z.string().min(1),
    sector: z.string().min(1),
    landmark: z.string().optional(),
    postcode: z.string().min(4),
    mapUrl: z.string().url().optional(),

    latitude: z.number(),
    longitude: z.number(),
    addressType: z.enum(["HOME", "WORK", "OTHER"]),

    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    receiverName: z.string().min(2).optional(),
    contactNumber: z.string().min(8).optional(),
    houseNumber: z.string().min(1).optional(),
    sector: z.string().min(1).optional(),
    landmark: z.string().optional(),
    postcode: z.string().min(4).optional(),
    mapUrl: z.string().url().optional(),

    latitude: z.number().optional(),
    longitude: z.number().optional(),
    addressType: z.enum(["HOME", "WORK", "OTHER"]).optional(),

    isDefault: z.boolean().optional(),
  }),
});

