/**
 * AudioManager - 全局音频管理器
 *
 * 职责：
 * 1. 完全接管游戏中所有音频的创建、播放、暂停、恢复、停止
 * 2. 监听应用生命周期事件（息屏、后台/前台切换）
 * 3. 进入后台时自动淡出暂停所有音频，回到前台时自动淡入恢复
 * 4. 场景切换时自动清理旧场景的音频资源（无需手动调用）
 *
 * 音频类型：
 * - BGM（背景音乐）：同一场景同一 key 只有一个实例，后播放的会覆盖先播放的
 * - SFX（音效）：同一场景同一 key 可以有多个实例同时播放
 */

import { EventBus } from "./EventBus";
import scenesBGMMap from "./data/scenesBGM";
import { sceneNames } from "./data/types/scenesName";

export interface AudioOptions {
    volume?: number;
    rate?: number;
    loop?: boolean;
    seek?: number;
    /** 淡入持续时间（毫秒），播放时从 0 渐变到目标音量 */
    fadeIn?: number;
    /** 淡出持续时间（毫秒），停止时从当前音量渐变到 0 */
    fadeOut?: number;
}

interface ManagedAudio {
    /** Phaser 音频实例 */
    sound: Phaser.Sound.WebAudioSound;
    /** 所属场景 key */
    sceneKey: string;
    /** 音频 key（资源 key） */
    audioKey: string;
    /** 标准音量 */
    standardVolume: number;
    /** 是否正在淡出 */
    isFadingOut: boolean;
    /** 是否正在淡入 */
    isFadingIn: boolean;
    /** 淡出定时器 */
    fadeTimer?: ReturnType<typeof setInterval>;
    /** 是否为 BGM（背景音乐） */
    isMusic: boolean;
}

export class AudioManager {
    private static instance: AudioManager;

    /** 所有受管理的音频 */
    private managedAudios: Map<string, ManagedAudio> = new Map();

    /** 是否已暂停（因后台/息屏） */
    private isPaused = false;

    /** 生命周期监听器是否已注册 */
    private listenersRegistered = false;

    /** 淡入淡出持续时间（毫秒） */
    private fadeDuration = 500;

    /** Phaser 的 SoundManager 引用 */
    private soundManager: Phaser.Sound.BaseSoundManager | null = null;

    /** 自增 ID 计数器，用于生成唯一 key */
    private idCounter = 0;

    private constructor() {}

    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /**
     * 初始化 AudioManager
     * @param soundManager Phaser 的 SoundManager（从任意场景的 this.sound 获取）
     */
    init(soundManager: Phaser.Sound.BaseSoundManager): void {
        if (this.listenersRegistered) return;
        this.soundManager = soundManager;
        this.listenersRegistered = true;
        this.registerLifecycleListeners();
        this.registerSceneListeners();
    }

    /**
     * 播放背景音乐
     * 同一场景同一 key 只会有一个实例，后播放的会覆盖先播放的
     * @param sceneKey 场景标识（如 "MainMenu"）
     * @param audioKey 音频资源 key（如 "music1"）
     * @param options 音频配置
     * @returns 音频实例
     */
    playMusic(
        sceneKey: string,
        audioKey: string,
        options?: AudioOptions,
    ): Phaser.Sound.WebAudioSound {
        return this.play(
            sceneKey,
            audioKey,
            {
                ...options,
                loop: options?.loop ?? true,
            },
            true,
        );
    }

    /**
     * 播放音效
     * 同一场景同一 key 可以有多个实例同时播放
     * @param sceneKey 场景标识
     * @param audioKey 音频资源 key
     * @param options 音频配置
     * @returns 音频实例
     */
    playSound(
        sceneKey: string,
        audioKey: string,
        options?: AudioOptions,
    ): Phaser.Sound.WebAudioSound {
        return this.play(sceneKey, audioKey, options, false);
    }

    /**
     * 播放音频（内部方法）
     * @param isMusic true=BGM（用固定 key），false=SFX（用唯一 key）
     */
    private play(
        sceneKey: string,
        audioKey: string,
        options?: AudioOptions,
        isMusic?: boolean,
    ): Phaser.Sound.WebAudioSound {
        if (!this.soundManager) {
            throw new Error("AudioManager not initialized! Call init() first.");
        }

        let trackKey: string;

        if (isMusic) {
            // BGM：用固定 key，先淡出旧的（不等待完成）
            trackKey = `music:${sceneKey}:${audioKey}`;
            this.stopTrack(trackKey, this.fadeDuration);
        } else {
            // SFX：用唯一 key，每次创建新实例
            trackKey = `sfx:${sceneKey}:${audioKey}:${++this.idCounter}`;
        }

        const standardVolume = options?.volume ?? 1;
        const fadeIn = options?.fadeIn ?? 0;

        // 创建音频
        const sound = this.soundManager.add(audioKey, {
            volume: fadeIn > 0 ? 0 : standardVolume,
            rate: options?.rate ?? 1,
            loop: options?.loop ?? false,
            seek: options?.seek ?? 0,
        }) as Phaser.Sound.WebAudioSound;

        sound.play();

        // 注册管理
        this.managedAudios.set(trackKey, {
            sound,
            sceneKey,
            audioKey,
            standardVolume,
            isFadingOut: false,
            isFadingIn: false,
            isMusic: !!isMusic,
        });

        // 如果是 SFX，在播放结束后自动清理
        if (!isMusic) {
            sound.once("complete", () => {
                this.stopTrack(trackKey);
            });
        }

        // 淡入
        if (fadeIn > 0) {
            this.fadeTo(
                this.managedAudios.get(trackKey)!,
                0,
                standardVolume,
                fadeIn,
            );
        }

        return sound;
    }

