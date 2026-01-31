/** @format */

import { Request, Response, NextFunction } from "express";
import * as service from "./address.service";
import { AuthenticatedRequest } from "../../types/auth-request";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const address = await service.createAddress(authReq.user!.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Address added",
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const addresses = await service.getMyAddresses(authReq.user!.userId);
    res.json({ success: true, data: addresses });
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const address = await service.updateAddress(
      authReq.user!.userId,
      req.params.id,
      req.body,
    );

    res.json({
      success: true,
      message: "Address updated",
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    await service.deleteAddress(authReq.user!.userId, req.params.id);
    res.json({ success: true, message: "Address deleted" });
  } catch (err) {
    next(err);
  }
};
