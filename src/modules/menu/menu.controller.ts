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
    const menu = await createMenuItem(req.body);

    res.json({
      success: true,
      message: "Menu item created",
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}

export async function myMenu(req: Request, res: Response, next: NextFunction) {
  try {
    const menu = await getMyMenu();

    res.json({
      success: true,
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}

export async function toggle(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await toggleMenuItem(req.params.id);

    res.json({
      success: true,
      message: "Menu availability updated",
      data: item,
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const updatedItem = await updateMenuItem(req.params.id, req.body);

    res.json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedItem,
    });
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
      categoryId: req.query.categoryId as string,
      foodType: req.query.foodType as "VEG" | "NON_VEG",
    });

    res.json({
      success: true,
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}


export async function uploadMenuImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) {
      throw new Error("Image file is required");
    }

    const imageUrl = await uploadImageToGCP(
      req.file,
      "menu",
    );

    res.json({
      success: true,
      imageUrl,
    });
  } catch (err) {
    next(err);
  }
}
