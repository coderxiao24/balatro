import { BlindCardTypes, BlindNames, StakeNames } from "@/types";
import {
    calcPx,
    calcScale,
    darkenHexNumber,
    getScore,
    stringToHexNumber,
} from "@/utils";
import { GameObjects } from "phaser";
import { createButton } from ".";
import { blindCardsBtnTextMap, BlindsDataMap, stakeDataMap } from "@/config";

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
                      : stringToHexNumber(
                            BlindsDataMap[this.blindName].boss_colour as string,
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

        const blindNameBg = this.currentScene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 276),
                calcPx(this.cameraWidth, 40),
                darkenHexNumber(
                    this.blindName === BlindNames.SmallBlind
                        ? 0x1478b4
                        : this.blindName === BlindNames.BigBlind
                          ? 0xab7b1b
                          : stringToHexNumber(
                                BlindsDataMap[this.blindName]
                                    .boss_colour as string,
                            ),
                    0.7,
                ),
            )
            .setRounded(calcPx(this.cameraWidth, 12))
            .setStrokeStyle(
                calcPx(this.cameraWidth, 5),
                this.blindName === BlindNames.SmallBlind
                    ? 0x1478b4
                    : this.blindName === BlindNames.BigBlind
                      ? 0xab7b1b
                      : stringToHexNumber(
                            BlindsDataMap[this.blindName].boss_colour as string,
                        ),
            );

        const blindNameText = this.currentScene.add
            .text(0, 0, BlindsDataMap[this.blindName].name, {
                fontSize: calcPx(this.cameraWidth, 34),
                color: "#fff",
                fontFamily: "NotoSansSC",
            })
            .setOrigin(0.5);

        const blindNameTextGroup = this.currentScene.add.container(
            0,
            -this.cardHeight / 2 +
                calcPx(this.cameraWidth, 184) +
                calcPx(this.cameraWidth, 50) / 2,
            [blindNameBg, blindNameText],
        );

        const blindChip = this.createBlindChip();

        const stakeChipAndScoreGroup = this.createStakeChipAndScore();

        this.container.add([
            cradShadow,
            colorBorder,
            cardBg,
            blindInfoBorder,
            chooseBtn,
            blindNameTextGroup,
            blindChip,
            stakeChipAndScoreGroup,
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
    createStakeChipAndScore() {
        const stakeChipIcon = this.currentScene.add
            .image(
                0,
                0,
                "chips",
                stakeDataMap[this.stakeName].pos.x +
                    5 * stakeDataMap[this.stakeName].pos.y,
            )
            .setOrigin(0, 0.5);

        stakeChipIcon.setScale(
            calcScale(this.cameraWidth, stakeChipIcon.displayWidth, 46) *
                (58 / 54),
        );

        const scoreText = this.currentScene.add
            .text(
                stakeChipIcon.displayWidth + calcPx(this.cameraWidth, 12),
                0,
                getScore(this.ante, this.stakeName, this.blindName).toString(),
                {
                    fontSize: calcPx(this.cameraWidth, 46),
                    color: "#FC5F54",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0, 0.5);

        const group = this.currentScene.add.container(0, 0, [
            stakeChipIcon,
            scoreText,
        ]);

        const bounds = group.getBounds();

        group.x = 0 - bounds.width / 2;
        group.y = -this.cardHeight / 2 + calcPx(this.cameraWidth, 444);
        return group;
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
        const blindChip = this.currentScene.add.sprite(
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
            frameRate: 10,
            repeat: -1,
        });

        // 68 / 64 是因为每一帧的内容是64*64 有2px的内边距
        blindChip.setScale(
            calcScale(this.cameraWidth, blindChip.displayWidth, 128) *
                (68 / 64),
        );

        blindChip.play(key);
        return blindChip;
    }
}
