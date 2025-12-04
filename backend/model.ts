export interface Grid {
    id: string;
    cells: string[][];
    turn: "X" | "O";
    players: Record<string, string>; // player IDs
    gameOver: boolean;
    winner: string | null;
}
