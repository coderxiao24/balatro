import { calcPx, calcScale, preferences } from "@/utils";
import { BaseScene } from "./BaseScene";
import BlindCard from "../ui/BlindCard";
import { BlindCardsType, BlindsType, PlayingCardClickMode } from "@/types";
import { GameData } from "@/config";
import Random from "@xiaokaixuan/random";
import { cloneDeep } from "lodash";
import { PlayingCard } from "../entities/PlayingCard";
import { Actions } from "phaser";
import { BalatroBackground } from "@/game/entities/shaders/BalatroBackground";
import { AudioManager } from "../manager/AudioManager";
export class Game extends BaseScene {
    bigBlindCard: BlindCard;
    smallBlindCard: BlindCard;
    bossBlindCard: BlindCard;
    gameData: GameData;
    private cameraWidth: number;
    private cameraHeight: number;
    playCardsContainer: Phaser.GameObjects.Container;
    tempPlayingCards: import("@/types").PlayingCard[];
    handPlayingCards: Phaser.GameObjects.Container[];
    private bgShader: BalatroBackground;
    constructor() {
        super("Game");
    }

    preload() {}

    async create() {
        this.cameraWidth = this.cameras.main.width;
        this.cameraHeight = this.cameras.main.height;
        this.gameData = await preferences.getItem("gameData");

        this.bgShader = new BalatroBackground(
            this,
            this.cameraWidth / 2,
            this.cameraHeight / 2,
            this.cameraWidth,
            this.cameraHeight,
            {
                colour1: [0.28, 0.47, 0.41, 1.0], // #48786A - 主色调
                colour2: [0.41, 0.68, 0.56, 1.0], // #68AE90 - 亮色调
                colour3: [0.22, 0.38, 0.31, 1.0], // #386050 - 暗色调
                contrast: 1,
                spinAmount: 0,
            },
        );
        this.add.existing(this.bgShader);

        this.smallBlindCard = new BlindCard({
            scene: this,
            blindsType: BlindsType.SmallBlind,
            CardsType:
                this.gameData.historyBlinds[this.gameData.round - 1]
                    ?.CardsType || this.gameData.round % 3 === 0
                    ? BlindCardsType.Active
                    : BlindCardsType.Next,
            chooseBtnClick: async () => {
                await this.hideBlindCards();
                this.startNextRound();
            },
        });
        this.bigBlindCard = new BlindCard({
            scene: this,
            blindsType: BlindsType.BigBlind,
            CardsType:
                this.gameData.historyBlinds[this.gameData.round - 1]
                    ?.CardsType || this.gameData.round % 3 === 1
                    ? BlindCardsType.Active
                    : BlindCardsType.Next,
        });
        this.bossBlindCard = new BlindCard({
            scene: this,
            blindsType: BlindsType.BossBlind,
            CardsType:
                this.gameData.historyBlinds[this.gameData.round - 1]
                    ?.CardsType || this.gameData.round % 3 === 2
                    ? BlindCardsType.Active
                    : BlindCardsType.Next,
        });

        AudioManager.getInstance().playSound(this.scene.key, "cancel");
        this.smallBlindCard.addToScene();
        this.bigBlindCard.addToScene();
        this.bossBlindCard.addToScene();
    }

    hideBlindCards() {
        const promises = [
            this.smallBlindCard.hide(),
            this.bigBlindCard.hide(),
            this.bossBlindCard.hide(),
        ];

        return Promise.all(promises);
    }

    async startNextRound() {
        const playCardsContainerWidth = calcPx(this.cameraWidth, 1087);
        const playCardsContainerHeight = calcPx(this.cameraWidth, 253);
        this.playCardsContainer = this.add.container(
            calcPx(this.cameraWidth, 887) + calcPx(this.cameraWidth, 1087) / 2,
            this.cameraHeight -
                calcPx(this.cameraWidth, 261) -
                calcPx(this.cameraWidth, 253) / 2,
        );

        const groupBg = this.add.rectangle(
            0,
            0,
            playCardsContainerWidth,
            playCardsContainerHeight,
            0xffffff,
            0.5,
        );
        groupBg.setRounded(calcPx(this.cameraWidth, 12));
        this.playCardsContainer.addAt(groupBg, 0);

        const random = new Random();
        this.tempPlayingCards = random.shuffle(this.gameData.playingCard);

        this.handPlayingCards = this.tempPlayingCards
            .splice(0, this.gameData.handLimit)
            .map((item, idx) => {
                const itemPlayingCard = new PlayingCard(item.suit, item.value);

                itemPlayingCard.addToScene({
                    scene: this,
                    x: 0,
                    y: 0,
                    clickMode: PlayingCardClickMode.select,
                    enableDrag: true,
                });
                if (itemPlayingCard.container) {
                    itemPlayingCard.setScale(
                        calcScale(
                            this.cameraWidth,
                            itemPlayingCard.container.width,
                            180,
                        ),
                    );
                    itemPlayingCard.container.x =
                        -playCardsContainerWidth / 2 +
                        itemPlayingCard.container.displayWidth / 2 +
                        (idx *
                            (playCardsContainerWidth -
                                itemPlayingCard.container.displayWidth)) /
                            (this.gameData.handLimit - 1);
                }
                itemPlayingCard.setDragCallbacks({
                    onDragStart: () => {
                        this.playCardsContainer.moveTo(
                            itemPlayingCard.container!,
                            this.playCardsContainer.getAll().length - 1,
                        );
                    },
                    onDragEnd: () => {
                        this.playCardsContainer.moveTo(
                            itemPlayingCard.container!,
                            idx + 1,
                        );
                    },
                    canDrop: () => false,
                });

                return itemPlayingCard.container!;
            });

        this.playCardsContainer.add(this.handPlayingCards);
        this.gameData.round++;
        // Actions.GridAlign(this.handPlayingCards, {
        //     width: 8,
        //     height: 1,
        //     cellWidth: playCardsContainerWidth / 8,
        //     cellHeight: playCardsContainerHeight,
        //     x: this.cameraWidth / 2,
        //     y: this.cameraHeight / 2,
        // });

        await preferences.setItem("gameData", this.gameData);
    }

    update(_time: number, delta: number): void {
        if (this.bgShader) {
            this.bgShader.update(delta);
        }
    }
}
