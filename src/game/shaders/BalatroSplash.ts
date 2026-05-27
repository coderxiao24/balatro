import * as Phaser from "phaser";

export interface BalatroSplashConfig {
    time?: number;
    /** 主色 [r, g, b, a] 0-1 (默认红色) */
    colour1?: number[];
    /** 辅色 [r, g, b, a] 0-1 (默认蓝色) */
    colour2?: number[];
    /** 漩涡速度 (默认 0.4) */
    vortSpeed?: number;
    /** 白色闪光强度 (默认 0) */
    midFlash?: number;
    /** 漩涡偏移量 (默认 0) */
    vortOffset?: number;
}

export class BalatroSplash extends Phaser.GameObjects.Shader {
    private _time: number = 0;
    private _vortSpeed: number = 0.4;
    private _colour1: number[] = [1.0, 0.0, 0.0, 1.0]; // 红色
    private _colour2: number[] = [0.0, 0.0, 1.0, 1.0]; // 蓝色
    private _midFlash: number = 0;
    private _vortOffset: number = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        config?: BalatroSplashConfig,
    ) {
        // 从缓存获取 shader 源码（由 Preloader 加载）
        const fragSource = scene.cache.text.get("splashFrag");

        // 构建着色器配置
        const shaderConfig: Phaser.Types.GameObjects.Shader.ShaderQuadConfig = {
            name: "BalatroSplash",
            fragmentSource: fragSource,
            setupUniforms: (setUniform: (name: string, value: any) => void) => {
                setUniform("uTime", this._time);
                setUniform("uVortSpeed", this._vortSpeed);
                setUniform("uColour1", this._colour1);
                setUniform("uColour2", this._colour2);
                setUniform("uMidFlash", this._midFlash);
                setUniform("uVortOffset", this._vortOffset);
                setUniform("uResolution", [
                    scene.scale.width,
                    scene.scale.height,
                ]);
            },
        };

        super(scene, shaderConfig, x, y, width, height);

        this.type = "BalatroSplash";

        // 应用配置
        if (config) {
            if (config.time) this._time = config.time;
            if (config.colour1) this._colour1 = config.colour1;
            if (config.colour2) this._colour2 = config.colour2;
            if (config.vortSpeed !== undefined)
                this._vortSpeed = config.vortSpeed;
            if (config.midFlash !== undefined) this._midFlash = config.midFlash;
            if (config.vortOffset !== undefined)
                this._vortOffset = config.vortOffset;
        }

        // 监听窗口大小变化
        scene.scale.on("resize", this._onResize, this);
    }

    /**
     * 设置颜色
     */
    setColours(colour1?: number[], colour2?: number[]): this {
        if (colour1) this._colour1 = colour1;
        if (colour2) this._colour2 = colour2;
        return this;
    }

    /**
     * 设置漩涡速度
     */
    setVortSpeed(speed: number): this {
        this._vortSpeed = speed;
        return this;
    }

    /**
     * 设置白色闪光强度 (0-1)
     */
    setMidFlash(flash: number): this {
        this._midFlash = flash;
        return this;
    }

    /**
     * 设置漩涡偏移量
     */
    setVortOffset(offset: number): this {
        this._vortOffset = offset;
        return this;
    }

    /**
     * 缓动白色闪光到目标值
     */
    easeMidFlash(target: number, duration: number = 4000): void {
        const start = this._midFlash;
        const startTime = this._time;
        const endTime = startTime + duration / 1000;

        // 在 update 中处理缓动
        this._flashEase = { start, target, startTime, endTime };
    }

    private _flashEase: {
        start: number;
        target: number;
        startTime: number;
        endTime: number;
    } | null = null;

    /**
     * 每帧更新 - 需要在场景的 update 中调用
     */
    update(_time: number, delta: number): void {
        const dt = delta / 1000; // 转换为秒

        this._time += dt;

        // 处理 midFlash 缓动
        if (this._flashEase) {
            const t = Math.min(
                1,
                (this._time - this._flashEase.startTime) /
                    (this._flashEase.endTime - this._flashEase.startTime),
            );
            this._midFlash =
                this._flashEase.start +
                (this._flashEase.target - this._flashEase.start) * t;
            if (t >= 1) {
                this._midFlash = this._flashEase.target;
                this._flashEase = null;
            }
        }
    }

    /**
     * 窗口大小变化时更新分辨率
     */
    private _onResize = (gameSize: Phaser.Structs.Size): void => {
        this.setUniform("uResolution", [gameSize.width, gameSize.height]);
    };

    /**
     * 销毁
     */
    preDestroy(): void {
        this.scene.scale.off("resize", this._onResize, this);
        super.preDestroy();
    }
}
