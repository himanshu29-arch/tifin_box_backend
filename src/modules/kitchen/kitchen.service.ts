/** @format */

import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

/**
 * Admin: create kitchen (only once)
 */
export const createKitchen = async (data: {
  name: string;
  description?: string;
}) => {
  const existing = await prisma.kitchen.findFirst();

  if (existing) {
    throw new ApiError("Kitchen already exists", 409);
  }

  return prisma.kitchen.create({
    data,
  });
};

/**
 * Admin: update kitchen
 */
export const updateKitchen = async (data: {
  name?: string;
  description?: string;
}) => {
  const kitchen = await prisma.kitchen.findFirst();

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  return prisma.kitchen.update({
    where: { id: kitchen.id },
    data: {
      name: data.name ?? kitchen.name,
      description: data.description ?? kitchen.description,
    },
  });
};


/**
 * Public: get kitchen
 */
export const getKitchen = async () => {
  const kitchen = await prisma.kitchen.findFirst();

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  return kitchen;
};
