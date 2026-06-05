import { BaseScene } from "./BaseScene";

export class Game extends BaseScene {
    private _shader: any;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.glsl(
            "perlinNoiseFunction",
            "assets/shaders/perlinNoiseFunction.glsl",
        );
        this.load.glsl("waveProcess", "assets/shaders/waveProcess.glsl");
    }

    create() {
        const { width, height } = this.cameras.main;

        const image = this.add
            .image(width / 2, height / 2, "Jokers", 0)
            .enableFilters();

        const shaderConfig = {
            name: "Noise",

            shaderAdditions: [
                {
                    name: "PerlinNoise",
                    additions: {
                        fragmentHeader: this.cache.shader.get(
                            "perlinNoiseFunction",
                        ).glsl,
                        fragmentProcess:
                            this.cache.shader.get("waveProcess").glsl,
                    },
                },
            ],
            setupUniforms: (setUniform: (name: string, value: any) => void) => {
                setUniform("time", (this.game.loop.time % 1000000) / 500);
            },
        };

        this._shader = this.add.shader(
            shaderConfig,
            image.width / 2,
            image.height / 2,
            image.width,
            image.height,
        );
        this._shader.setRenderToTexture("ooze");

        image.filters?.internal.addDisplacement("ooze", 0, 0.5);
    }
}
