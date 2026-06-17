import { calcPx, calcScale, preferences } from "@/utils";
import { BaseScene } from "./BaseScene";
import BlindCard from "../ui/BlindCard";
import {
    BlindCardTypes,
    BlindNames,
    IPlayingCard,
    PlayingCardClickModes,
} from "@/types";
import { GameData } from "@/types";
import Random from "@xiaokaixuan/random";
import { cloneDeep } from "lodash";
import { PlayingCard } from "../entities/PlayingCard";
import { Actions, Math } from "phaser";
import { BalatroBackground } from "@/game/entities/shaders/BalatroBackground";
import { AudioManager } from "../manager/AudioManager";
import { BlindsDataMap } from "@/config";

export class Game extends BaseScene {
    bigBlindCard: BlindCard;
    smallBlindCard: BlindCard;
    bossBlindCard: BlindCard;
    gameData: GameData;
    private cameraWidth: number;
    private cameraHeight: number;
    handPlayCardsContainer: Phaser.GameObjects.Container;
    /**
     * 当前牌堆
     */
    currentDeck: IPlayingCard[] = [];
    /**
     * 手牌的卡牌实体数组
     */
    handPlayingCards: PlayingCard[] = [];
    private bgShader: BalatroBackground;
    playCardsContainerWidth: number;
    playCardsContainerHeight: number;
    random: Random = new Random();
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
            blindName: BlindNames.SmallBlind,
            CardsType:
                this.gameData.historyBlinds[this.gameData.round - 1]
                    ?.CardsType ||
                (this.gameData.round % 3 === 0
                    ? BlindCardTypes.Active
                    : BlindCardTypes.Next),
            chooseBtnClick: async () => {
                await this.hideBlindCards();
                this.startNextRound();
            },
            ante: this.gameData.ante,
            stakeName: this.gameData.stake,
        });
        this.bigBlindCard = new BlindCard({
            scene: this,
            blindName: BlindNames.BigBlind,
            CardsType:
                this.gameData.historyBlinds[this.gameData.round - 1]
                    ?.CardsType ||
                (this.gameData.round % 3 === 1
                    ? BlindCardTypes.Active
                    : BlindCardTypes.Next),
            ante: this.gameData.ante,
            stakeName: this.gameData.stake,
        });

        this.bossBlindCard = new BlindCard({
            scene: this,
            blindName: this.random.pick(
                Object.entries(BlindsDataMap).filter((blind) => blind[1].boss),
            )[0] as BlindNames,
            CardsType:
                this.gameData.historyBlinds[this.gameData.round - 1]
                    ?.CardsType ||
                (this.gameData.round % 3 === 2
                    ? BlindCardTypes.Active
                    : BlindCardTypes.Next),
            ante: this.gameData.ante,
            stakeName: this.gameData.stake,
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

    /**
     * 开始下一回合
     */
    async startNextRound() {
        this.createUiWithinRound();
        this.gameData.round++;
    }

    /**
     * 创建回合内的UI
     */
    createUiWithinRound() {
        const Bg = this.add
            .rectangle(
                0,
                0,
                this.playCardsContainerWidth,
                this.playCardsContainerHeight,
                0xffffff,
                0.5,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        this.handPlayCardsContainer = this.add.container(
            calcPx(this.cameraWidth, 887) + calcPx(this.cameraWidth, 1087) / 2,
            this.cameraHeight + calcPx(this.cameraWidth, 253) / 2,

            [Bg],
        );

        this.tweens.add({
            targets: this.handPlayCardsContainer,
            y:
                this.cameraHeight -
                calcPx(this.cameraWidth, 261) -
                calcPx(this.cameraWidth, 253) / 2,
            duration: 200,
            ease: "Back.easeOut",
            onComplete: () => {
                // 进入游戏 抽满手牌上限
                this.drawHandPlayingCards();
            },
        });
    }

    /**
     * 抽手牌卡牌
     * @param num 抽取的牌数
     */
    async drawHandPlayingCards(num: number = this.gameData.handLimit) {
        // 被抽取的扑克牌
        let drawnCards = [];

        if (this.currentDeck.length >= num) {
            drawnCards = this.currentDeck.splice(0, num);
        } else {
            drawnCards = cloneDeep(this.currentDeck);
            this.currentDeck = [];
            this.currentDeck = this.random.shuffle(this.gameData.completeDeck);
            drawnCards = drawnCards.concat(
                this.currentDeck.splice(0, num - drawnCards.length),
            );
        }
        await this.createHandPlayingCards(drawnCards);
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

    /**
     * 创建手牌卡牌
     * @param playingCards 手牌卡牌数组
     */
    async createHandPlayingCards(playingCards: IPlayingCard[]) {
        this.handPlayingCards = this.handPlayingCards.concat(
            playingCards.map((item, idx) => {
                const itemPlayingCard = new PlayingCard(
                    item.suit,
                    item.value,
                    false,
                );

                itemPlayingCard.addToScene({
                    scene: this,
                    x:
                        this.playCardsContainerWidth / 2 +
                        calcPx(this.cameraWidth, 140),
                    y: this.playCardsContainerHeight / 2,
                    clickMode: PlayingCardClickModes.select,
                    enableDrag: true,
                });
                if (itemPlayingCard.container) {
                    itemPlayingCard.setScale(
                        calcScale(
                            this.cameraWidth,
                            itemPlayingCard.container.displayWidth,
                            180,
                        ),
                    );
                    // itemPlayingCard.container.x =
                    //     this.getHandPlayingCardXByIndex(itemPlayingCard, idx);
                }
                itemPlayingCard.setDragCallbacks({
                    onDragStart: (card) => {
                        if (!card.container) {
                            return;
                        }
                        // 拖拽开始时，将卡片移动到最前面
                        this.handPlayCardsContainer.moveTo(
                            card.container,
                            this.handPlayCardsContainer.count("active", true) -
                                1,
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

                        this.handPlayCardsContainer.moveTo(
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

                if (itemPlayingCard.container) {
                    const percent = ((idx + 1) / playingCards.length) * 100;

                    console.log(666, percent, 0.85 + (percent * 0.2) / 100);
                    this.handPlayCardsContainer.add(itemPlayingCard.container!);

                    this.tweens.add({
                        targets: itemPlayingCard.container,
                        y: 0,
                        x: this.getHandPlayingCardXByIndex(
                            itemPlayingCard,
                            idx,
                        ),
                        duration: 100,
                        delay: idx * 100,
                        ease: "Back.easeOut",
                        onComplete: () => {},
                        onStart: () => {
                            AudioManager.getInstance().playSound(
                                this.scene.key,
                                "card1",
                                {
                                    volume: 0.6,
                                    rate: 0.85 + (percent * 0.2) / 100,
                                },
                            );
                            itemPlayingCard.flip();
                        },
                    });
                }

                return itemPlayingCard;
            }),
        );
    }

    update(_time: number, delta: number): void {
        if (this.bgShader) {
            this.bgShader.update(delta);
        }
    }
}
