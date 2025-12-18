import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../socket";
import type { FullGridDto } from "./grid";

interface NewGameButtonProps {
    onCreated: (grid: FullGridDto) => void;
}

export default function NewGameButton({ onCreated }: NewGameButtonProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handler = (grid: FullGridDto) => {
            setLoading(false);
            onCreated(grid);
        };

        socket.on("gameJoined", handler);

        return () => {
            socket.off("gameJoined", handler);
        };
    }, [onCreated]);

    function handleNewGame() {
        let playerId = localStorage.getItem("playerId");
        if (!playerId) {
            playerId = uuid();
            localStorage.setItem("playerId", playerId);
        }

        setLoading(true);
        socket.emit("createGame", playerId);
    }

    useEffect(() => {
        socket.on("created", (grid) => {
            onCreated(grid);
            setLoading(false);
        });

        return () => {
            socket.off("created");
        };
    }, []);

    return (
        <button disabled={loading} onClick={handleNewGame}>
            {loading ? "Creating..." : "New Game"}
        </button>
    );
}
