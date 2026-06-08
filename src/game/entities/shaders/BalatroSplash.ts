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
    /** 圆形闪光半径 (0-1) */
    flashRadius?: number;
    /** 圆形闪光不透明度 (0-1) */
    flashOpacity?: number;
}

export class BalatroSplash extends Phaser.GameObjects.Shader {
    private _time: number = 0;
    private _vortSpeed: number = 0.4;
    private _colour1: number[] = [1.0, 0.0, 0.0, 1.0];
    private _colour2: number[] = [0.0, 0.0, 1.0, 1.0];
    private _midFlash: number = 0;
    private _vortOffset: number = 0;
    private _flashRadius: number = 0;
    private _flashOpacity: number = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        config?: BalatroSplashConfig,
    ) {
        const fragSource = scene.cache.shader.get("splashFrag").glsl;

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
                setUniform("uFlashRadius", this._flashRadius);
                setUniform("uFlashOpacity", this._flashOpacity);
                setUniform("uResolution", [
                    scene.scale.width,
                    scene.scale.height,
                ]);
            },
        };

        super(scene, shaderConfig, x, y, width, height);

        this.type = "BalatroSplash";

        if (config) {
            if (config.time) this._time = config.time;
            if (config.colour1) this._colour1 = config.colour1;
            if (config.colour2) this._colour2 = config.colour2;
            if (config.vortSpeed !== undefined)
                this._vortSpeed = config.vortSpeed;
            if (config.midFlash !== undefined) this._midFlash = config.midFlash;
            if (config.vortOffset !== undefined)
                this._vortOffset = config.vortOffset;
            if (config.flashRadius !== undefined)
                this._flashRadius = config.flashRadius;
            if (config.flashOpacity !== undefined)
                this._flashOpacity = config.flashOpacity;
        }

        scene.scale.on("resize", this._onResize, this);
    }

    /**
     * 闪光出场：屏幕中间的圆形白光逐渐扩大覆盖全屏，白光内部始终保持不透明
     * 扩散先慢后快（easeInCubic）
     * @param duration 持续时间（毫秒）
     */
    flashOut(duration: number = 2000): void {
        const startTime = this._time;
        const endTime = startTime + duration / 1000;

        this._flashRadius = 0;
        this._flashOpacity = 1;

        this._flashOutEase = { startTime, endTime };
    }

    /**
     * 闪光进场：白光覆盖全屏完全不透明，逐渐透明度变成0
     * 变化先慢后快（easeInCubic）
     * @param duration 持续时间（毫秒）
     * @param onComplete 闪光完成后的回调
     */
    flashIn(duration: number = 2000, onComplete?: () => void): void {
        const startTime = this._time;
        const endTime = startTime + duration / 1000;

        this._flashRadius = 1.2;
        this._flashOpacity = 1;

        this._flashInEase = { startTime, endTime };
        this._flashInCallback = onComplete ?? null;
    }

    private _flashOutEase: {
        startTime: number;
        endTime: number;
    } | null = null;

    private _flashInEase: {
        startTime: number;
        endTime: number;
    } | null = null;

    private _flashInCallback: (() => void) | null = null;

    update(_time: number, delta: number): void {
        const dt = delta / 1000;
        this._time += dt;

        // 处理闪光出场缓动（圆形扩散）
        if (this._flashOutEase) {
            const t = Math.min(
                1,
                (this._time - this._flashOutEase.startTime) /
                    (this._flashOutEase.endTime - this._flashOutEase.startTime),
            );
            this._flashRadius = 1.2 * (t * t * t);
            this._flashOpacity = 1;
            if (t >= 1) {
                this._flashRadius = 1.2;
                this._flashOutEase = null;
            }
        }

        // 处理闪光进场缓动（透明度渐变）
        if (this._flashInEase) {
            const t = Math.min(
                1,
                (this._time - this._flashInEase.startTime) /
                    (this._flashInEase.endTime - this._flashInEase.startTime),
            );
            this._flashOpacity = 1.0 - t * t * t;
            this._flashRadius = 1.2;
            if (t >= 1) {
                this._flashOpacity = 0;
                this._flashInEase = null;
                if (this._flashInCallback) {
                    this._flashInCallback();
                    this._flashInCallback = null;
                }
            }
        }

        this.setUniform("uTime", this._time);
        this.setUniform("uVortSpeed", this._vortSpeed);
        this.setUniform("uColour1", this._colour1);
        this.setUniform("uColour2", this._colour2);
        this.setUniform("uMidFlash", this._midFlash);
        this.setUniform("uVortOffset", this._vortOffset);
        this.setUniform("uFlashRadius", this._flashRadius);
        this.setUniform("uFlashOpacity", this._flashOpacity);
    }

    private _onResize = (gameSize: Phaser.Structs.Size): void => {
        this.setUniform("uResolution", [gameSize.width, gameSize.height]);
    };

    preDestroy(): void {
        this.scene.scale.off("resize", this._onResize, this);
        super.preDestroy();
    }
}
