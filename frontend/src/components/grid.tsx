import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../socket";

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
}

export default function Grid({ initialGrid }: GridProps) {
    const [grid, setGrid] = useState<FullGridDto>(initialGrid);
    const [turn, setTurn] = useState<"X" | "O">(initialGrid.turn);
    const [gameOver, setGameOver] = useState(initialGrid.status === "OVER");

    async function handleClick(row: number, col: number) {
        if (gameOver) return;

        const playerId = localStorage.getItem("playerId");
        if (!playerId) return;

        if (!grid) return;
        if (turn === "O" && grid.players.O === null) return;
        if (turn === "X" && grid.players.X === null) return;

        socket.emit("makeMove", {
            gridId: grid.id,
            position: row * 3 + col,
            sign: turn,
            playerId,
        });
    }

    useEffect(() => {
        if (!localStorage.getItem("playerId")) {
            localStorage.setItem("playerId", uuid());
        }
    }, []);

    useEffect(() => {
        socket.on("updateGrid", (newGrid) => {
            setGrid(newGrid);
            setTurn(newGrid.turn);
            setGameOver(newGrid.status === "OVER");
        });

        socket.on("gameOver", (message: string) => {
            alert(message);
            setGameOver(true);
        });

        return () => {
            socket.off("updateGrid");
            socket.off("gameOver");
        };
    }, []);

    return (
        <div className="grid">
            {grid?.cells.map((row, rowIndex) =>
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
    );
}
