//import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../socket";

import type { FullGridDto } from "./grid";

interface JoinButtonProps {
    onJoined: (grid: FullGridDto) => void;
}

export default function JoinButton({ onJoined }: JoinButtonProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const listener = (grid: FullGridDto) => {
            console.log("Server confirmed joined:", grid);
            onJoined(grid);
        };

        socket.on("joined", listener);

        return () => {
            socket.off("joined", listener);
        };
    }, [onJoined]);

    async function handleJoin() {
        try {
            let playerId = localStorage.getItem("playerId");
            if (!playerId) {
                playerId = uuid();
                localStorage.setItem("playerId", playerId);
            }

            setLoading(true);
            socket.emit("joinGame", playerId);
        } catch (err) {
            console.error(err);
            alert("Join failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button className="btn-join" disabled={loading} onClick={handleJoin}>
            {loading ? "Joining..." : "Join Game"}
        </button>
    );
}
