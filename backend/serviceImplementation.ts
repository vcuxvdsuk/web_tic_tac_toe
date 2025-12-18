import { gridRepository } from "./crud.ts";
import type { Grid } from "./model.ts";
import type { service } from "./service.ts";

class serviceImplementation implements service {
    async getGridById(id: string): Promise<Grid | null> {
        if (!isValidString(id)) {
            throw new Error("Invalid grid ID");
        }
        return await gridRepository.findById(id);
    }
    async createGrid(playerX: string): Promise<Grid> {
        if (!isValidString(playerX)) {
            throw new Error("Invalid input data");
        }
        return await gridRepository.create(playerX);
    }

    async joinGame(playerId: string): Promise<Grid> {
        const grid = await gridRepository.findFreeGrid();
        //check if a free grid is found
        if (!grid) {
            return null as unknown as Grid;
        }
        //make sure its free to join
        if (grid.players.X && grid.players.O) {
            return null as unknown as Grid;
        }
        // prevent joining same player twice
        if (grid.players.X === playerId || grid.players.O === playerId) {
            return null as unknown as Grid;
        }

        // mutate local object
        if (!grid.players.X) {
            grid.players.X = playerId;
        } else if (!grid.players.O) {
            grid.players.O = playerId;
        }
        const updatedGrid = await gridRepository.update(grid.id, {
            players: grid.players,
        });

        return updatedGrid;
    }

    async getAllGrids(): Promise<Grid[]> {
        return await gridRepository.findAll();
    }

    async updateGrid(id: string, data: Partial<Grid>): Promise<Grid> {
        if (!isValidString(id)) {
            throw new Error("Invalid grid ID");
        }
        if (data.cells && !isValidCells(data.cells)) {
            throw new Error("Invalid cells data");
        }
        if (data.turn && !isValidSign(data.turn)) {
            throw new Error("Invalid turn sign");
        }

        return await gridRepository.update(id, data);
    }

    async deleteGrid(id: string): Promise<void> {
        return await gridRepository.delete(id);
    }

    async deleteAllGrids(): Promise<void> {
        const grids = await gridRepository.findAll();
        for (const grid of grids) {
            await gridRepository.delete(grid.id);
        }
    }
}

function isValidString(name: string): boolean {
    return !!name && name.trim() !== "";
}

function isValidCells(cells: string[][]): boolean {
    return cells.length === 3 && cells.every((row) => row.length === 3);
}

function isValidSign(sign: string): boolean {
    return sign === "X" || sign === "O";
}

export const serviceImpl = new serviceImplementation();
