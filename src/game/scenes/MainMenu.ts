import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { BalatroSplash } from "../shaders/BalatroSplash";
import { calcPx, calcScale } from "../Constants";
import { ClickMode, PlayingCard } from "../data/PlayingCard";
import { CardValue, Suit } from "../data/types/card";

export class MainMenu extends Scene {
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

        EventBus.emit("current-scene-ready", this);

        // music1 渐入：初始音量 0，在 2 秒内逐渐增加到 0.6
        const music = this.sound.add("music1", {
            volume: 0.2,
            rate: 0.7,
            loop: true,
        });
        music.play();
        this.tweens.add({
            targets: music,
            volume: 0.6,
            duration: 2 * 1000,
            ease: "Linear",
        });
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }
}
