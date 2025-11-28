import { gridRepository } from "./crud.ts";
import type { Grid } from "./model.ts";
import type { service } from "./service.ts";

class serviceImplementation implements service {
    async getGridById(id: string): Promise<Grid | null> {
        return await gridRepository.findById(id);
    }
    async createGrid(
        cells: string[][],
        playerX: string,
        playerO: string
    ): Promise<Grid> {
        return await gridRepository.save(cells, playerX, playerO);
    }

    async getAllGrids(): Promise<Grid[]> {
        return await gridRepository.findAll();
    }

    async updateGrid(id: string, data: Partial<Grid>): Promise<Grid> {
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

export const serviceImpl = new serviceImplementation();
