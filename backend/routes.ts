import express from "express";
import { controller } from "./controller.ts";

export const router = express.Router();
/**
 * @swagger
 * /grid:
 *   get:
 *     summary: Create a new Tic Tac Toe grid
 *     responses:
 *       201:
 *         description: Grid created successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", controller.create);

/**
 * @swagger
 * /grid/{id}:
 *   get:
 *     summary: Get a grid by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Grid ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grid found
 *       404:
 *         description: Grid not found
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /grid/{id}:
 *   patch:
 *     summary: Update a cell in a Tic Tac Toe grid
 *     description: Updates a specific cell in the Tic Tac Toe grid with the given player's sign.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The grid's unique identifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: integer
 *                 example: 4
 *               sign:
 *                 type: string
 *                 enum: [X, O]
 *                 example: X
 *     responses:
 *       200:
 *         description: Grid updated successfully.
 *       400:
 *         description: Invalid position or cell already occupied.
 *       404:
 *         description: Grid not found.
 *       500:
 *         description: Internal server error.
 */
router.patch("/:id", controller.update);
