import { Boot } from "@/game/scenes/Boot";
import { GameOver } from "@/game/scenes/GameOver";
import { Game as MainGame } from "@/game/scenes/Game";
import { MainMenu } from "@/game/scenes/MainMenu";
import { AUTO, Game, Scale } from "phaser";
import { Preloader } from "@/game/scenes/Preloader";
import { Splash } from "@/game/scenes/Splash";
import { AudioManager } from "@/game/manager/AudioManager";
import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: 10 });
const config: Phaser.Types.Core.GameConfig = {
    parent: "game-container",
    type: AUTO,
    scene: [Boot, Preloader, Splash, MainMenu, MainGame, GameOver],
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
    },
    input: {
        windowEvents: false,
    },
};

const game = new Game(config);
AudioManager.getInstance().init(game.sound);
