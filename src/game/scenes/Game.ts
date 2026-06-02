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
        this.camera.setBackgroundColor(0x00ff00);

        const { width, height } = this.cameras.main;
        this.background = this.add.image(width / 2, height / 2, "background");
        this.background.setDisplaySize(width, height);
        this.background.setAlpha(0.5);

        this.gameText = this.add
            .text(
                512,
                384,
                "Make something fun!\nand share it with us:\nsupport@phaser.io",
                {
                    fontFamily: "Arial Black",
                    fontSize: 38,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                },
            )
            .setOrigin(0.5)
            .setDepth(100);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
