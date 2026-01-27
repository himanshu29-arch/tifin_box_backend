/** @format */
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

/**
 * Place order from cart
 */
export const placeOrderFromCart = async (userId: string) => {
  // 1️⃣ Fetch cart with items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  // 2️⃣ Get single kitchen (only one in system)
  const kitchen = await prisma.kitchen.findFirst();

  if (!kitchen) {
    throw new ApiError("Kitchen not available", 400);
  }

  // 3️⃣ Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalAmount = subtotal; // no tax / delivery in MVP

  // 4️⃣ Create order + items in transaction
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        kitchenId: kitchen.id,
        status: "PLACED",
        subtotal,
        totalAmount,
        paymentMode: "UPI",
        items: {
          create: cart.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 5️⃣ Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  });

  return order;
};


/**
 * Customer: Get my orders
 */
export const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });
};


/**
 * Admin: Get all orders
 */
export const getAllOrders = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      items: true,
    },
  });
};


/**
 * Admin: Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: "ACCEPTED" | "PREPARED" | "OUT_FOR_DELIVERY" | "DELIVERED"
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};