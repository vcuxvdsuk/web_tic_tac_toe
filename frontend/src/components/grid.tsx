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

    function handleClick(row: number, col: number) {
        if (gameOver) return;
        if (grid[row][col] !== "") return; // Cell already occupied

        const newGrid = grid.map((r, rowIndex) =>
            r.map((cell, colIndex) =>
                rowIndex === row && colIndex === col ? turn : cell
            )
        );
        setGrid(newGrid);
        setTurn(turn === "X" ? "O" : "X");

        // Update the grid on the server via REST API
        axios
            .patch(`/api/grid/${gridId}`, {
                position: row * 3 + col,
                sign: turn,
            })
            .then((response) => {
                console.log("Grid updated:", response.data);
                socket.emit("makeMove", {
                    gridId: gridId,
                    position: row * 3 + col,
                    sign: turn,
                    playerId: "player1", // Example player ID
                });
            })
            .catch((error) => {
                console.error("Error updating grid:", error);
            });

        checkWin(newGrid);
    }

    function checkWin(cells: string[][]) {
        const lines = [
            // Rows
            [cells[0][0], cells[0][1], cells[0][2]],
            [cells[1][0], cells[1][1], cells[1][2]],
            [cells[2][0], cells[2][1], cells[2][2]],
            // Columns
            [cells[0][0], cells[1][0], cells[2][0]],
            [cells[0][1], cells[1][1], cells[2][1]],
            [cells[0][2], cells[1][2], cells[2][2]],
            // Diagonals
            [cells[0][0], cells[1][1], cells[2][2]],
            [cells[0][2], cells[1][1], cells[2][0]],
        ];

        for (const line of lines) {
            if (line[0] !== "" && line[0] === line[1] && line[1] === line[2]) {
                alert(`Player ${line[0]} wins!`);
                setGameOver(true);
                return;
            }
        }

        // Check for draw
        if (cells.flat().every((cell) => cell !== "")) {
            alert("It's a draw!");
            setGameOver(true);
        }
    }

    function newGame() {
        console.log("New game");
        setGameOver(false);
        setGrid([
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ]);
        setTurn("X");
        axios.post("/api/grid").then((response) => {
            setGridId(String(response.data.id));
            console.log("New game started:", response.data);
        });
        if (!gridId) {
            console.error("No gridId");
        }
    }

    useEffect(() => {
        socket.on("moveMade", (newGrid) => {
            setGrid(newGrid.cells);
            setTurn(newGrid.turn);
            checkWin(newGrid.cells);
        });

        socket.on("gameOver", (message: string) => {
            alert(message);
            setGameOver(true);
        });

        if (!localStorage.getItem("playerId")) {
            localStorage.setItem("playerId", uuid());
        }

        return () => {
            socket.off("moveMade");
            socket.off("gameOver");
        };
    }, []);

    const [initialized, setInitialized] = useState(false);
    if (!initialized) {
        setInitialized(true); // this run once
        newGame();
    }

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
