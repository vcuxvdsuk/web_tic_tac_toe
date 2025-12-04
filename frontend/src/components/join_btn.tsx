import axios from "axios";
import { useState } from "react";
import { v4 as uuid } from "uuid";

interface JoinButtonProps {
    onJoined: (gridId: string) => void; // parent receives ID
}

export default function JoinButton({ onJoined }: JoinButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleJoin() {
        let playerId = localStorage.getItem("playerId");
        if (!playerId) {
            playerId = uuid();
            localStorage.setItem("playerId", playerId);
        }

        try {
            setLoading(true);

            // backend selects a free grid OR creates one internally
            const res = await axios
                .post("/api/grid/join-any", {
                    playerId,
                })
                .then(
                    socket.on("joinGame", async (data) => {
                        const grid = await service.joinGame(data.playerId);

                        // Broadcast to only this player
                        socket.emit("joined", grid);

                        // OR broadcast to all players in same grid room
                        io.to(grid.id).emit("updateGrid", grid);
                    })
                );

            const newGridId = res.data.id;
            onJoined(newGridId); // notify parent

            alert("Joined existing game!");
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