    /**
     * 停止指定场景的指定 BGM
     */
    stopMusic(sceneKey: string, audioKey: string): void {
        this.stopTrack(`music:${sceneKey}:${audioKey}`);
    }

    /**
     * 停止指定场景的所有音频（淡出）
     */
    stopAllSounds(sceneKey: string): void {
        this.managedAudios.forEach((audio, trackKey) => {
            if (audio.sceneKey === sceneKey) {
                this.stopTrack(trackKey, this.fadeDuration);
            }
        });
    }

    /**
     * 获取指定场景的指定 BGM 实例
     */
    getMusic(
        sceneKey: string,
        audioKey: string,
    ): Phaser.Sound.WebAudioSound | undefined {
        return this.managedAudios.get(`music:${sceneKey}:${audioKey}`)?.sound;
    }

    /**
     * 场景切换时清理该场景的所有音频
     */
    cleanupScene(sceneKey: string): void {
        this.stopAllSounds(sceneKey);
    }

    // ==================== 场景事件监听（自动清理） ====================

    private registerSceneListeners(): void {
        EventBus.on("scene-destroy", (sceneKey: string) => {
            console.log("AudioManager: scene-destroy", sceneKey);
            this.cleanupScene(sceneKey);
        });
        EventBus.on("scene-create", (sceneKey: sceneNames) => {
            console.log("AudioManager: scene-create", sceneKey);
            scenesBGMMap[sceneKey]?.();
        });
    }

    // ==================== 生命周期管理 ====================

    private registerLifecycleListeners(): void {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.handleAppBackground();
            } else {
                this.handleAppForeground();
            }
        });

        window.addEventListener("blur", () => this.handleAppBackground());
        window.addEventListener("focus", () => this.handleAppForeground());
        window.addEventListener("pagehide", () => this.handleAppBackground());
        window.addEventListener("pageshow", () => this.handleAppForeground());
        document.addEventListener("pause", () => this.handleAppBackground());
        document.addEventListener("resume", () => this.handleAppForeground());
    }

    private handleAppBackground(): void {
        if (this.isPaused) return;
        this.isPaused = true;
        this.pauseAll();
    }

    private handleAppForeground(): void {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.resumeAll();
    }

    /**
     * 暂停所有音频（直接暂停，不淡出）
     */
    private pauseAll(): void {
        this.managedAudios.forEach((audio) => {
            if (audio.sound.isPlaying) {
                this.fadeTo(
                    audio,
                    audio.standardVolume,
                    0,
                    this.fadeDuration,
                    () => {
                        audio.sound.pause();
                    },
                );
            }
        });
    }

    /**
     * 恢复所有音频（直接恢复，不淡入）
     */
    private resumeAll(): void {
        this.managedAudios.forEach((audio) => {
            if (audio.sound.isPaused) {
                audio.sound.resume();
                this.fadeTo(audio, 0, audio.standardVolume, this.fadeDuration);
            }
        });
    }

    /**
     * 音量渐变工具
     * 使用 currentVolume 手动跟踪音量，避免 Phaser 的 volume getter 不准确
     */
    private fadeTo(
        audio: ManagedAudio,
        startVolume: number,
        targetVolume: number,
        duration: number,
        onComplete?: () => void,
    ): void {
        if (audio.fadeTimer) {
            clearInterval(audio.fadeTimer);
        }

        const startTime = performance.now();
        const interval = 16;

        audio.fadeTimer = setInterval(() => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const newVolume =
                startVolume + (targetVolume - startVolume) * progress;

            audio.sound.volume = newVolume;

            if (progress >= 1) {
                clearInterval(audio.fadeTimer);
                audio.fadeTimer = undefined;
                audio.sound.setVolume(targetVolume);
                onComplete?.();
            }
        }, interval);
    }

    /**
     * 停止并移除指定 track
     * @param fadeOutDuration 淡出持续时间（毫秒），0 表示直接停止
     */
    private stopTrack(trackKey: string, fadeOutDuration?: number): void {
        const audio = this.managedAudios.get(trackKey);
        if (!audio) {
            console.log("stopTrack: audio not found for", trackKey);
            return;
        }

        if (audio.fadeTimer) {
            clearInterval(audio.fadeTimer);
            audio.fadeTimer = undefined;
        }

        const fadeOut = fadeOutDuration ?? 0;

        if (fadeOut > 0 && audio.sound.isPlaying) {
            audio.sound.removeAllListeners("complete");
            audio.isFadingOut = true;
            this.fadeTo(audio, audio.standardVolume, 0, fadeOut, () => {
                audio.isFadingOut = false;
                audio.sound.stop();

                if (this.managedAudios.get(trackKey) === audio) {
                    this.managedAudios.delete(trackKey);
                }
            });
        } else {
            audio.sound.stop();
            // 只在音频实例没变的情况下才删除
            if (this.managedAudios.get(trackKey) === audio) {
                this.managedAudios.delete(trackKey);
            }
        }
    }

    /**
     * 获取当前是否处于暂停状态（后台/息屏）
     */
    getIsPaused(): boolean {
        return this.isPaused;
    }

    /**
     * 设置淡入淡出持续时间
     */
    setFadeDuration(duration: number): void {
        this.fadeDuration = duration;
    }

    /**
     * 销毁 AudioManager，清理所有资源
     */
    destroy(): void {
        this.managedAudios.forEach((audio) => {
            if (audio.fadeTimer) clearInterval(audio.fadeTimer);
            audio.sound.stop();
        });
        this.managedAudios.clear();
        this.isPaused = false;
        this.listenersRegistered = false;
        this.soundManager = null;
    }
}
