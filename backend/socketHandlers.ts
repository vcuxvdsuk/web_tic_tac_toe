import { applyMove } from "./gameLogic.ts";
import { serviceImpl } from "./serviceImplementation.ts";

export const socketHandlers = {
    async makeMove(socket: any, io: any, data: any) {
        try {
            const { gridId, position, sign, playerId } = data;

            const grid = await serviceImpl.getGridById(gridId);
            if (!grid) {
                return socket.emit("error", "Grid not found");
            }

            try {
                const result = applyMove(grid, { position, sign, playerId });

                const updatedGrid = await serviceImpl.updateGrid(gridId, {
                    cells: result.updatedCells,
                    turn: result.nextTurn as "X" | "O",
                });

                // Broadcast new updated state
                io.emit("moveMade", updatedGrid);
            } catch (moveErr: any) {
                socket.emit("error", moveErr.message);
            }
        } catch (err) {
            console.error("Socket move error:", err);
            socket.emit("error", "Unexpected server error");
        }
    },
};
