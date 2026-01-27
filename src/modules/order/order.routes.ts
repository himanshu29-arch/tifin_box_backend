/** @format */
import { Router } from "express";
import {
  placeOrder,
  myOrders,
  listOrders,
  updateStatus,
} from "./order.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateOrderStatusSchema } from "./order.schema";

const router = Router();

/* ---------- CUSTOMER ---------- */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place order from cart (Customer)
 *     description: >
 *       Places an order using the current cart.
 *       One cart → one order → single kitchen.
 *       Cart will be cleared after successful order placement.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order placed successfully
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
 *       400:
 *         description: Cart is empty
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, requireRole("CUSTOMER"), placeOrder);

/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: View my orders (Customer)
 *     description: >
 *       Returns all orders placed by the logged-in customer.
 *       Orders are sorted by latest first.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customer orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, requireRole("CUSTOMER"), myOrders);

/* ---------- ADMIN ---------- */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: View all orders (Admin)
 *     description: >
 *       Returns all orders in the system.
 *       Used by admin dashboard to manage orders.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get("/", authMiddleware, requireRole("ADMIN"), listOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin)
 *     description: >
 *       Updates the lifecycle status of an order.
 *       Allowed transitions:
 *       PLACED → ACCEPTED → PREPARED → OUT_FOR_DELIVERY → DELIVERED
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - ACCEPTED
 *                   - PREPARED
 *                   - OUT_FOR_DELIVERY
 *                   - DELIVERED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Order not found
 */
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("ADMIN"),
  validate(updateOrderStatusSchema),
  updateStatus,
);

export default router;
