import { Grid, Prisma } from "@prisma/client";
import type { Grid as AppGrid } from "./model.ts";

export function toAppGrid(dbGrid: Grid): AppGrid {
    return {
        id: dbGrid.id,
        cells: dbGrid.cells as string[][],
        turn: dbGrid.turn as "X" | "O",
        players: dbGrid.players as { X: string; O: string },
        gameOver: dbGrid.gameOver,
        winner: dbGrid.winner,
    };
}

export function toDbGrid(appGrid: AppGrid): Grid {
    return {
        id: appGrid.id,
        cells: appGrid.cells,
        turn: appGrid.turn,
        players: appGrid.players as Prisma.JsonObject,
        gameOver: appGrid.gameOver,
        createdAt: null as any, // Placeholder, will be ignored by Prisma on updates
        winner: appGrid.winner,
    };
}
