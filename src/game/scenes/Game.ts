import { calcPx, calcScale, preferences } from "@/utils";
import { BaseScene } from "./BaseScene";
import BlindCard from "../ui/BlindCard";
import { BlindCardsType, BlindsType, PlayingCardClickMode } from "@/types";
import { GameData } from "@/config";
import Random from "@xiaokaixuan/random";
import { cloneDeep } from "lodash";
import { PlayingCard } from "../entities/PlayingCard";
import { Actions, Math } from "phaser";
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
    handPlayingCards: PlayingCard[];
    private bgShader: BalatroBackground;
    playCardsContainerWidth: number;
    playCardsContainerHeight: number;
    constructor() {
        super("Game");
    }

    preload() {}

    async create() {
        this.cameraWidth = this.cameras.main.width;
        this.cameraHeight = this.cameras.main.height;

        this.playCardsContainerWidth = calcPx(this.cameraWidth, 1087);
        this.playCardsContainerHeight = calcPx(this.cameraWidth, 253);

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
        this.playCardsContainer = this.add.container(
            calcPx(this.cameraWidth, 887) + calcPx(this.cameraWidth, 1087) / 2,
            this.cameraHeight -
                calcPx(this.cameraWidth, 261) -
                calcPx(this.cameraWidth, 253) / 2,
        );

        const groupBg = this.add.rectangle(
            0,
            0,
            this.playCardsContainerWidth,
            this.playCardsContainerHeight,
            0xffffff,
            0.5,
        );
        groupBg.setRounded(calcPx(this.cameraWidth, 12));
        this.playCardsContainer.addAt(groupBg, 0);

        const random = new Random();
        this.tempPlayingCards = random.shuffle(this.gameData.playingCard);

        this.createHandPlayingCards(
            this.tempPlayingCards.splice(0, this.gameData.handLimit),
        );

        this.playCardsContainer.add(
            this.handPlayingCards.map((card) => card.container!),
        );
        this.gameData.round++;

        await preferences.setItem("gameData", this.gameData);
    }

    getHandPlayingCardXByIndex(card: PlayingCard, idx: number) {
        if (!card.container) {
            throw new Error("card.container is null");
        }
        const playingCardWidth = card.dragging
            ? card.container.displayWidth / card.pickupMagnification
            : card.container.displayWidth;
        return (
            -this.playCardsContainerWidth / 2 +
            playingCardWidth / 2 +
            (idx * (this.playCardsContainerWidth - playingCardWidth)) /
                (this.gameData.handLimit - 1)
        );
    }

    getHandPlayingCardIndexByX(card: PlayingCard, x: number) {
        if (!card.container) {
            throw new Error("card.container is null");
        }

        // 当前操作的卡牌宽度
        const currentCardWidth = card.container.displayWidth;

        // 其他卡牌宽度
        const othersCardWidth = card.dragging
            ? card.container.displayWidth / card.pickupMagnification
            : currentCardWidth;

        // 当前拿起的扑克牌的最左侧
        const leftX = x - currentCardWidth / 2;

        // 原始位置的最左侧
        const originalLeftX = card.originalX - othersCardWidth / 2;

        // 当前拿起的卡牌相对于最右侧卡牌的偏移量像素 0代表恰好和最右侧卡牌 左侧对齐
        const cardOffsetX =
            leftX - (this.playCardsContainerWidth / 2 - othersCardWidth);

        // 当前拿起的卡牌相对于最右侧卡牌的偏移卡牌数量 -1代表相对于最右侧卡牌恰好向左偏移一张
        const cardOffsetNum =
            cardOffsetX /
            ((this.playCardsContainerWidth - othersCardWidth) /
                (this.gameData.handLimit - 1));

        let index: number;
        if (cardOffsetNum >= 0) {
            index = this.gameData.handLimit - 1;
        } else {
            index =
                this.gameData.handLimit - 1 + window.Math.floor(cardOffsetNum);
        }

        // 上面的逻辑是针对往右挪动的情况 如果往左挪 则需要+1
        // 因为往右挪 对比的是当前操作卡牌的左侧和原始位置索引卡牌的左侧 往左挪则需要对比当前操作卡牌的右侧和原始位置-1索引卡牌的左侧
        if (leftX - originalLeftX < 0) {
            index++;
        }

        // 索引不能小于0
        if (index < 0) {
            index = 0;
        }

        return index;
    }

    async createHandPlayingCards(
        playingCards: import("@/types").PlayingCard[],
    ) {
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
                        this.getHandPlayingCardXByIndex(itemPlayingCard, idx);
                }
                itemPlayingCard.setDragCallbacks({
                    onDragStart: (card) => {
                        if (!card.container) {
                            return;
                        }
                        // 拖拽开始时，将卡片移动到最前面
                        this.playCardsContainer.moveTo(
                            card.container,
                            this.playCardsContainer.count("active", true) - 1,
                        );
                    },
                    onDragEnd: (card) => {
                        if (!card.container) {
                            return;
                        }
                        // 找到当前卡牌在 handPlayingCards 中的索引 并+1
                        // +1是因为 索引0是背景
                        const targetIndex =
                            this.handPlayingCards.findIndex(
                                (item) => item.container === card.container,
                            ) + 1;

                        this.playCardsContainer.moveTo(
                            card.container,
                            targetIndex,
                        );
                    },
                    canDrop: (card, currentX, currentY, targetX, targetY) => {
                        if (!card.container) {
                            return false;
                        }
                        // 计算目标索引
                        const targetIndex = this.getHandPlayingCardIndexByX(
                            card,
                            targetX,
                        );

                        // 计算应该吸附到的x坐标
                        const x = this.getHandPlayingCardXByIndex(
                            card,
                            targetIndex,
                        );

                        // 返回吸附位置，y坐标拖拽前的y 因为可能拖拽前就是被选中的
                        return {
                            x,
                            y: card.originalY,
                        };
                    },
                    onDragMove: (
                        card,
                        currentX,
                        currentY,
                        targetX,
                        targetY,
                    ) => {
                        if (!card.container) {
                            return;
                        }
                        // 计算当前拖拽卡牌所在x对应的手牌索引
                        const targetIndex = this.getHandPlayingCardIndexByX(
                            card,
                            targetX,
                        );

                        // 找到当前卡牌在 handPlayingCards 中的索引
                        const currentIndex = this.handPlayingCards.findIndex(
                            (item) => item.container === card.container,
                        );

                        // 如果targetIndex与当前索引不同，且在有效范围内，移动其他卡牌
                        // 不用操作其他卡牌再container中的索引 因为他们本来就是有顺序的
                        if (
                            targetIndex !== currentIndex &&
                            targetIndex >= 0 &&
                            targetIndex < this.handPlayingCards.length
                        ) {
                            // 移除当前卡牌
                            this.handPlayingCards.splice(currentIndex, 1);

                            // 插入到目标位置
                            this.handPlayingCards.splice(targetIndex, 0, card);

                            // 更新其他卡牌的位置
                            this.handPlayingCards.forEach((item, index) => {
                                if (!item.container) {
                                    return;
                                }
                                const itemTargetX =
                                    this.getHandPlayingCardXByIndex(
                                        item,
                                        index,
                                    );
                                // 如果当前卡牌不是当前拖拽的卡牌，且目标卡牌需要移动
                                if (
                                    item !== card &&
                                    itemTargetX !== item.container.x
                                ) {
                                    // 使用动画移动卡牌
                                    this.tweens.add({
                                        targets: item.container,
                                        x: itemTargetX,
                                        duration: 150,
                                        ease: "Back.easeOut",
                                    });
                                }
                            });
                        }
                    },
                });

                return itemPlayingCard;
            });
    }

    update(_time: number, delta: number): void {
        if (this.bgShader) {
            this.bgShader.update(delta);
        }
    }
}
