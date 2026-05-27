import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { BalatroSplash } from "../shaders/BalatroSplash";
import { recalcTileSize } from "../Constants";
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
                time: 12,
            },
        );
        this.add.existing(this.bgShader);

        this.logo = this.add.image(
            width / 2,
            height / 2 - recalcTileSize(width, height),
            "balatro",
        );

        const A = new PlayingCard(Suit.Spades, CardValue.Ace);
        A.addToScene(
            this,
            width / 2,
            height / 2 - recalcTileSize(width, height),
            ClickMode.flip,
        );
        console.log(666, A);
        EventBus.emit("current-scene-ready", this);

        this.sound.play("music1", {
            volume: 0.6,
            rate: 0.7,
            loop: true,
        });
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }
}
