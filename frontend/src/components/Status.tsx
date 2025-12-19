interface PlayerMap {
    X: string | null;
    O: string | null;
}

interface StatusProps {
    turn: "X" | "O";
    players: PlayerMap;
    gameOver: boolean;
    winner: "X" | "O" | null;
}

export default function Status({
    turn,
    players,
    gameOver,
    winner,
}: StatusProps) {
    const playerId = localStorage.getItem("playerId");

    let text: string;

    if (gameOver) {
        text = winner ? `Winner: ${winner}` : "Draw";
    } else {
        const isYourTurn =
            (turn === "X" && players.X === playerId) ||
            (turn === "O" && players.O === playerId);

        text = isYourTurn ? "Your turn" : `Opponent's turn (${turn})`;
    }

    return <div className="status">{text}</div>;
}
