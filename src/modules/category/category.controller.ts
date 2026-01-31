/** @format */
import { Request, Response, NextFunction } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "./category.service";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await createCategory(req.body);

    res.json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

export const list = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await getCategories();

    res.json({
      success: true,
      data: categories,
    });
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
    const category = await updateCategory(req.params.id, req.body);

    res.json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};
