import { GameObjects } from "phaser";

import { BalatroSplash } from "../shaders/BalatroSplash";
import { calcPx, calcScale } from "../Constants";
import { ClickMode, PlayingCard } from "../data/PlayingCard";
import { CardValue, Suit } from "../data/types/card";
import { BaseScene } from "./BaseScene";

export class MainMenu extends BaseScene {
    background: GameObjects.Image;
    logo: GameObjects.Image;

    logoTween: Phaser.Tweens.Tween | null;
    bgShader: BalatroSplash;

    constructor() {
        super("MainMenu");
    }

    create(data?: { skipFlashIn?: boolean }) {
        const { width, height } = this.cameras.main;

        this.bgShader = new BalatroSplash(
            this,
            width / 2,
            height / 2,
            width,
            height,
            {
                colour1: [254 / 255, 95 / 255, 85 / 255, 1.0],
                colour2: [0, 157 / 255, 255 / 255, 1.0],
                vortSpeed: 0.4,
                midFlash: 0.0,
                vortOffset: 0.0,
                time: 12,
            },
        );
        this.add.existing(this.bgShader);

        // 闪光进场：从 Splash 场景自动跳转过来时做闪光入场，点击跳转则跳过
        if (!data?.skipFlashIn) {
            this.bgShader.flashIn(2 * 1000);
        }

        this.logo = this.add.image(width / 2, calcPx(width, 460), "balatro");

        this.logo.setScale(calcScale(width, this.logo.height, 863));
        const A = new PlayingCard(Suit.Spades, CardValue.Ace);
        A.addToScene(this, width / 2, calcPx(width, 460), ClickMode.flip);

        if (A.container) {
            A.setScale(calcScale(width, A.container?.width, 240));
        }
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }
}
