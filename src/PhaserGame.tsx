import { useEffect } from "react";
import StartGame from "./game/main";

export const PhaserGame = function PhaserGame() {
    useEffect(() => {
        StartGame("game-container");
    }, []);
    return <div id="game-container"></div>;
};
