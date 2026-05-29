import * as Phaser from "phaser";
import { BalatroSplash } from "../shaders/BalatroSplash";
import { calcScale } from "../Constants";
import { AudioManager } from "../AudioManager";
import { BaseScene } from "./BaseScene";

export class Splash extends BaseScene {
    private bgShader!: BalatroSplash;
    private elapsed = 0;
    private jokerCard!: Phaser.GameObjects.Image;
    private jokerCardScale!: number;

    private jokerCardEntered = false;
    private jokerCardElapsed = 0;

    private flashTriggered = false;
    private splashBuildupPlayed = false;
    private jokerCardDissolving = false;

    constructor() {
        super("Splash");
    }

    create() {
        const { width, height } = this.cameras.main;

        // 1. 创建 splash shader 背景（蓝白漩涡，速度=1）
        // 闪光效果已内置在 splash shader 中，通过 uMidFlash 控制
        this.bgShader = new BalatroSplash(
            this,
            width / 2,
            height / 2,
            width,
            height,
            {
                colour1: [0, 0, 1, 1], // 蓝色
                colour2: [1, 1, 1, 1], // 白色
                vortSpeed: 1.0,
                midFlash: 0,
                vortOffset: 0,
                time: 3,
            },
        );
        this.add.existing(this.bgShader);

        // 重置状态
        this.elapsed = 0;
        this.jokerCardEntered = false;

        // 点击屏幕任意位置直接跳转到主菜单（不做闪光入场）
        this.input.once("pointerdown", () => {
            this.scene.start("MainMenu", { skipFlashIn: true });
        });
    }

    update(_time: number, delta: number) {
        const dt = delta / 1000;
        this.elapsed += dt;

        // 更新背景 shader
        this.bgShader.update(_time, delta);

        // 等待0.2秒后显示 Joker 卡
        if (!this.jokerCard && this.elapsed >= 0.2) {
            this.showJokerCard();
        }

        // 更新 Joker 卡摇摆效果（溶解时停止摇摆，让 tween 控制 scale）
        if (this.jokerCardEntered) {
            this.updateJokerCard(dt);
        }

        // 在 2 秒时播放 splash_buildup 音效
        if (!this.splashBuildupPlayed && this.elapsed >= 2) {
            this.splashBuildupPlayed = true;
            AudioManager.getInstance().playSound("Splash", "splash_buildup", {
                volume: 0.7,
                rate: 1,
            });
        }

        // 在 6 秒时触发 Joker 卡溶解消失
        if (!this.jokerCardDissolving && this.elapsed >= 9) {
            this.jokerCardDissolving = true;

            // Joker 卡溶解消失：淡出 + 缩小到 0
            if (this.jokerCard) {
                this.tweens.add({
                    targets: this.jokerCard,
                    alpha: 0,
                    duration: 3 * 1000,
                    ease: "Sine.easeIn",
                });
            }
        }

        // 在 9 秒时触发圆形扩散闪光
        if (!this.flashTriggered && this.elapsed >= 11) {
            this.flashTriggered = true;

            // 触发闪光出场：圆形白光逐渐扩大覆盖全屏
            this.bgShader.flashOut(2 * 1000);
        }

        // 在 11 秒时跳转到主菜单
        if (this.elapsed >= 13) {
            this.scene.start("MainMenu");
        }
    }

    private showJokerCard() {
        const { width, height } = this.cameras.main;

        // 创建 Joker 卡（精灵图第一帧）
        this.jokerCard = this.add.image(width / 2, height, "Jokers", 0);

        this.jokerCardScale = calcScale(width, this.jokerCard.width, 220);

        this.jokerCard.setScale(this.jokerCardScale);

        // 通过 AudioManager 播放音效（自动注册管理）
        AudioManager.getInstance().playSound("Splash", "whoosh1", {
            volume: 0.2,
            rate: 0.7,
        });
        AudioManager.getInstance().playSound("Splash", "introPad1", {
            volume: 0.6,
            rate: 0.704,
        });

        // 入场动画：从起始位置弹入到目标位置
        // 使用 Back.easeOut 模拟原游戏的弹性效果
        this.tweens.add({
            targets: this.jokerCard,
            y: height / 2,
            duration: 400,
            ease: "Back.easeOut",
            onComplete: () => {
                this.jokerCardEntered = true;
            },
        });
    }

    // 模拟3d旋转效果（在初始缩放基础上叠加）
    private updateJokerCard(dt: number) {
        this.jokerCardElapsed += dt;
        const speed = 1.2;
        const t = this.jokerCardElapsed * speed;
        const skewX = Math.sin(t) * 0.08;
        const skewY = Math.sin(t + Math.PI) * 0.08;

        this.jokerCard.setScale(
            this.jokerCardScale * (1 + skewX),
            this.jokerCardScale * (1 + skewY),
        );
        this.jokerCard.setAngle(Math.sin(t * 0.7) * 1.5);
    }
}
