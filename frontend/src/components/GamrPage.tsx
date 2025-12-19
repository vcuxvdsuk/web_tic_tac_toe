import { useState } from "react";
import type { FullGridDto } from "./grid";
import Grid from "./grid";
import JoinButton from "./JoinButton";
import NewGameButton from "./newGameButton";

export default function Game() {
    const [grid, setGrid] = useState<FullGridDto | null>(null);

    return (
        <div className="game-container">
            {grid ? (
                <Grid key={grid.id} initialGrid={grid} />
            ) : (
                <p>No active grid yet</p>
            )}
            <JoinButton onJoined={(grid) => setGrid(grid)} />
            <NewGameButton onCreated={(grid) => setGrid(grid)} />
        </div>
    );
}
