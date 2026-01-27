/** @format */
import { Router } from "express";
import { create, myMenu, toggle, update, publicMenu } from "./menu.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createMenuSchema, updateMenuSchema } from "./menu.schema";
const router = Router();

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: View menu (Customer)
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of available menu items
 */
router.get("/", publicMenu);

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create menu item (Chef only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, tiffinSize]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tiffinSize:
 *                 type: string
 *                 enum: [HALF, FULL]
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu item created
 */
router.post(
  "/",
  authMiddleware,
  requireRole("CHEF"),
  validate(createMenuSchema),
  create,
);

/**
 * @swagger
 * /api/menu/me:
 *   get:
 *     summary: Get my menu items (Chef only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of menu items
 */
router.get("/me", authMiddleware, requireRole("CHEF"), myMenu);

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update menu item (Chef only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Menu item ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tiffinSize:
 *                 type: string
 *                 enum: [HALF, FULL]
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 */
router.put(
  "/:id",
  authMiddleware,
  requireRole("CHEF"),
  validate(updateMenuSchema),
  update,
);

/**
 * @swagger
 * /api/menu/{id}/toggle:
 *   patch:
 *     summary: Enable / disable menu item (Chef only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu availability updated
 */
router.patch("/:id/toggle", authMiddleware, requireRole("CHEF"), toggle);

export default router;
