/** @format */
import { Request, Response, NextFunction } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./category.service";
import { uploadImageToGCP } from "../../utils/uploadToGcp";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file
      ? await uploadImageToGCP(req.file, "categories")
      : undefined;

    const category = await createCategory({
      name: req.body.name,
      imageUrl,
    });

    res.json({ success: true, data: category });
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
    res.json({ success: true, data: categories });
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
      ? await uploadImageToGCP(req.file, "categories")
      : undefined;

    const category = await updateCategory(req.params.id, {
      name: req.body.name,
      imageUrl,
    });

    res.json({ success: true, data: category });
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
    await deleteCategory(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
