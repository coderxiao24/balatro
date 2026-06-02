import { Scene } from "phaser";
import { BaseScene } from "./BaseScene";

export class GameOver extends BaseScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;

    constructor() {
        super("GameOver");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        const { width, height } = this.cameras.main;
        this.background = this.add.image(width / 2, height / 2, "background");
        this.background.setDisplaySize(width, height);
        this.background.setAlpha(0.5);

        this.gameOverText = this.add
            .text(width / 2, height / 2, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}
