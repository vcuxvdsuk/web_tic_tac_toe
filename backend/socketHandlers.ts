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
            if (!grid) {
                socket.emit("moveRejected", { reason: "Grid not found" });
                return;
            }

            let result;
            try {
                result = applyMove(grid, { position, sign, playerId });
            } catch (err: any) {
                socket.emit("moveRejected", { reason: err.message });
                return;
            }

            const updatedGrid = await serviceImpl.updateGrid(gridId, {
                cells: result.updatedCells,
                turn: result.gameOver
                    ? (grid.turn as "X" | "O")
                    : (result.nextTurn as "X" | "O"),
                gameOver: result.gameOver,
                winner: result.winner,
            });

            io.to(gridId).emit("updateGrid", updatedGrid);

            if (result.gameOver) {
                io.to(gridId).emit(
                    "gameOver",
                    result.winner ? `Winner: ${result.winner}` : "Draw"
                );
            }
        } catch (err) {
            console.error("Socket makeMove error:", err);
            socket.emit("moveRejected", { reason: "Internal server error" });
        }
    },

    async joinGame(socket: any, io: any, playerId: string) {
        if (socket.data.gridId) {
            socket.leave(socket.data.gridId);
        }

        const grid = await serviceImpl.joinGame(playerId);

        if (!grid) {
            socket.emit("joinFailed", {
                reason: "NO_AVAILABLE_GAME",
            });
            return;
        }

        socket.join(grid.id);
        socket.data.gridId = grid.id;
        socket.emit("gameJoined", grid);
        socket.to(grid.id).emit("playerJoined", grid);
    },

    async newGame(socket: any, io: any, playerId: string) {
        if (socket.data.gridId) {
            socket.leave(socket.data.gridId);
        }

        const grid = await serviceImpl.createGrid(playerId);

        socket.join(grid.id);
        socket.data.gridId = grid.id;

        socket.emit("gameJoined", grid);
    },
};
