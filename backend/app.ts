import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { router } from "./routes.ts";
import { socketListeners } from "./socketListeners.ts";
import { setupSwagger } from "./swagger.ts";

export const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

export const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    },
});

socketListeners(io);

app.use("/api/grid", router);
