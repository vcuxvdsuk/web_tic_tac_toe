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
                players: { X: playerX } as Prisma.JsonObject,
                gameOver: false,
                winner: null,
            },
        });

        return toAppGrid(dbGrid);
    },

    async findFreeGrid(): Promise<Grid | null> {
        const grid = await prisma.grid.findMany({
            where: {
                players: {
                    path: ["Y"],
                    equals: Prisma.JsonNull, // Free slot
                },
            },
            take: 1, // return only first
        });

        if (!grid || !grid.length || !grid[0]) return null;
        return toAppGrid(grid[0]);
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
