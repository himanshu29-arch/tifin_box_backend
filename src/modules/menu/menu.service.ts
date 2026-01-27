/** @format */
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

/**
 * Helper: get the single kitchen
 */
const getKitchen = async () => {
  const kitchen = await prisma.kitchen.findFirst();

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  return kitchen;
};

/**
 * Chef: Create menu item
 */
export const createMenuItem = async (data: {
  name: string;
  description?: string;
  price: number;
  tiffinSize: "HALF" | "FULL";
  imageUrl?: string;
}) => {
  const kitchen = await getKitchen();

  return prisma.menuItem.create({
    data: {
      kitchenId: kitchen.id,
      name: data.name,
      description: data.description,
      price: data.price,
      tiffinSize: data.tiffinSize,
      imageUrl: data.imageUrl,
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

  if (!item) {
    throw new ApiError("Menu item not found", 404);
  }

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
    tiffinSize?: "HALF" | "FULL";
    imageUrl?: string;
    isAvailable?: boolean;
  },
) => {
  const item = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
  });

  if (!item) {
    throw new ApiError("Menu item not found", 404);
  }

  return prisma.menuItem.update({
    where: { id: menuItemId },
    data: {
      name: data.name ?? item.name,
      description: data.description ?? item.description,
      price: data.price ?? item.price,
      tiffinSize: data.tiffinSize ?? item.tiffinSize,
      imageUrl: data.imageUrl ?? item.imageUrl,
      isAvailable: data.isAvailable ?? item.isAvailable,
    },
  });
};

/**
 * Public: Customer menu (available items only)
 */
export const getPublicMenu = async () => {
  const kitchen = await getKitchen();

  return prisma.menuItem.findMany({
    where: {
      kitchenId: kitchen.id,
      isAvailable: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
