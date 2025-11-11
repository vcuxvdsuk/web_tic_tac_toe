import { gridRepository } from "./crud.ts";
import type { Grid } from "./model.ts";
import type { service } from "./service.ts";

class serviceImplementation implements service {
    async getGridById(id: string): Promise<Grid | null> {
        return await gridRepository.findById(id);
    }
    async createGrid(cells: string[][]): Promise<Grid> {
        return await gridRepository.save(cells);
    }

    async updateGrid(id: string, data: Partial<Grid>): Promise<Grid> {
        return await gridRepository.update(id, data);
    }

    async deleteGrid(id: string): Promise<void> {
        return await gridRepository.delete(id);
    }
}

export const serviceImpl = new serviceImplementation();
