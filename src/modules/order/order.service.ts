/** @format */

import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

/**
 * Place order from cart
 */
export const placeOrderFromCart = async (
  userId: string,
  addressId: string,
  paymentMode: "UPI" | "COD",
) => {
  // 1️⃣ Validate address
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new ApiError("Invalid delivery address", 400);
  }

  // 2️⃣ Fetch cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  // 3️⃣ Get kitchen
  const kitchen = await prisma.kitchen.findFirst();
  if (!kitchen) {
    throw new ApiError("Kitchen not available", 400);
  }

  // 4️⃣ Totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalAmount = subtotal;

  // 5️⃣ Transaction
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        kitchenId: kitchen.id,
        addressId,
        status: "PLACED",
        subtotal,
        totalAmount,
        paymentMode,
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
        address: true,
      },
    });

    // 6️⃣ Create payment record
    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        mode: paymentMode,
        status: paymentMode === "COD" ? "PENDING" : "INITIATED",
      },
    });

    // 7️⃣ Clear cart
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
      items: {
        include: {
          menuItem: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
      },
      address: true,
      payment: true,
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
      address: true,
      payment: true,
      items: true,
    },
  });
};

/**
 * Admin: Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: "ACCEPTED" | "PREPARED" | "OUT_FOR_DELIVERY" | "DELIVERED",
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

/**
 * Admin: Mark COD order as paid
 */
export const markOrderPaid = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) {
    throw new ApiError("Payment not found", 404);
  }

  if (payment.status === "PAID") {
    throw new ApiError("Order already marked as paid", 400);
  }

  return prisma.payment.update({
    where: { orderId },
    data: { status: "PAID" },
  });
};
