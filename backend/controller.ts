import type { Request, Response } from "express";
import { serviceImpl } from "./service_implementation";
// import { getUserData, saveUserData } from '../services/userService';

export const controller = {
    async init(req: Request, res: Response) {
        console.log("init");
        res.send(this.create(req, res));
    },
    async create(req: Request, res: Response) {
        try {
            const cells = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
            ];
            const newGrid = await serviceImpl.createGrid(cells);
            res.status(201).json(newGrid);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const grid = await serviceImpl.getGridById(id);
            if (grid) {
                res.status(200).json(grid);
            } else {
                res.status(404).json({ error: "Grid not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const grids = await serviceImpl.getAllGrids();
            res.status(200).json(grids);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async update(req: Request, res: Response) {
        // req.body: { position: number, sign: "X" | "O" }
        // position is 0-8 representing the cell in the 3x3 grid
        try {
            const { id } = req.params;
            const { position, sign } = req.body;
            const grid = await serviceImpl.getGridById(id);
            if (!grid) {
                return res.status(404).json({ error: "Grid not found" });
            }
            if (position < 0 || position > 8) {
                return res.status(400).json({ error: "Invalid position" });
            }
            if (sign !== "X" && sign !== "O") {
                return res.status(400).json({ error: "Invalid sign" });
            }
            const cells = grid.cells;
            const row = Math.floor(position / 3);
            const col = position % 3;
            if (cells[row][col] !== "") {
                return res.status(400).json({ error: "Cell already occupied" });
            }
            cells[row][col] = sign;
            const updatedGrid = await serviceImpl.updateGrid(id, { cells });
            res.status(200).json(updatedGrid);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await serviceImpl.deleteGrid(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    async deleteAll(req: Request, res: Response) {
        try {
            await serviceImpl.deleteAllGrids();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
};
