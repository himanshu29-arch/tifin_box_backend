/** @format */

import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

/**
 * Helper: get the single kitchen
 */
const getKitchen = async () => {
  const kitchen = await prisma.kitchen.findFirst();
  if (!kitchen) throw new ApiError("Kitchen not found", 404);
  return kitchen;
};

/**
 * Chef: Create menu item
 */
export const createMenuItem = async (data: {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  foodType: "VEG" | "NON_VEG";
  tiffinSize?: "HALF" | "FULL";
  imageUrl?: string;
  nutrition?: { key: string; value: string; unit?: string }[];
}) => {
  const kitchen = await getKitchen();

  return prisma.menuItem.create({
    data: {
      kitchenId: kitchen.id,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      price: data.price,
      foodType: data.foodType,
      tiffinSize: data.tiffinSize,
      imageUrl: data.imageUrl,
      nutrition: {
        create: data.nutrition ?? [],
      },
    },
    include: {
      category: true,
      nutrition: true,
    },
  });
};

/**
 * Chef: Get all menu items
 */
export const getMyMenu = async () => {
  const kitchen = await getKitchen();

  return prisma.menuItem.findMany({
    where: { kitchenId: kitchen.id },
    include: {
      category: true,
      nutrition: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Chef: Toggle availability
 */
export const toggleMenuItem = async (menuItemId: string) => {
  const item = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
  });

  if (!item) throw new ApiError("Menu item not found", 404);

  return prisma.menuItem.update({
    where: { id: menuItemId },
    data: { isAvailable: !item.isAvailable },
  });
};

/**
 * Chef: Update menu item
 */
export const updateMenuItem = async (
  menuItemId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    foodType?: "VEG" | "NON_VEG";
    tiffinSize?: "HALF" | "FULL";
    imageUrl?: string;
    isAvailable?: boolean;
    nutrition?: { key: string; value: string; unit?: string }[];
  },
) => {
  const item = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
  });

  if (!item) throw new ApiError("Menu item not found", 404);

  return prisma.menuItem.update({
    where: { id: menuItemId },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      foodType: data.foodType,
      tiffinSize: data.tiffinSize,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable,
      nutrition: data.nutrition
        ? {
            deleteMany: {},
            create: data.nutrition,
          }
        : undefined,
    },
    include: {
      category: true,
      nutrition: true,
    },
  });
};

/**
 * Public: Customer menu (filters)
 */
export const getPublicMenu = async (filters: {
  categoryId?: string;
  foodType?: "VEG" | "NON_VEG";
}) => {
  const kitchen = await getKitchen();

  return prisma.menuItem.findMany({
    where: {
      kitchenId: kitchen.id,
      isAvailable: true,
      categoryId: filters.categoryId,
      foodType: filters.foodType,
    },
    include: {
      category: true,
      nutrition: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
