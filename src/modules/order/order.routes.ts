/** @format */

import { Router } from "express";
import {
  placeOrder,
  myOrders,
  listOrders,
  updateStatus,
  markPaid,
} from "./order.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  placeOrderSchema,
  updateOrderStatusSchema,
} from "./order.schema";

const router = Router();

/* ---------- CUSTOMER ---------- */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place order from cart (Customer)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [addressId, paymentMode]
 *             properties:
 *               addressId:
 *                 type: string
 *               paymentMode:
 *                 type: string
 *                 enum: [UPI, COD]
 *     responses:
 *       200:
 *         description: Order placed successfully
 */
router.post(
  "/",
  authMiddleware,
  requireRole("CUSTOMER"),
  validate(placeOrderSchema),
  placeOrder,
);

/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: View my orders (Customer)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", authMiddleware, requireRole("CUSTOMER"), myOrders);

/* ---------- ADMIN ---------- */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: View all orders (Admin)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, requireRole("ADMIN"), listOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("ADMIN"),
  validate(updateOrderStatusSchema),
  updateStatus,
);

/**
 * @swagger
 * /api/orders/{id}/paid:
 *   patch:
 *     summary: Mark order as paid (Admin - COD)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id/paid",
  authMiddleware,
  requireRole("ADMIN"),
  markPaid,
);

export default router;
