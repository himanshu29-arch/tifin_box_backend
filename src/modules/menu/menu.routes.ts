/** @format */

import { Router } from "express";
import {
  create,
  myMenu,
  toggle,
  update,
  publicMenu,
  uploadMenuImage,
} from "./menu.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createMenuSchema, updateMenuSchema } from "./menu.schema";
import { upload } from "../../middleware/upload.middleware";

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
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *               - foodType
 *             properties:
 *               name:
 *                 type: string
 *                 example: Paneer Thali
 *               description:
 *                 type: string
 *                 example: North Indian thali with paneer curry
 *               price:
 *                 type: number
 *                 example: 180
 *               categoryId:
 *                 type: string
 *                 example: c3b1d0a4-xxxx
 *               foodType:
 *                 type: string
 *                 enum: [VEG, NON_VEG]
 *               tiffinSize:
 *                 type: string
 *                 enum: [HALF, FULL]
 *               nutrition:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [key, value]
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: Calories
 *                     value:
 *                       type: string
 *                       example: "350"
 *                     unit:
 *                       type: string
 *                       example: kcal
 *               imageUrl:
 *                 type: string
 *                 example: https://storage.googleapis.com/bucket/menu/img.png
 *     responses:
 *       200:
 *         description: Menu item created successfully
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
 *         description: List of menu items created by the chef
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
 *               categoryId:
 *                 type: string
 *               foodType:
 *                 type: string
 *                 enum: [VEG, NON_VEG]
 *               tiffinSize:
 *                 type: string
 *                 enum: [HALF, FULL]
 *               isAvailable:
 *                 type: boolean
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
 *         description: Menu item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu availability updated
 */
router.patch("/:id/toggle", authMiddleware, requireRole("CHEF"), toggle);

/**
 * @swagger
 * /api/menu/upload-image:
 *   post:
 *     summary: Upload menu image (Chef only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 imageUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/menu/xyz.png
 */
router.post(
  "/upload-image",
  authMiddleware,
  requireRole("CHEF"),
  upload.single("image"),
  uploadMenuImage,
);

export default router;
