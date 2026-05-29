/**
 * BaseScene - 基础场景类
 *
 * 所有场景应继承此类而非 Phaser.Scene，以自动获得：
 * 1. 场景销毁时自动通知 AudioManager 清理音频
 * 2. 未来可在此添加更多通用功能
 */

import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class BaseScene extends Scene {
    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    /**
     * 场景初始化时注册生命周期监听
     * Phaser 在 create 之前自动调用 init
     */
    init(): void {
        // 使用 once 确保只触发一次，避免重复清理
        this.events.once("shutdown", () => {
            EventBus.emit("scene-destroy", this.scene.key);
        });
        this.events.once("destroy", () => {
            EventBus.emit("scene-destroy", this.scene.key);
        });
    }
}
