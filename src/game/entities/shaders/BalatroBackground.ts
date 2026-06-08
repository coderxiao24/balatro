import * as Phaser from "phaser";

export interface BalatroBackgroundConfig {
    time?: number;
    spinTime?: number;
    colour1?: number[];
    colour2?: number[];
    colour3?: number[];
    contrast?: number;
    spinAmount?: number;
}

export class BalatroBackground extends Phaser.GameObjects.Shader {
    private _time: number = 0;
    private _spinTime: number = 0;
    private _colour1: number[] = [0.28, 0.47, 0.41, 1.0]; // #48786A
    private _colour2: number[] = [0.41, 0.68, 0.56, 1.0]; // #68AE90
    private _colour3: number[] = [0.22, 0.38, 0.31, 1.0]; // #386050
    private _contrast: number = 1;
    private _spinAmount: number = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        config?: BalatroBackgroundConfig,
    ) {
        const fragSource = scene.cache.shader.get("backgroundFrag").glsl;

        const shaderConfig: Phaser.Types.GameObjects.Shader.ShaderQuadConfig = {
            name: "BalatroBackground",
            fragmentSource: fragSource,
            setupUniforms: (setUniform: (name: string, value: any) => void) => {
                setUniform("uTime", this._time);
                setUniform("uSpinTime", this._spinTime);
                setUniform("uColour1", this._colour1);
                setUniform("uColour2", this._colour2);
                setUniform("uColour3", this._colour3);
                setUniform("uContrast", this._contrast);
                setUniform("uSpinAmount", this._spinAmount);
                setUniform("uResolution", [
                    scene.scale.width,
                    scene.scale.height,
                ]);
            },
        };

        super(scene, shaderConfig, x, y, width, height);

        this.type = "BalatroBackground";

        if (config) {
            if (config.time !== undefined) this._time = config.time;
            if (config.spinTime !== undefined) this._spinTime = config.spinTime;
            if (config.colour1) this._colour1 = config.colour1;
            if (config.colour2) this._colour2 = config.colour2;
            if (config.colour3) this._colour3 = config.colour3;
            if (config.contrast !== undefined) this._contrast = config.contrast;
            if (config.spinAmount !== undefined)
                this._spinAmount = config.spinAmount;
        }

        scene.scale.on("resize", this._onResize, this);
    }

    get time(): number {
        return this._time;
    }

    set time(value: number) {
        this._time = value;
        this.setUniform("uTime", value);
    }

    get spinTime(): number {
        return this._spinTime;
    }

    set spinTime(value: number) {
        this._spinTime = value;
        this.setUniform("uSpinTime", value);
    }

    get colour1(): number[] {
        return this._colour1;
    }

    set colour1(value: number[]) {
        this._colour1 = value;
        this.setUniform("uColour1", value);
    }

    get colour2(): number[] {
        return this._colour2;
    }

    set colour2(value: number[]) {
        this._colour2 = value;
        this.setUniform("uColour2", value);
    }

    get colour3(): number[] {
        return this._colour3;
    }

    set colour3(value: number[]) {
        this._colour3 = value;
        this.setUniform("uColour3", value);
    }

    get contrast(): number {
        return this._contrast;
    }

    set contrast(value: number) {
        this._contrast = value;
        this.setUniform("uContrast", value);
    }

    get spinAmount(): number {
        return this._spinAmount;
    }

    set spinAmount(value: number) {
        this._spinAmount = value;
        this.setUniform("uSpinAmount", value);
    }

    update(delta: number): void {
        const dt = delta / 1000;
        this._time += dt;
        this._spinTime += dt * this._spinAmount;

        this.setUniform("uTime", this._time);
        this.setUniform("uSpinTime", this._spinTime);
    }

    private _onResize = (gameSize: Phaser.Structs.Size): void => {
        this.setUniform("uResolution", [gameSize.width, gameSize.height]);
    };

    preDestroy(): void {
        this.scene.scale.off("resize", this._onResize, this);
        super.preDestroy();
    }
}
