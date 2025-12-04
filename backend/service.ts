import type { Grid } from "./model.ts";

export interface service {
    getGridById(id: string): Promise<Grid | null>;
    createGrid(playerX: string): Promise<Grid>;
    joinGame(playerId: string): Promise<Grid>;
    getAllGrids(): Promise<Grid[]>;
    updateGrid(id: string, data: Partial<Grid>): Promise<Grid>;
    deleteGrid(id: string): Promise<void>;
    deleteAllGrids(): Promise<void>;
}
