import { Scene } from "phaser";

export class Preloader extends Scene {
    private progressBar!: Phaser.GameObjects.Graphics;
    private progressValue = 0;
    private loadingSteps: { progress: number; label: string }[] = [];
    private currentStepIndex = 0;
    private stepTimer = 0;
    private readonly STEP_INTERVAL = 400;

    constructor() {
        super("Preloader");
    }

    init() {
        this.loadingSteps = [
            { progress: 0.1, label: "Loading shaders..." },
            { progress: 0.2, label: "Loading shaders..." },
            { progress: 0.22, label: "Loading shaders..." },
            { progress: 0.4, label: "Loading textures..." },
            { progress: 0.7, label: "Loading assets..." },
            { progress: 0.8, label: "Loading assets..." },
            { progress: 0.9, label: "Finalizing..." },
            { progress: 0.95, label: "Finalizing..." },
            { progress: 1.0, label: "Ready!" },
        ];

        // 进度条
        this.progressBar = this.add.graphics();
        this.drawProgressBar(0);
    }

    preload() {
        // 在 preload 中实际加载 shader 源码到缓存
        this.load.text("splashFrag", "src/game/shaders/splash_phaser.fs");
        this.load.text("flashFrag", "src/game/shaders/flash_phaser.fs");

        // 加载 Joker 卡精灵图
        this.load.spritesheet("Jokers", "resources/textures/2x/Jokers.png", {
            frameWidth: 142,
            frameHeight: 190,
        });
    }

    create() {
        this.currentStepIndex = 0;
        this.stepTimer = 0;
    }

    update(_time: number, delta: number) {
        if (this.currentStepIndex >= this.loadingSteps.length) {
            this.scene.start("Splash");
            return;
        }

        this.stepTimer += delta;

        if (this.stepTimer >= this.STEP_INTERVAL) {
            this.stepTimer = 0;
            const step = this.loadingSteps[this.currentStepIndex];
            this.progressValue = step.progress;
            this.drawProgressBar(this.progressValue);

            this.currentStepIndex++;
        }
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
