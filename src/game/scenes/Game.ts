import { calcPx, calcScale, preferences } from "@/utils";
import { BaseScene } from "./BaseScene";
import BlindCard from "../ui/BlindCard";
import { BlindCardsType, BlindsType, PlayingCardClickMode } from "@/types";
import { GameData } from "@/config";
import Random from "@xiaokaixuan/random";
import { cloneDeep } from "lodash";
import { PlayingCard } from "../entities/PlayingCard";
import { Actions } from "phaser";
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
    constructor() {
        super("Game");
    }

    preload() {}

    async create() {
        this.cameraWidth = this.cameras.main.width;
        this.cameraHeight = this.cameras.main.height;
        this.gameData = await preferences.getItem("gameData");

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
}
