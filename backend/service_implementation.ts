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
    async createGrid(
        cells: string[][],
        playerX: string,
        playerO: string
    ): Promise<Grid> {
        if (
            !isValidCells(cells) ||
            !isValidString(playerX) ||
            !isValidString(playerO)
        ) {
            throw new Error("Invalid input data");
        }
        return await gridRepository.save(cells, playerX, playerO);
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

function isValidPosition(position: number): boolean {
    return position >= 0 && position <= 8;
}

function isValidSign(sign: string): boolean {
    return sign === "X" || sign === "O";
}

export const serviceImpl = new serviceImplementation();
