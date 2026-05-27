import { Scene } from "phaser";

export class Preloader extends Scene {
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

        // 加载 shader 源码到缓存
        this.load.text("splashFrag", "src/game/shaders/splash_phaser.fs");
        this.load.text("flashFrag", "src/game/shaders/flash_phaser.fs");

        // 加载 Joker 卡精灵图
        this.load.spritesheet("Jokers", "resources/textures/2x/Jokers.png", {
            frameWidth: 142,
            frameHeight: 190,
        });
        this.load.spritesheet(
            "8BitDeck",
            "resources/textures/2x/8BitDeck.png",
            {
                frameWidth: 142,
                frameHeight: 190,
            },
        );
        this.load.spritesheet(
            "Enhancers",
            "resources/textures/2x/Enhancers.png",
            {
                frameWidth: 142,
                frameHeight: 190,
            },
        );
        this.load.image("balatro", "resources/textures/2x/balatro.png");

        this.load.audio("music1", "resources/sounds/music1.ogg");
        this.load.audio("whoosh1", "resources/sounds/whoosh1.ogg");
        this.load.audio("introPad1", "resources/sounds/introPad1.ogg");
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
