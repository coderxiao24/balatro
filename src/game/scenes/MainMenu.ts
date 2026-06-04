import { GameObjects, Geom } from "phaser";

import { BalatroSplash } from "../shaders/BalatroSplash";
import { calcPx, calcScale } from "../Constants";
import { ClickMode, PlayingCard } from "../data/PlayingCard";
import { CardValue, Suit } from "../data/types/card";
import { BaseScene } from "./BaseScene";
import { AudioManager } from "@/game/manager/AudioManager";

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

        this.logo = this.add.image(width / 2, calcPx(width, 460), "balatro");

        this.logo.setScale(calcScale(width, this.logo.height, 863));
        const A = new PlayingCard(Suit.Spades, CardValue.Ace);
        A.addToScene(
            this,
            width / 2,
            calcPx(width, 460),
            ClickMode.select,
            true,
        );

        if (A.container) {
            A.setScale(calcScale(width, A.container?.width, 240));
        }

        // 创建按钮组（每个按钮+文字放在一个容器中）
        const createButton = (
            x: number,
            y: number,
            w: number,
            h: number,
            color: number,
            text: string,
            fontSize: number,
            onClick: () => void,
        ) => {
            const container = this.add.container(x, y);

            const btn = this.add
                .rectangle(0, 0, w, h, color)
                .setRounded(calcPx(width, 12));

            const label = this.add
                .text(0, 0, text, {
                    fontSize: `${fontSize}px`,
                    color: "#ffffff",
                    fontFamily: "NotoSansSC",
                })
                .setOrigin(0.5);

            container.add([btn, label]);

            container.setInteractive(
                new Geom.Rectangle(-w / 2, -h / 2, w, h),
                Geom.Rectangle.Contains,
            );

            container.on("pointerover", () => {
                container.y = calcPx(width, 12);
                container.setAlpha(0.5);
            });
            container.on("pointerout", () => {
                container.y = 0;
                container.setAlpha(1);
            });

            container.on("pointerdown", () => {
                AudioManager.getInstance().playSound(this.scene.key, "button", {
                    volume: 0.7,
                    rate: 0.8,
                });
                onClick();
            });

            return container;
        };

        const targetY = height - calcPx(width, 88) - calcPx(width, 198) / 2;

        const buttonGroup = this.add.container(width / 2, targetY);

        const spacing = calcPx(width, 20);

        const startGameBtn = createButton(
            -(calcPx(width, 352) / 2 + calcPx(width, 256) / 2 + spacing),
            0,
            calcPx(width, 352),
            calcPx(width, 150),
            0x449bf8,
            "开始游戏",
            calcPx(width, 70),
            () => {
                this.scene.start("Game");
            },
        );

        const optionBtn = createButton(
            0,
            0,
            calcPx(width, 256),
            calcPx(width, 130),
            0xf0a63b,
            "选项",
            calcPx(width, 42),
            () => {
                // this.scene.start("Option");
            },
        );

        const favoriteBtn = createButton(
            calcPx(width, 352) / 2 + calcPx(width, 256) / 2 + spacing,
            0,
            calcPx(width, 352),
            calcPx(width, 150),
            0x6ba688,
            "收藏",
            calcPx(width, 52),
            () => {
                // this.scene.start("Favorite");
            },
        );

        buttonGroup.add([startGameBtn, optionBtn, favoriteBtn]);

        const groupBg = this.add.rectangle(
            0,
            0,
            calcPx(width, 352) * 2 + calcPx(width, 256) + spacing * 4,
            calcPx(width, 150) + calcPx(width, 24) * 2,
            0x536267,
        );
        groupBg.setRounded(calcPx(width, 20)); // 设置圆角
        buttonGroup.addAt(groupBg, 0);

        // 闪光进场：从 Splash 场景自动跳转过来时做闪光入场，点击跳转则跳过
        if (!data?.skipFlashIn) {
            // 有闪光进场：按钮组从屏幕下方飞入
            buttonGroup.y = height + calcPx(width, 198);

            this.bgShader.flashIn(2 * 1000, () => {
                AudioManager.getInstance().playSound(this.scene.key, "whoosh", {
                    volume: 0.2,
                    rate: 0.7,
                });
                this.tweens.add({
                    targets: buttonGroup,
                    y: targetY,
                    duration: 400,
                    ease: "Back.easeOut",
                });
            });
        }
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }
}
