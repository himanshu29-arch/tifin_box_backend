/** @format */
import { Router } from "express";
import { create, list, update } from "./category.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

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
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tiffin
 *               imageUrl:
 *                 type: string
 *                 example: https://cdn.example.com/tiffin.png
 *     responses:
 *       200:
 *         description: Category created successfully
 */
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
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
 *         description: Category ID
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
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  validate(updateCategorySchema),
  update,
);

export default router;
