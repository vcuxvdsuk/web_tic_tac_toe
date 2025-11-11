import type { Grid } from "./model.ts";

export interface service {
    getGridById(id: string): Promise<Grid | null>;
    createGrid(cells: string[][]): Promise<Grid>;
    updateGrid(id: string, data: Partial<Grid>): Promise<Grid>;
    deleteGrid(id: string): Promise<void>;
}
