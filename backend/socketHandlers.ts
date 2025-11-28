import { serviceImpl } from "./service_implementation";

export const socketHandlers = {
    async makeMove(socket: any, io: any, data: any) {
        // { gridId: string, position: number, sign: "X" | "O", playerId: string }
        try {
            const newGrid = await serviceImpl.updateGrid(data.gridId, {
                cells: data.position,
                turn: data.sign,
            });
            // Broadcast the move to all other connected clients
            io.emit("moveMade", newGrid);
        } catch (error) {
            socket.emit("error", "Error updating grid");
            console.error("Error updating grid:", error);
        }
    },
};
