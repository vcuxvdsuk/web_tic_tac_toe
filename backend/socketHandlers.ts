import { applyMove } from "./gameLogic.ts";
import { serviceImpl } from "./serviceImplementation.ts";

export const socketHandlers = {
    async makeMove(
        socket: any,
        io: any,
        data: {
            gridId: string;
            position: number;
            sign: "X" | "O";
            playerId: string;
        }
    ) {
        try {
            const { gridId, position, sign, playerId } = data;

            const grid = await serviceImpl.getGridById(gridId);
            if (!grid) return socket.emit("error", "Grid not found");

            try {
                const result = applyMove(grid, { position, sign, playerId });

                const updatedGrid = await serviceImpl.updateGrid(gridId, {
                    cells: result.updatedCells,
                    turn: result.nextTurn as "X" | "O",
                });

                // 🔹 Broadcast updated grid to all clients
                io.emit("updateGrid", updatedGrid);
            } catch (moveErr: any) {
                socket.emit("error", moveErr.message);
            }
        } catch (err) {
            console.error("Socket move error:", err);
            socket.emit("error", "Unexpected server error");
        }
    },

    async joinGame(socket: any, io: any, playerId: string) {
        try {
            const grid = await serviceImpl.joinGame(playerId);
            socket.emit("joined", grid); // send full grid to joining player
            io.emit("updateGrid", grid); // broadcast updated state to all clients
        } catch (err) {
            console.error("Socket join error:", err);
            socket.emit("error", "Unexpected server error on join");
        }
    },
};
