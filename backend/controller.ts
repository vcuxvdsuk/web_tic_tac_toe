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
            let playerX = req.body.playerX || "Player X";
            let playerO = req.body.playerO || "Player O";
            const newGrid = await serviceImpl.createGrid(
                cells,
                playerX,
                playerO
            );
            res.status(201).json(newGrid);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error, create" });
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
            res.status(500).json({ error: "Internal server error, get by id" });
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
        // req.body: { position: number, sign: "X" | "O" }
        // position is 0-8 representing the cell in the 3x3 grid

        try {
            const { id } = req.params;
            const { position, sign, playerId } = req.body as {
                position: number;
                sign: "X" | "O";
                playerId: string;
            };
            const grid = await serviceImpl.getGridById(id);
            if (!grid) {
                return res.status(404).json({ error: "Grid not found" });
            }
            if (isValidPosition(position) === false) {
                return res.status(400).json({ error: "Invalid position" });
            }
            if (isValidSign(sign) === false) {
                return res.status(400).json({ error: "Invalid sign" });
            }
            if (grid.turn !== sign) {
                // check if its the correct sign's turn
                return res.status(400).json({ error: "Not your turn" });
            }
            if (grid.players[sign] !== playerId) {
                // check if the player is the correct player
                return res
                    .status(400)
                    .json({ error: "Invalid player, not your turn" });
            }

            const cells = grid.cells;
            const row = Math.floor(position / 3);
            const col = position % 3;
            if (cells[row][col] !== "") {
                return res.status(400).json({ error: "Cell already occupied" });
            }
            cells[row][col] = sign;
            grid.turn = sign === "X" ? "O" : "X";
            const updatedGrid = await serviceImpl.updateGrid(id, {
                cells,
                turn: grid.turn,
            });
            res.status(200).json(updatedGrid);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error, update" });
        }
    },

    async delete(req: Request, res: Response) {
        try {
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

///////////////////////////////////
//controller util
function isValidSign(sign: string): boolean {
    return sign === "X" || sign === "O";
}

function isValidPosition(position: number): boolean {
    return position >= 0 && position <= 8;
}
