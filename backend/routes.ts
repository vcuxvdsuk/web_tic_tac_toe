import express from "express";
import { controller } from "./controller.ts";

export const router = express.Router();
/**
 * @swagger
 * /api/grid:
 *   post:
 *     summary: Create a new Tic Tac Toe grid
 *     responses:
 *       201:
 *         description: Grid created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/grid/${gridId}/join:
 *   post:
 *    summary: Join an existing Tic Tac Toe game
 *    parameters:
 *      - name: gridId
 *        in: path
 *        required: true
 *        description: The grid's unique identifier
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              playerId:
 *                type: string
 *    responses:
 *      200:
 *        description: Grid joined successfully
 *      500:
 *        description: Internal server error
 */
router.post("/:id/join", controller.join);

/**
 * @swagger
 * /api/grid/{id}:
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
 * /api/grid/{id}:
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

/**
 * @swagger
 * /api/grid:
 *   get:
 *     summary: Get all grids
 *     responses:
 *       200:
 *         description: Grids found
 *       500:
 *         description: Internal server error
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/grid/{id}:
 *   delete:
 *     summary: Delete a grid by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Grid ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Grid deleted successfully
 *       404:
 *         description: Grid not found
 */
router.delete("/:id", controller.delete);

/**
 * @swagger
 * /api/grid:
 *  delete:
 *     summary: Delete all grids
 *     responses:
 *       200:
 *         description: Grids deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete("/", controller.deleteAll);
