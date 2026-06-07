import { preferences } from "@/utils";
import { BaseScene } from "./BaseScene";
import BlindCard from "../ui/BlindCard";
import { BlindsType } from "@/types";

export class Game extends BaseScene {
    constructor() {
        super("Game");
    }

    preload() {}

    async create() {
        const { width, height } = this.cameras.main;
        const gameData = await preferences.getItem("gameData");

        const smallBlindCard = new BlindCard({
            scene: this,
            blindsType: BlindsType.SmallBlind,
            active: gameData.round % 3 === 1,
        });
        const bigBlindCard = new BlindCard({
            scene: this,
            blindsType: BlindsType.BigBlind,
            active: gameData.round % 3 === 2,
        });
        const bossBlindCard = new BlindCard({
            scene: this,
            blindsType: BlindsType.BossBlind,
            active: gameData.round % 3 === 0,
        });
        smallBlindCard.addToScene();
        bigBlindCard.addToScene();
        bossBlindCard.addToScene();
    }
}
