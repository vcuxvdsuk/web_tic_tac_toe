import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

const socket = io("http://localhost:3000");

export default function Grid() {
    const [grid, setGrid] = useState([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);
    const [turn, setTurn] = useState<"X" | "O">("X");
    const [gameOver, setGameOver] = useState(true);
    const [gridId, setGridId] = useState("");

    async function handleClick(row: number, col: number) {
        if (gameOver) return;

        const playerId = localStorage.getItem("playerId");
        if (!playerId) return;
        if (!gridId) return;

        try {
            const response = await axios.patch(`/api/grid/${gridId}`, {
                position: row * 3 + col,
                sign: turn,
                playerId,
            });

            const newGrid = response.data;
            setGrid(newGrid.cells);
            setTurn(newGrid.turn);
            setGameOver(newGrid.status === "OVER");
        } catch (error) {
            console.error("Server rejected move:", error);
        }
    }

    async function newGame() {
        const playerId = localStorage.getItem("playerId");

        const response = await axios.post("/api/grid", {
            playerX: playerId,
        });

        setGrid(response.data.cells);
        setTurn(response.data.turn);
        setGridId(response.data.id);
        setGameOver(false);
    }

    // When gridId changes, the second player will join
    useEffect(() => {
        if (!gridId) return;

        axios
            .post(`/api/grid/${gridId}/join`, {
                playerId: localStorage.getItem("playerId"),
            })
            .then((res) => {
                console.log("Joined game", res.data);
            })
            .catch((err) => {
                console.error("Join failed", err);
            });
    }, [gridId]);

    useEffect(() => {
        // Assign unique player id once
        if (!localStorage.getItem("playerId")) {
            localStorage.setItem("playerId", uuid());
        }

        const startGame = async () => {
            await newGame();
        };

        startGame(); // now async inside effect

        socket.emit("joinGame");

        socket.on("joined", (grid) => {
            setGrid(grid);
        });

        socket.on("updateGrid", (grid) => {
            setGrid(grid);
        });
        // Socket listeners:
        socket.on("moveMade", (newGrid) => {
            setGrid(newGrid.cells);
            setTurn(newGrid.turn);
            setGameOver(newGrid.status === "OVER");
        });

        socket.on("gameOver", (message: string) => {
            alert(message);
            setGameOver(true);
        });

        return () => {
            socket.off("moveMade");
            socket.off("gameOver");
        };
    }, []);

    return (
        <>
            <div className="grid">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className="cell"
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    ))
                )}
            </div>

            <button className="btn-reset" onClick={newGame}>
                New Game
            </button>
        </>
    );
}
