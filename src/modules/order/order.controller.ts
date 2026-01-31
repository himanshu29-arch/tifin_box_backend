/** @format */

import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../types/auth-request";
import {
  placeOrderFromCart,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  markOrderPaid,
} from "./order.service";

/**
 * Customer: Place order
 */
export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { addressId, paymentMode } = req.body;

    const order = await placeOrderFromCart(
      authReq.user.userId,
      addressId,
      paymentMode,
    );

    res.json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Customer: My orders
 */
export const myOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const orders = await getMyOrders(authReq.user.userId);

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: All orders
 */
export const listOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await getAllOrders();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Update order status
 */
export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);

    res.json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Mark order as paid (COD)
 */
export const markPaid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payment = await markOrderPaid(req.params.id);

    res.json({
      success: true,
      message: "Order marked as paid",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};
