import { Scene } from "phaser";
import { BaseScene } from "./BaseScene";
import { setupStatusBar } from "@/utils";

setupStatusBar();
export class Boot extends BaseScene {
    constructor() {
        super("Boot");
    }

    preload() {}

    create() {
        this.scene.start("Preloader");
    }
}
