import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { toAppGrid } from "./mapper.ts";
import type { Grid } from "./model.ts";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool); // Using the pool instance

const prisma = new PrismaClient({ adapter });

export const gridRepository = {
    async findById(id: string): Promise<Grid | null> {
        const grid = await prisma.grid.findUnique({
            where: { id },
        });
        if (!grid) return null;

        //convert Json to string[][] for app model from prisma model
        return toAppGrid(grid);
    },

    async save(
        cells: string[][],
        playerX: string,
        playerO: string
    ): Promise<Grid> {
        const dbGrid = await prisma.grid.create({
            data: {
                cells,
                turn: "X",
                players: { X: playerX, O: playerO } as Prisma.JsonObject,
                gameOver: false,
                winner: null,
            },
        });

        // Convert back
        return toAppGrid(dbGrid);
    },

    async findAll(): Promise<Grid[]> {
        const grids = await prisma.grid.findMany();
        return grids.map((grid) => toAppGrid(grid));
    },

    async update(id: string, data: Partial<Grid>): Promise<Grid> {
        const updatedGrid = await prisma.grid.update({
            where: { id },
            data: { cells: data.cells },
        });
        return toAppGrid(updatedGrid);
    },

    async delete(id: string): Promise<void> {
        await prisma.grid.delete({
            where: { id },
        });
    },

    async deleteAll(): Promise<void> {
        await prisma.grid.deleteMany();
    },
};
