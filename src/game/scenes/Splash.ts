import * as Phaser from "phaser";
import { BalatroSplash } from "../shaders/BalatroSplash";
const { Scene } = Phaser;

export class Splash extends Scene {
    private bgShader!: BalatroSplash;
    private elapsed = 0;
    private jokerCard!: Phaser.GameObjects.Image;

    private jokerCardEntered = false;

    private introPad1!: Phaser.Sound.BaseSound;
    private whoosh1!: Phaser.Sound.BaseSound;
    constructor() {
        super("Splash");
    }

    create() {
        const { width, height } = this.cameras.main;

        // 1. 创建 splash shader 背景（蓝白漩涡，速度=1）
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
                midFlash: 0.0,
                vortOffset: (2 * 90.15315131 * Date.now()) % 100000,
                time: 2,
            },
        );
        this.add.existing(this.bgShader);
        this.introPad1 = this.sound.add("introPad1", {
            volume: 0.6,
            rate: 0.704,
        });
        this.whoosh1 = this.sound.add("whoosh1", {
            volume: 0.2,
            rate: 0.7,
        });
        // 重置状态
        this.elapsed = 0;
        this.jokerCardEntered = false;

        // 点击屏幕任意位置直接跳转到主菜单
        this.input.once("pointerdown", () => {
            this.whoosh1.stop();
            this.introPad1.stop();
            this.scene.start("MainMenu");
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

        // 更新 Joker 卡摇摆效果
        if (this.jokerCardEntered) {
            this.updateJokerCard(dt);
        }

        if (this.elapsed >= 11) {
            this.whoosh1.stop();
            this.introPad1.stop();
            this.scene.start("MainMenu");
        }
    }

    private showJokerCard() {
        const { width, height } = this.cameras.main;

        // 创建 Joker 卡（精灵图第一帧）
        this.jokerCard = this.add.image(width / 2, height, "Jokers", 0);

        this.whoosh1.play();

        this.introPad1.play();

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

    private updateJokerCard(dt: number) {
        // 复合轴倾斜效果：左上角靠近人眼（Z轴向前），右下角远离人眼（Z轴向后）
        //
        // 由于 Phaser 4 的 Image 没有内置 skew（剪切变换）属性，
        // 这里使用 setScale 的非对称缩放 + setAngle 旋转来模拟 3D 透视倾斜。
        //
        // 真实的 skew 变换矩阵：
        //   | 1    tan(skewX)  0 |
        //   | tan(skewY)  1    0 |
        //   | 0          0    1 |
        //
        // 左上角靠近人眼 = skewX 负值（顶部向左偏）+ skewY 正值（右侧向下偏）
        // 在 2D 中近似为：scaleX 缩小 + scaleY 缩小 + 逆时针旋转
        //
        // 使用正弦波让效果来回摆动，产生呼吸感

        const speed = 1.2;
        const t = this.elapsed * speed;

        // 模拟 skewX（水平剪切）：scaleX 周期性变化
        // skewX 负值（顶部向左偏）≈ scaleX < 1
        // skewX 正值（顶部向右偏）≈ scaleX > 1
        const skewX = Math.sin(t) * 0.08;

        // 模拟 skewY（垂直剪切）：scaleY 周期性变化
        // skewY 正值（右侧向下偏）≈ scaleY > 1
        // skewY 负值（右侧向上偏）≈ scaleY < 1
        // 相位偏移 π/2 使 skewY 与 skewX 有 90 度相位差，产生复合旋转效果
        const skewY = Math.sin(t + Math.PI * 0.5) * 0.08;

        // 应用非对称缩放模拟 skew
        this.jokerCard.setScale(1 + skewX, 1 + skewY);

        // 添加轻微的旋转，增强立体感
        // 当左上角凸起时逆时针旋转，右下角凸起时顺时针旋转
        this.jokerCard.setAngle(Math.sin(t * 0.7) * 1.5);
    }
}
