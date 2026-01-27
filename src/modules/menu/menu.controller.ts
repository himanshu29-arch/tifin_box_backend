/** @format */
import { Request, Response, NextFunction } from "express";
import {
  createMenuItem,
  getMyMenu,
  toggleMenuItem,
  updateMenuItem,
  getPublicMenu,
} from "./menu.service";

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
    const menu = await getPublicMenu();
    res.json({
      success: true,
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}
