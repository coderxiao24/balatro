import { Scene } from "phaser";
import { BaseScene } from "./BaseScene";

export class Preloader extends BaseScene {
    private progressBar!: Phaser.GameObjects.Graphics;

    constructor() {
        super("Preloader");
    }

    preload() {
        // 初始化进度条
        this.progressBar = this.add.graphics();
        this.drawProgressBar(0);

        // 监听真实加载进度
        this.load.on("progress", (value: number) => {
            this.drawProgressBar(value);
        });

        this.load.glsl("splashFrag", "assets/shaders/splash_phaser.glsl");
        this.load.glsl("backgroundFrag", "assets/shaders/background_phaser.glsl");
        // 加载 Joker 卡精灵图
        this.load.spritesheet("Jokers", "assets/textures/2x/Jokers.png", {
            frameWidth: 142,
            frameHeight: 190,
        });
        this.load.spritesheet("8BitDeck", "assets/textures/2x/8BitDeck.png", {
            frameWidth: 142,
            frameHeight: 190,
        });
        this.load.spritesheet("Enhancers", "assets/textures/2x/Enhancers.png", {
            frameWidth: 142,
            frameHeight: 190,
        });
        this.load.image("balatro", "assets/textures/2x/balatro.png");

        this.load.audio("music1", "assets/sounds/music1.ogg");
        this.load.audio("button", "assets/sounds/button.ogg");
        this.load.audio("whoosh1", "assets/sounds/whoosh1.ogg");
        this.load.audio("whoosh", "assets/sounds/whoosh.ogg");
        this.load.audio("introPad1", "assets/sounds/introPad1.ogg");
        this.load.audio("splash_buildup", "assets/sounds/splash_buildup.ogg");
    }

    create() {
        // 所有资源加载完成后直接跳转到 Splash 场景
        this.scene.start("Splash");
    }

    private drawProgressBar(progress: number) {
        const { width, height } = this.cameras.main;
        const barWidth = 300;
        const barHeight = 30;
        const barX = width / 2 - barWidth / 2;
        const barY = height / 2 - barHeight / 2;
        const radius = 5;

        this.progressBar.clear();

        // 蓝色填充进度条 RGB(0.6, 0.8, 0.9) = #99ccff
        if (progress > 0) {
            const fillWidth = Math.max(progress * barWidth, radius * 2);
            this.progressBar.fillStyle(0x99ccff, 1);
            this.progressBar.fillRoundedRect(
                barX,
                barY,
                fillWidth,
                barHeight,
                radius,
            );
        }

        // 白色边框 线宽3px
        this.progressBar.lineStyle(3, 0xffffff, 1);
        this.progressBar.strokeRoundedRect(
            barX,
            barY,
            barWidth,
            barHeight,
            radius,
        );
    }
}
