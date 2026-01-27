/** @format */

import { Request, Response, NextFunction } from "express";
import { createKitchen,updateKitchen,getKitchen } from "./kitchen.service";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const kitchen = await createKitchen(req.body);
    res.json({ success: true, data: kitchen });
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
    const kitchen = await updateKitchen(req.body);
    res.json({ success: true, data: kitchen });
  } catch (err) {
    next(err);
  }
};

export const get = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const kitchen = await getKitchen();
    res.json({ success: true, data: kitchen });
  } catch (err) {
    next(err);
  }
};
