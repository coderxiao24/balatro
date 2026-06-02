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

        // 1. 创建一个容器，用来装这三个按钮 (x, y 是整个按钮组的中心位置)
        const buttonGroup = this.add.container(
            width / 2,
            height - calcPx(width, 88) - calcPx(width, 190) / 2,
        );

        const spacing = calcPx(width, 20); // 按钮之间的间距

        // 2. 创建三个矩形作为按钮
        // 第一个按钮 (位置在左边)
        const btn1 = this.add
            .rectangle(
                -(calcPx(width, 352) / 2 + calcPx(width, 256) / 2 + spacing),
                0,
                calcPx(width, 352),
                calcPx(width, 150),
                0x449bf8,
            )
            .setRounded(calcPx(width, 12));
        // 第二个按钮 (位置在中间)
        const btn2 = this.add
            .rectangle(0, 0, calcPx(width, 256), calcPx(width, 130), 0xf0a63b)
            .setRounded(calcPx(width, 12));
        // 第三个按钮 (位置在右边)
        const btn3 = this.add
            .rectangle(
                calcPx(width, 352) / 2 + calcPx(width, 256) / 2 + spacing,
                0,
                calcPx(width, 352),
                calcPx(width, 150),
                0x6ba688,
            )
            .setRounded(calcPx(width, 12));

        // 3. 为每个矩形开启交互，并添加鼠标悬停和点击效果
        // [btn1, btn2, btn3].forEach((btn, index) => {
        //     btn.setInteractive({ useHandCursor: true }) // 开启交互，鼠标放上去变小手
        //         .on("pointerover", () => btn.setFillStyle(0xa9a9a9)) // 鼠标悬停时变亮一点
        //         .on("pointerout", () => btn.setFillStyle(buttonColor)) // 鼠标离开恢复原色
        //         .on("pointerdown", () => {
        //             console.log(`第 ${index + 1} 个按钮被点击了！`);
        //             // 在这里写你的点击回调逻辑
        //         });
        // });

        buttonGroup.add([btn1, btn2, btn3]);

        const groupBg = this.add.rectangle(
            0,
            0,
            calcPx(width, 352) * 2 + calcPx(width, 256) + spacing * 4,
            calcPx(width, 150) + calcPx(width, 16) * 2,
            0x536267,
        );
        groupBg.setRounded(calcPx(width, 20)); // 设置圆角
        buttonGroup.addAt(groupBg, 0);
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }
}
