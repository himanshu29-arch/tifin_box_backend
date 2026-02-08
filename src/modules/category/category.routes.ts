/** @format */

import { Router } from "express";
import { create, list, update, remove } from "./category.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema";
import { upload } from "../../middleware/upload.middleware";


const router = Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tiffin
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category created successfully
 */
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  upload.single("image"),
  validate(createCategorySchema),
  create,
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", list);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  upload.single("image"),
  validate(updateCategorySchema),
  update,
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  remove,
);


export default router;
