import { PrismaClient } from "@prisma/client";
import type { Grid } from "./model.ts";

const prisma = new PrismaClient();

export const gridRepository = {
    async findById(id: string): Promise<Grid | null> {
        const grid = await prisma.grid.findUnique({
            where: { id },
        });
        if (!grid) return null;

        //convert Json to string[][] for app model from prisma model
        return {
            id: grid.id,
            cells: grid.cells as string[][],
        };
    },

    async save(cells: string[][]): Promise<Grid> {
        const dbGrid = await prisma.grid.create({
            data: { cells },
        });

        // Convert back
        return {
            id: dbGrid.id,
            cells: dbGrid.cells as string[][],
        };
    },

    async findAll(): Promise<Grid[]> {
        const grids = await prisma.grid.findMany();
        return grids.map((grid) => ({
            id: grid.id,
            cells: grid.cells as string[][],
        }));
    },

    async update(id: string, data: Partial<Grid>): Promise<Grid> {
        const updatedGrid = await prisma.grid.update({
            where: { id },
            data: { cells: data.cells },
        });
        return updatedGrid as Grid;
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
