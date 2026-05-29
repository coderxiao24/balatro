import { GameObjects } from "phaser";

import { EventBus } from "../EventBus";
import { BalatroSplash } from "../shaders/BalatroSplash";
import { calcPx, calcScale } from "../Constants";
import { ClickMode, PlayingCard } from "../data/PlayingCard";
import { CardValue, Suit } from "../data/types/card";
import { AudioManager } from "../AudioManager";
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

        EventBus.emit("current-scene-ready", this);

        // 通过 AudioManager 播放背景音乐（自动管理后台暂停/恢复）
        // fadeIn: 2000 表示 2 秒内从 0 渐变到目标音量 0.6
        AudioManager.getInstance().playMusic("MainMenu", "music1", {
            volume: 0.6,
            rate: 0.7,
            fadeIn: 3 * 1000,
        });
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }
}
