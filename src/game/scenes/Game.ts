import { Scene } from "phaser";
import { BaseScene } from "./BaseScene";

export class Game extends BaseScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;
        // this.camera.setBackgroundColor(0x00ff00);

        const { width, height } = this.cameras.main;

        this.gameText = this.add
            .text(width / 2, height / 2, "Make something fun!", {
                fontFamily: "NotoSansSC",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
    }
}
