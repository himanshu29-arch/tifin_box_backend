/** @format */

import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });
  }

  return cart;
};

export const addItemToCart = async (
  userId: string,
  menuItemId: string,
  quantity: number,
) => {
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      isAvailable: true,
    },
  });

  if (!menuItem) {
    throw new ApiError("Menu item not available", 400);
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_menuItemId: {
        cartId: cart.id,
        menuItemId,
      },
    },
  });

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (newQty > 10) {
      throw new ApiError("Maximum quantity per item is 10", 400);
    }

    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      menuItemId,
      quantity,
      price: menuItem.price,
    },
  });
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number,
) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new ApiError("Cart not found", 404);

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
};

export const removeCartItem = async (userId: string, itemId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new ApiError("Cart not found", 404);

  return prisma.cartItem.delete({
    where: { id: itemId },
  });
};

export const getCart = async (userId: string) => {
  return getOrCreateCart(userId);
};
