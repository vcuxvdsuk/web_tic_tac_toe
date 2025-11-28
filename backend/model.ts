export interface Grid {
    id: string;
    cells: string[][];
    turn: "X" | "O";
    players: { X: string; O: string }; // player IDs
    gameOver: boolean;
    winner: string | null;
}
