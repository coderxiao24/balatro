import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game, Scale } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    backgroundColor: "#000",
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
    scale: {
        mode: Scale.RESIZE, // 画布尺寸随容器变化，自适应填满屏幕
        autoCenter: Scale.CENTER_BOTH,
    },
    input: {
        windowEvents: false, // 👈 关键：阻止浏览器默认的触摸滑动（如页面下拉刷新、左右滑动返回）
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
