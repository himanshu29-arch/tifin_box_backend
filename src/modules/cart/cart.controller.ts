/** @format */

import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../types/auth-request";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "./cart.service";

export const viewCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const cart = await getCart(authReq.user.userId);

    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { menuItemId, quantity } = req.body;

    const item = await addItemToCart(authReq.user.userId, menuItemId, quantity);

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { quantity } = req.body;

    const item = await updateCartItem(
      authReq.user.userId,
      req.params.id,
      quantity,
    );

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;

    await removeCartItem(authReq.user.userId, req.params.id);

    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    next(err);
  }
};
