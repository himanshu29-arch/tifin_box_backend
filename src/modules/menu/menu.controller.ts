/** @format */
import { Request, Response, NextFunction } from "express";
import {
  createMenuItem,
  getMyMenu,
  toggleMenuItem,
  updateMenuItem,
  getPublicMenu,
} from "./menu.service";
import { uploadImageToGCP } from "../../utils/uploadToGcp";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const imageUrl = req.file
      ? await uploadImageToGCP(req.file, "menu-items")
      : undefined;

    const nutrition = req.body.nutrition
      ? JSON.parse(req.body.nutrition)
      : undefined;

    const menu = await createMenuItem({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      categoryId: req.body.categoryId,
      foodType: req.body.foodType,
      tiffinSize: req.body.tiffinSize,
      nutrition,
      imageUrl,
    });

    res.json({
      success: true,
      message: "Menu item created",
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const imageUrl = req.file
      ? await uploadImageToGCP(req.file, "menu-items")
      : undefined;

    const updatedItem = await updateMenuItem(req.params.id, {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
      imageUrl,
    });

    res.json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    next(err);
  }
}

export async function myMenu(req: Request, res: Response, next: NextFunction) {
  try {
    const menu = await getMyMenu();
    res.json({ success: true, data: menu });
  } catch (err) {
    next(err);
  }
}

export async function toggle(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await toggleMenuItem(req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function publicMenu(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const menu = await getPublicMenu({
      kitchenId: req.query.kitchenId as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      foodType: req.query.foodType as "VEG" | "NON_VEG" | undefined,
    });

    res.json({
      success: true,
      count: menu.length,
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}

