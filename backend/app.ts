import cors from "cors";
import express from "express";
import { router } from "./routes.ts";
import { setupSwagger } from "./swagger";

export const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/api/grid", router);

app.get("/", (req, res) => {
    res.send("Welcome to the Tic Tac Toe API");
});
