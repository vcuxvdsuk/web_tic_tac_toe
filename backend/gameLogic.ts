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

export function applyMove(grid: any, move: MovePayload) {
    const { position, sign, playerId } = move;

    if (!grid) {
        throw new Error("Grid not found");
    }

    if (!isValidPosition(position)) {
        throw new Error("Invalid position");
    }

    if (!isValidSign(sign)) {
        throw new Error("Invalid sign");
    }

    if (grid.turn !== sign) {
        throw new Error("Not your turn");
    }

    if (grid.players[sign] !== playerId) {
        throw new Error("Invalid player, not your turn");
    }

    const cells = grid.cells;
    const row = Math.floor(position / 3);
    const col = position % 3;

    if (!cells[row] || cells[row][col] === undefined) {
        throw new Error("Invalid grid cell");
    }

    if (cells[row][col] !== "") {
        throw new Error("Cell already occupied");
    }

    // Apply move
    cells[row][col] = sign;

    // Determine next turn
    const nextTurn = sign === "X" ? "O" : "X";

    return {
        updatedCells: cells,
        nextTurn,
    };
}
