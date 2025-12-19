import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../socket";
import Status from "./Status";

interface GridProps {
    initialGrid: FullGridDto;
}

interface PlayerMap {
    X: string | null;
    O: string | null;
}

export interface FullGridDto {
    id: string;
    cells: string[][];
    players: PlayerMap;
    turn: "X" | "O";
    status: string;
    winner: "X" | "O" | null;
    gameOver: boolean;
}

export default function Grid({ initialGrid }: GridProps) {
    const [grid, setGrid] = useState<FullGridDto>(initialGrid);

    function handleClick(row: number, col: number) {
        if (grid.gameOver) return;

        const playerId = localStorage.getItem("playerId");
        if (!playerId) return;

        // Enforce player ownership
        if (grid.turn === "X" && grid.players.X !== playerId) return;
        if (grid.turn === "O" && grid.players.O !== playerId) return;

        socket.emit("makeMove", {
            gridId: grid.id,
            position: row * 3 + col,
            sign: grid.turn,
            playerId,
        });
    }

    useEffect(() => {
        if (!localStorage.getItem("playerId")) {
            localStorage.setItem("playerId", uuid());
        }

        socket.on("updateGrid", (newGrid) => {
            setGrid(newGrid);
        });

        socket.on("gameOver", (message: string) => {
            alert(message);
        });

        return () => {
            socket.off("updateGrid");
            socket.off("gameOver");
        };
    }, []);

    useEffect(() => {
        socket.on("moveRejected", ({ reason }) => {
            console.warn("Move rejected:", reason);
        });

        return () => {
            socket.off("moveRejected");
        };
    }, []);

    return (
        <div className="game-container">
            <Status
                turn={grid.turn}
                players={grid.players}
                gameOver={grid.gameOver}
                winner={grid.winner}
            />

            <div className="grid">
                {grid.cells.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${
                                cell === "X" ? "x" : cell === "O" ? "o" : ""
                            }`}
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
