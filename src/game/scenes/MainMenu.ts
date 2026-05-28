import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { BalatroSplash } from "../shaders/BalatroSplash";
import { calcPx, calcScale } from "../Constants";
import { ClickMode, PlayingCard } from "../data/PlayingCard";
import { CardValue, Suit } from "../data/types/card";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;

    logoTween: Phaser.Tweens.Tween | null;
    bgShader: BalatroSplash;
    music: Phaser.Sound.BaseSound | null;

    // 用于监听页面可见性变化的处理器引用
    private visibilityHandler: (() => void) | null = null;
    private blurHandler: (() => void) | null = null;
    private focusHandler: (() => void) | null = null;

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

        // music1 渐入：初始音量 0，在 2 秒内逐渐增加到 0.6
        this.music = this.sound.add("music1", {
            volume: 0.2,
            rate: 0.7,
            loop: true,
        });
        this.music.play();
        this.tweens.add({
            targets: this.music,
            volume: 0.6,
            duration: 2 * 1000,
            ease: "Linear",
        });

        // 监听页面可见性变化（手机息屏、App 推入后台/回到前台）
        this.setupLifecycleListeners();
    }

    /**
     * 设置应用生命周期监听器
     * 当手机息屏或 App 被推入后台时暂停音乐，回到前台时恢复
     */
    private setupLifecycleListeners(): void {
        // 清理旧的监听器（防止重复创建）
        this.cleanupLifecycleListeners();

        // 1. 监听 visibilitychange 事件（浏览器/WebView 标准事件）
        this.visibilityHandler = () => {
            if (document.hidden) {
                // App 进入后台或息屏 → 暂停音乐
                this.pauseMusic();
            } else {
                // App 回到前台 → 恢复音乐
                this.resumeMusic();
            }
        };
        document.addEventListener("visibilitychange", this.visibilityHandler);

        // 2. 监听 window blur/focus 事件（额外保障）
        this.blurHandler = () => {
            this.pauseMusic();
        };
        this.focusHandler = () => {
            this.resumeMusic();
        };
        window.addEventListener("blur", this.blurHandler);
        window.addEventListener("focus", this.focusHandler);
    }

    /**
     * 暂停音乐播放
     */
    private pauseMusic(): void {
        if (this.music && this.music.isPlaying) {
            this.music.pause();
        }
    }

    /**
     * 恢复音乐播放
     */
    private resumeMusic(): void {
        if (this.music && !this.music.isPlaying) {
            this.music.resume();
        }
    }

    /**
     * 清理生命周期监听器
     */
    private cleanupLifecycleListeners(): void {
        if (this.visibilityHandler) {
            document.removeEventListener(
                "visibilitychange",
                this.visibilityHandler,
            );
            this.visibilityHandler = null;
        }
        if (this.blurHandler) {
            window.removeEventListener("blur", this.blurHandler);
            this.blurHandler = null;
        }
        if (this.focusHandler) {
            window.removeEventListener("focus", this.focusHandler);
            this.focusHandler = null;
        }
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }

    /**
     * 场景关闭时清理资源（Phaser 自动调用）
     */
    shutdown(): void {
        this.cleanupLifecycleListeners();
        if (this.music) {
            this.music.stop();
            this.music = null;
        }
    }

    /**
     * 场景销毁时清理资源（Phaser 自动调用）
     */
    destroy(): void {
        this.cleanupLifecycleListeners();
        if (this.music) {
            this.music.stop();
            this.music = null;
        }
    }
}
