import { socketHandlers } from "./socketHandlers.ts";

export const socketListeners = (io: any) => {
    io.on("connection", (socket: any) => {
        console.log("Client connected", socket.id);

        socket.on("makeMove", (data: any) =>
            socketHandlers.makeMove(socket, io, data)
        );
        socket.on("joinGame", (playerId: string) =>
            socketHandlers.joinGame(socket, io, playerId)
        );

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
        });
    });
};
