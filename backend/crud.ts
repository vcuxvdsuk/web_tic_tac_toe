import dotenv from "dotenv";
dotenv.config();

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { toAppGrid } from "./mapper.ts";
import type { Grid } from "./model.ts";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export const gridRepository = {
    async findById(id: string): Promise<Grid | null> {
        const grid = await prisma.grid.findUnique({
            where: { id },
        });
        if (!grid) return null;

        return toAppGrid(grid);
    },

    async create(playerX: string): Promise<Grid> {
        const cells = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];

        const dbGrid = await prisma.grid.create({
            data: {
                cells: cells as unknown as Prisma.JsonObject,
                turn: "X",
                players: {
                    X: playerX,
                    O: null, // explicitly free slot
                } as Prisma.JsonObject,
                gameOver: false,
                winner: null,
            },
        });

        return toAppGrid(dbGrid);
    },

    async findFreeGrid(): Promise<Grid | null> {
        const grids = await prisma.grid.findMany({
            where: { gameOver: false },
            take: 10,
        });

        // Find first grid where O is free in JS
        const freeGrid = grids.find(
            (g) => g.players && (g.players as any)["O"] === null
        );

        if (!freeGrid) return null;

        return toAppGrid(freeGrid);
    },

    async findAll(): Promise<Grid[]> {
        const grids = await prisma.grid.findMany();
        return grids.map((grid) => toAppGrid(grid));
    },

    async update(id: string, data: Partial<Grid>): Promise<Grid> {
        const updateData: Prisma.GridUpdateInput = {};

        if (data.cells !== undefined) {
            updateData.cells = data.cells as unknown as Prisma.InputJsonValue;
        }

        if (data.players !== undefined) {
            updateData.players =
                data.players as unknown as Prisma.InputJsonValue;
        }

        if (data.winner !== undefined) {
            updateData.winner = data.winner;
        }

        if (data.turn !== undefined) {
            updateData.turn = data.turn;
        }

        if (data.gameOver !== undefined) {
            updateData.gameOver = data.gameOver;
        }

        const updatedGrid = await prisma.grid.update({
            where: { id },
            data: updateData,
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
