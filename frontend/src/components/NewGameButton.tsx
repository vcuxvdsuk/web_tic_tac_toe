import axios from "axios";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../socket";

import type { FullGridDto } from "./grid";

interface NewGameButtonProps {
    onCreated: (grid: FullGridDto) => void;
}

export default function NewGameButton({ onCreated }: NewGameButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleNewGame() {
        let playerId = localStorage.getItem("playerId");
        if (!playerId) {
            playerId = uuid();
            localStorage.setItem("playerId", playerId);
        }

        try {
            setLoading(true);

            // REST create game
            const response = await axios.post("/api/grid", {
                playerX: playerId,
            });
            console.log("New grid created", response.data);

            const gridId = response.data.id;
            const data = response.data;
            const initialGrid: FullGridDto = {
                id: data.id,
                cells: data.cells || [
                    ["", "", ""],
                    ["", "", ""],
                    ["", "", ""],
                ],
                players: data.players || { X: playerId, O: null },
                turn: data.turn || "X",
                status: data.status || "ACTIVE",
            };
            onCreated(initialGrid);
            // SOCKET broadcast
            socket.emit("newGameCreated", { gridId });
        } catch (err) {
            console.error(err);
            alert("Could not create game");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button disabled={loading} onClick={handleNewGame}>
            {loading ? "Creating..." : "New Game"}
        </button>
    );
}
