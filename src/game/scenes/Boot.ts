import { Scene } from "phaser";
import { BaseScene } from "./BaseScene";

export class Boot extends BaseScene {
    constructor() {
        super("Boot");
    }

    preload() {}

    create() {
        this.scene.start("Preloader");
    }
}
