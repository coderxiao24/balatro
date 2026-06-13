import { BlindCardTypes, BlindNames } from "@/types";
import { calcPx, calcScale } from "@/utils";
import { GameObjects } from "phaser";
import { createButton } from ".";
import { blindCardsBtnTextMap, BlindsDataMap } from "@/config";

export default class BlindCard extends GameObjects.Container {
    container: GameObjects.Container;
    CardsType: BlindCardTypes;

    chooseBtnClick: () => void;

    private currentScene: Phaser.Scene;
    private blindName: BlindNames;

    private cameraWidth: number;
    private cameraHeight: number;
    private cardWidth: number;
    private cardHeight: number;
    private spacing: number;
    private index: number;
    blindChip: GameObjects.Sprite;

    constructor({
        scene,
        blindName,
        CardsType = BlindCardTypes.Next,
        chooseBtnClick = () => {},
    }: {
        scene: Phaser.Scene;
        blindName: BlindNames;
        CardsType?: BlindCardTypes;
        chooseBtnClick?: () => void;
    }) {
        super(scene);
        this.currentScene = scene;
        this.CardsType = CardsType;
        this.chooseBtnClick = chooseBtnClick;

        this.cameraWidth = scene.cameras.main.width;
        this.cameraHeight = scene.cameras.main.height;
        this.cardWidth = calcPx(this.cameraWidth, 360);
        this.cardHeight = calcPx(this.cameraWidth, 874);
        this.spacing = calcPx(this.cameraWidth, 50);
        this.blindName = blindName;

        this.index =
            blindName === BlindNames.SmallBlind
                ? 0
                : blindName === BlindNames.BigBlind
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
            (this.CardsType !== BlindCardTypes.Active
                ? calcPx(this.cameraWidth, 72)
                : 0);

        this.container = this.currentScene.add.container(
            containerX,
            this.cameraHeight + this.cardHeight / 2,
        );

        const groupBg = this.currentScene.add.rectangle(
            0,
            0,
            this.cardWidth,
            this.cardHeight,
            0x474f51,
        );
        groupBg.setRounded(calcPx(this.cameraWidth, 16));

        const chooseBtn = createButton(
            this.currentScene,
            0,
            -this.cardHeight / 2 +
                calcPx(this.cameraWidth, 40) +
                calcPx(this.cameraWidth, 116) / 2,
            calcPx(this.cameraWidth, 260),
            calcPx(this.cameraWidth, 116),
            0xfd9a10,
            blindCardsBtnTextMap[this.CardsType],
            calcPx(this.cameraWidth, 50),
            this.chooseBtnClick,
            this.CardsType !== BlindCardTypes.Active,
        );

        const blindNameText = this.currentScene.add
            .text(
                0,
                -this.cardHeight / 2 +
                    calcPx(this.cameraWidth, 184) +
                    calcPx(this.cameraWidth, 50) / 2,
                BlindsDataMap[this.blindName].name,
                {
                    fontSize: calcPx(this.cameraWidth, 34),
                    color: "#fff",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5);

        this.createBlindChip();

        this.container.add([groupBg, chooseBtn, blindNameText, this.blindChip]);

        this.currentScene.tweens.add({
            targets: this.container,
            y: containerY,
            duration: 200,
            ease: "Back.easeOut",
            onComplete: () => {},
        });
    }

    // 隐藏
    async hide() {
        return new Promise<void>((resolve, reject) => {
            this.currentScene.tweens.add({
                targets: this.container,
                y: this.cameraHeight + this.cardHeight / 2,
                duration: 200,
                ease: "Back.easeOut",
                onComplete: () => {
                    this.container.destroy();
                    resolve();
                },
            });
        });
    }

    createBlindChip() {
        this.blindChip = this.currentScene.add.sprite(
            0,
            -this.cardHeight / 2 +
                calcPx(this.cameraWidth, 264) +
                calcPx(this.cameraWidth, 128) / 2,
            "BlindChips",
        );
        const frames = this.currentScene.anims.generateFrameNumbers(
            "BlindChips",
            {
                start: BlindsDataMap[this.blindName].pos.y * 21,
                end: BlindsDataMap[this.blindName].pos.y * 21 + 20,
            },
        );
        const key = `${this.blindName}-ChipLoop`;
        this.currentScene.anims.create({
            key,
            frames: frames,
            frameRate: 12,
            repeat: -1,
        });
        this.blindChip.setScale(
            calcScale(this.cameraWidth, this.blindChip.displayWidth, 128),
        );
        this.blindChip.play(key);
    }
}
