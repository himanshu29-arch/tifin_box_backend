/** @format */

import { Router } from "express";
import { create, get, update } from "./kitchen.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createKitchenSchema, updateKitchenSchema } from "./kitchen.schema";

const router = Router();

/**
 * @swagger
 * /api/kitchen:
 *   get:
 *     summary: Get kitchen (Public)
 *     tags: [Kitchen]
 *     responses:
 *       200:
 *         description: Kitchen details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: "TifunBox Central Kitchen"
 *                     description:
 *                       type: string
 *                       example: "Main kitchen for daily tiffin service"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Kitchen not found
 */

router.get("/", get);

/**
 * @swagger
 * /api/kitchen:
 *   post:
 *     summary: Create kitchen (Admin only)
 *     tags: [Kitchen]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "TifunBox Central Kitchen"
 *               description:
 *                 type: string
 *                 example: "Main kitchen for daily tiffin service"
 *     responses:
 *       200:
 *         description: Kitchen created successfully
 *       409:
 *         description: Kitchen already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validate(createKitchenSchema),
  create,
);


/**
 * @swagger
 * /api/kitchen:
 *   put:
 *     summary: Update kitchen (Admin only)
 *     tags: [Kitchen]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Kitchen Name"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Kitchen updated successfully
 *       404:
 *         description: Kitchen not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.put(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validate(updateKitchenSchema),
  update,
);


export default router;
