import { BlindCardTypes, BlindNames, StakeNames } from "@/types";
import { calcPx, calcScale } from "@/utils";
import { GameObjects } from "phaser";
import { createButton } from ".";
import { anteScoreArray, blindCardsBtnTextMap, BlindsDataMap } from "@/config";
import BigNumber from "bignumber.js";
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
    ante: number;
    stakeName: StakeNames;

    constructor({
        scene,
        blindName,
        CardsType = BlindCardTypes.Next,
        chooseBtnClick = () => {},
        ante = 0,
        stakeName = StakeNames.WhiteStake,
    }: {
        scene: Phaser.Scene;
        blindName: BlindNames;
        CardsType?: BlindCardTypes;
        chooseBtnClick?: () => void;
        ante?: number;
        stakeName?: StakeNames;
    }) {
        super(scene);
        this.ante = ante;
        this.stakeName = stakeName;
        this.currentScene = scene;
        this.CardsType = CardsType;
        this.chooseBtnClick = chooseBtnClick;

        this.cameraWidth = scene.cameras.main.width;
        this.cameraHeight = scene.cameras.main.height;
        this.cardWidth = calcPx(this.cameraWidth, 370);
        this.cardHeight = calcPx(this.cameraWidth, 874);
        this.spacing = calcPx(this.cameraWidth, 44);
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

        const cradShadow = this.currentScene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 360),
                calcPx(this.cameraWidth, 870),
            )
            .setRounded(calcPx(this.cameraWidth, 16))
            .setStrokeStyle(calcPx(this.cameraWidth, 4), 0x000000, 0.1);

        const colorBorder = this.currentScene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 344),
                calcPx(this.cameraWidth, 862),
            )
            .setRounded(calcPx(this.cameraWidth, 16))
            .setStrokeStyle(
                calcPx(this.cameraWidth, 8),
                this.blindName === BlindNames.SmallBlind
                    ? 0x1478b4
                    : this.blindName === BlindNames.BigBlind
                      ? 0xab7b1b
                      : parseInt(
                            (
                                BlindsDataMap[this.blindName]
                                    .boss_colour as string
                            ).replace(/^#/, ""),
                            16,
                        ),
            );

        const cardBg = this.currentScene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 344),
                calcPx(this.cameraWidth, 862),
                0x454f51,
            )
            .setRounded(calcPx(this.cameraWidth, 16));

        const blindInfoBorder = this.currentScene.add
            .rectangle(
                0,
                -this.cardHeight / 2 +
                    calcPx(this.cameraWidth, 22) +
                    calcPx(this.cameraWidth, 530) / 2,
                calcPx(this.cameraWidth, 314),
                calcPx(this.cameraWidth, 520),
            )
            .setRounded(calcPx(this.cameraWidth, 12))
            .setStrokeStyle(calcPx(this.cameraWidth, 5), 0x4f6368);

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

        // @todo: 改样式
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

        //  const value =this.blindName === BlindNames.SmallBlind
        //                     ? 0x1478b4
        //                     : this.blindName === BlindNames.BigBlind
        //                       ? 0xab7b1b
        //                       : parseInt(
        //                             (
        //                                 BlindsDataMap[this.blindName]
        //                                     .boss_colour as string
        //                             ).replace(/^#/, ""),
        //                             16,
        //                         )

        const minScoreText = this.currentScene.add
            .text(
                0,
                -this.cardHeight / 2 + calcPx(this.cameraWidth, 444),
                // @todo 后续调整 赌注类型和底注分数关系
                // @ts-ignore
                (anteScoreArray[this.ante][this.stakeName] as BigNumber)
                    .times(BlindsDataMap[this.blindName].mult)
                    .toString(),
                {
                    fontSize: calcPx(this.cameraWidth, 34),
                    color: "#fff",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5);

        this.container.add([
            cradShadow,
            colorBorder,
            cardBg,
            blindInfoBorder,
            chooseBtn,
            blindNameText,
            this.blindChip,
            minScoreText,
        ]);

        if (this.CardsType !== BlindCardTypes.Active) {
            this.container.setAlpha(0.8);
        }

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
                calcPx(this.cameraWidth, 266) +
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

        // 68 / 64 是因为每一帧的内容是64*64 有2px的内边距
        this.blindChip.setScale(
            calcScale(this.cameraWidth, this.blindChip.width, 128) * (68 / 64),
        );
        console.log("666x", this.blindChip.displayWidth);
        this.blindChip.play(key);
    }
}
