// gameLogic.ts

export interface MovePayload {
    position: number;
    sign: "X" | "O";
    playerId: string;
}

export function isValidSign(sign: string): boolean {
    return sign === "X" || sign === "O";
}

export function isValidPosition(position: number): boolean {
    return position >= 0 && position <= 8;
}

export function applyMove(
    grid: any,
    move: { position: number; sign: "X" | "O"; playerId: string }
) {
    const { position, sign, playerId } = move;

    if (grid.gameOver) {
        throw new Error("Game is already over");
    }

    if (grid.turn !== sign) {
        throw new Error("Not your turn");
    }

    if (grid.players[sign] !== playerId) {
        throw new Error("Invalid player");
    }

    const row = Math.floor(position / 3);
    const col = position % 3;

    if (grid.cells[row][col] !== "") {
        throw new Error("Cell already taken");
    }

    const updatedCells = grid.cells.map((r: string[]) => [...r]);
    updatedCells[row][col] = sign;

    const winner = checkWinner(updatedCells);
    const draw = !winner && isDraw(updatedCells);

    return {
        updatedCells,
        winner,
        gameOver: Boolean(winner || draw),
        nextTurn: sign === "X" ? "O" : "X",
    };
}

export type Sign = "X" | "O" | "";

const WIN_LINES: readonly [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function checkWinner(cells: Sign[][]): "X" | "O" | null {
    const flat = cells.flat();

    for (const [a, b, c] of WIN_LINES) {
        if (flat[a] && flat[a] === flat[b] && flat[a] === flat[c]) {
            return flat[a] as "X" | "O";
        }
    }
    return null;
}

export function isDraw(cells: Sign[][]): boolean {
    return cells.flat().every((c) => c !== "");
}
