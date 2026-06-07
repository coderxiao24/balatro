import { BlindsType } from "@/types";
import { calcPx } from "@/utils";
import { GameObjects } from "phaser";
import { createButton } from ".";

export default class BlindCard extends GameObjects.Container {
    public container: GameObjects.Container;
    public active: boolean;
    private currentScene: Phaser.Scene;

    private cameraWidth: number;
    private cameraHeight: number;
    private cardWidth: number;
    private cardHeight: number;
    private spacing: number;
    private index: number;

    constructor({
        scene,
        blindsType,
        active = false,
    }: {
        scene: Phaser.Scene;
        blindsType: BlindsType;
        active?: boolean;
    }) {
        super(scene);
        this.currentScene = scene;
        this.active = active;
        this.cameraWidth = scene.cameras.main.width;
        this.cameraHeight = scene.cameras.main.height;
        this.cardWidth = calcPx(this.cameraWidth, 360);
        this.cardHeight = calcPx(this.cameraWidth, 874);
        this.spacing = calcPx(this.cameraWidth, 50);
        this.index =
            blindsType === BlindsType.SmallBlind
                ? 0
                : blindsType === BlindsType.BigBlind
                  ? 1
                  : 2;
    }
    addToScene() {
        const containerX =
            calcPx(this.cameraWidth, 888) +
            this.cardWidth / 2 +
            this.index * (this.spacing + this.cardWidth);
        const containerY =
            this.cameraHeight -
            this.cardHeight / 2 +
            (this.active ? 0 : calcPx(this.cameraWidth, 72));

        this.container = this.currentScene.add.container(
            containerX,
            this.cameraHeight + this.cardHeight / 2,
        );

        const chooseBtn = createButton(
            this.currentScene,
            0,
            -this.cardHeight / 2 +
                calcPx(this.cameraWidth, 40) +
                calcPx(this.cameraWidth, 116) / 2,
            calcPx(this.cameraWidth, 260),
            calcPx(this.cameraWidth, 116),
            0xfd9a10,
            "选择",
            calcPx(this.cameraWidth, 50),
            () => {},
        );
        this.container.add([chooseBtn]);
        const groupBg = this.currentScene.add.rectangle(
            0,
            0,
            this.cardWidth,
            this.cardHeight,
            0x474f51,
        );
        groupBg.setRounded(calcPx(this.cameraWidth, 16));
        this.container.addAt(groupBg, 0);

        this.currentScene.tweens.add({
            targets: this.container,
            y: containerY,
            duration: 200,
            ease: "Back.easeOut",
            onComplete: () => {},
        });
    }
}
