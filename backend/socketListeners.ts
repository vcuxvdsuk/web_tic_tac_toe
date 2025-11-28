import { socketHandlers } from "./socketHandlers";

export const socketListeners = (io: any, socket: any) => {
    io.on("connection", (socket: any) => {
        socket.on("makeMove", (data: any) =>
            socketHandlers.makeMove(socket, io, data)
        );

        socket.on("disconnect", () => {
            console.log("player disconnected", socket.id);
        });
    });
};
