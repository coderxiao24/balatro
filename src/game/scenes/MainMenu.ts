import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { BalatroSplash } from "../shaders/BalatroSplash";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    bgShader: BalatroSplash;

    constructor() {
        super("MainMenu");
    }

    create() {
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
            },
        );
        this.add.existing(this.bgShader);

        this.title = this.add
            .text(width / 2, height / 2, __APP_ENV__.VITE_APP_TITLE)
            .setOrigin(0.5);
        this.add
            .text(
                this.title.x,
                this.title.y + this.title.height,
                __APP_ENV__.VITE_APP_TITLE,
            )
            .setOrigin(0.5);
        EventBus.emit("current-scene-ready", this);
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }
}
