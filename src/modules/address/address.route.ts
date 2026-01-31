/** @format */

import { Router } from "express";
import { create, list, update, remove } from "./address.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createAddressSchema, updateAddressSchema } from "./address.schema";

const router = Router();

/**
 * All address routes require authentication
 */
router.use(authMiddleware);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add a new address (Customer)
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverName
 *               - contactNumber
 *               - houseNumber
 *               - sector
 *               - postcode
 *             properties:
 *               receiverName:
 *                 type: string
 *                 example: Pallishree Behera
 *               contactNumber:
 *                 type: string
 *                 example: "9876543210"
 *               houseNumber:
 *                 type: string
 *                 example: "A-203"
 *               sector:
 *                 type: string
 *                 example: Sector 21
 *               landmark:
 *                 type: string
 *                 example: Near City Mall
 *               postcode:
 *                 type: string
 *                 example: "751024"
 *               mapUrl:
 *                 type: string
 *                 example: https://maps.google.com/?q=...
 *     responses:
 *       200:
 *         description: Address added successfully
 */
router.post("/", validate(createAddressSchema), create);

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get my saved addresses (Customer)
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 */
router.get("/", list);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address (Customer)
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverName:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               houseNumber:
 *                 type: string
 *               sector:
 *                 type: string
 *               landmark:
 *                 type: string
 *               postcode:
 *                 type: string
 *               mapUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.put("/:id", validate(updateAddressSchema), update);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address (Customer)
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.delete("/:id", remove);

export default router;
