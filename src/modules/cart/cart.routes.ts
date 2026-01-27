/** @format */

import { Router } from "express";
import { viewCart, addItem, updateItem, removeItem } from "./cart.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { addCartItemSchema, updateCartItemSchema } from "./cart.schema";

const router = Router();

router.use(authMiddleware, requireRole("CUSTOMER"));

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: View cart (Customer)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           price:
 *                             type: number
 *                           menuItem:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               price:
 *                                 type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/", viewCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart (Customer)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [menuItemId, quantity]
 *             properties:
 *               menuItemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Menu item not available
 */
router.post("/items", validate(addCartItemSchema), addItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Update cart item quantity (Customer)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart item ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 */
router.put("/items/:id", validate(updateCartItemSchema), updateItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Remove item from cart (Customer)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
router.delete("/items/:id", removeItem);

export default router;
