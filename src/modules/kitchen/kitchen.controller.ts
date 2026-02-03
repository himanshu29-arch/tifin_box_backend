/** @format */

import { Request, Response, NextFunction } from "express";
import {
  createKitchen,
  updateKitchen,
  getKitchen,
} from "./kitchen.service";
import { uploadImageToGCP } from "../../utils/uploadToGcp";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file
      ? await uploadImageToGCP(req.file, "kitchens")
      : undefined;

    const kitchen = await createKitchen({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      latitude: req.body.latitude ? Number(req.body.latitude) : undefined,
      longitude: req.body.longitude ? Number(req.body.longitude) : undefined,
      address: req.body.address,
      imageUrl,
    });

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
    const imageUrl = req.file
      ? await uploadImageToGCP(req.file, "kitchens")
      : undefined;

    const kitchen = await updateKitchen({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      latitude: req.body.latitude ? Number(req.body.latitude) : undefined,
      longitude: req.body.longitude ? Number(req.body.longitude) : undefined,
      address: req.body.address,
      imageUrl,
    });

    res.json({ success: true, data: kitchen });
  } catch (err) {
    next(err);
  }
};

export const get = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const kitchen = await getKitchen();
    res.json({ success: true, data: kitchen });
  } catch (err) {
    next(err);
  }
};
