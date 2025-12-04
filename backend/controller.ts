import type { Request, Response } from "express";
import { applyMove } from "./gameLogic.ts";
import { serviceImpl } from "./serviceImplementation.ts";

export const controller = {
    async init(req: Request, res: Response) {
        console.log("init");
        res.send(this.create(req, res));
    },
    async create(req: Request, res: Response) {
        try {
            let playerX = req.body.playerX || "Player X";
            const newGrid = await serviceImpl.createGrid(playerX);
            res.status(201).json(newGrid);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error, create" });
        }
    },
    async getById(req: Request, res: Response) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: "Grid ID is required" });
            }
            const { id } = req.params;

            const grid = await serviceImpl.getGridById(id);
            if (grid) {
                res.status(200).json(grid);
            } else {
                res.status(404).json({ error: "Grid not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error, get by id" });
        }
    },

    async join(req: Request, res: Response) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: "Grid ID is required" });
            }
            const { id } = req.params;
            const { playerId } = req.body;

            if (!playerId) {
                return res.status(400).json({ error: "Player ID is required" });
            }

            const updatedGrid = await serviceImpl.joinGame(playerId);
            res.status(200).json(updatedGrid);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error, join" });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const grids = await serviceImpl.getAllGrids();
            res.status(200).json(grids);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error, get all" });
        }
    },

    async update(req: Request, res: Response) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: "Grid ID is required" });
            }

            const { id } = req.params;
            const { position, sign, playerId } = req.body;

            const grid = await serviceImpl.getGridById(id);

            try {
                const result = applyMove(grid, { position, sign, playerId });

                const updatedGrid = await serviceImpl.updateGrid(id, {
                    cells: result.updatedCells,
                    turn: result.nextTurn as "X" | "O",
                });

                return res.status(200).json(updatedGrid);
            } catch (moveErr: any) {
                return res.status(400).json({ error: moveErr.message });
            }
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ error: "Internal server error, update" });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: "Grid ID is required" });
            }
            const { id } = req.params;
            await serviceImpl.deleteGrid(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error, delete" });
        }
    },

    async deleteAll(req: Request, res: Response) {
        try {
            await serviceImpl.deleteAllGrids();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal server error, delete all",
            });
        }
    },
};
