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
import { BlindsDataMap, SUIT_RANK_MAP } from "@/config";
import { createButton } from "../ui";

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
    deckContainer: Phaser.GameObjects.Container;
    handPlayingCardsNumberText: Phaser.GameObjects.Text;
    currentDeckCardsNumberText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    preload() {}

    async create() {
        this.cameraWidth = this.cameras.main.width;
        this.cameraHeight = this.cameras.main.height;

        this.playCardsContainerWidth = calcPx(this.cameraWidth, 1187);
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

        this.currentDeck = this.random.shuffle(this.gameData.completeDeck);
        this.createOrUpdateDeckContainer();

        this.currentDeckCardsNumberText = this.add
            .text(
                this.cameraWidth - calcPx(this.cameraWidth, 384),
                this.cameraHeight - calcPx(this.cameraWidth, 52),
                `${this.currentDeck.length}/${this.gameData.completeDeck.length}`,
                {
                    fontSize: calcPx(this.cameraWidth, 20),
                    color: "#fff",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(1, 1);
    }
    createOrUpdateDeckContainer() {
        // 1. 计算牌堆比例并确定当前需要展示的牌数
        const totalCards = this.gameData.completeDeck?.length || 0;
        const currentCards = this.currentDeck?.length || 0;

        // 如果总牌数为0，防止除以0报错，默认展示0张
        const ratio = totalCards > 0 ? currentCards / totalCards : 0;
        const cardCount = window.Math.max(
            0,
            window.Math.min(6, window.Math.ceil(ratio * 6)),
        );
        // 2. 容器的基准坐标（居中点）
        const containerX =
            calcPx(this.cameraWidth, 2105) + calcPx(this.cameraWidth, 182) / 2;
        const containerY =
            calcPx(this.cameraWidth, 880) + calcPx(this.cameraWidth, 248) / 2;

        // 3. 如果容器已存在，先清空旧内容（防止重复创建导致内存泄漏）
        if (this.deckContainer) {
            this.deckContainer.removeAll(true); // true 表示销毁子对象
            this.deckContainer.setPosition(containerX, containerY);
        } else {
            this.deckContainer = this.add.container(containerX, containerY);
        }

        // 4. 如果当前不需要展示牌，直接返回
        if (cardCount === 0) return;

        // 5. 动态生成对应数量的牌
        const children = new Array(cardCount)
            .fill(null)
            .map((_, idx) => {
                const deckCard = new PlayingCard(undefined, undefined, false);
                deckCard.addToScene({
                    scene: this,
                    x: calcPx(this.cameraWidth, idx * 3),
                    y: calcPx(this.cameraWidth, -idx * 5),
                });

                if (deckCard.container) {
                    deckCard.setScale(
                        calcScale(
                            this.cameraWidth,
                            deckCard.container.displayWidth,
                            182,
                        ) *
                            (182 / 178),
                    );
                }
                return deckCard.container!;
            })
            .filter(Boolean); // 过滤掉可能的 null 值

        // 6. 将生成的牌添加到容器中
        this.deckContainer.add(children);
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
                0x000000,
                0.1,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        this.handPlayingCardsNumberText = this.add
            .text(
                0,
                this.playCardsContainerHeight / 2 + calcPx(this.cameraWidth, 5),
                `0/${this.gameData.handLimit}`,
                {
                    fontSize: calcPx(this.cameraWidth, 20),
                    color: "#fff",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5, 0);

        this.handPlayCardsContainer = this.add.container(
            calcPx(this.cameraWidth, 887) + this.playCardsContainerWidth / 2,
            this.cameraHeight + this.playCardsContainerHeight / 2,
            [Bg, this.handPlayingCardsNumberText],
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

        const organizingCardsBorder = this.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 294),
                calcPx(this.cameraWidth, 134),
            )
            .setRounded(calcPx(this.cameraWidth, 12))
            .setStrokeStyle(calcPx(this.cameraWidth, 7), 0xffffff);

        const organizingCardsText = this.add
            .text(
                0,
                -calcPx(this.cameraWidth, 148) / 2 +
                    calcPx(this.cameraWidth, 8),
                "理牌",
                {
                    fontSize: calcPx(this.cameraWidth, 28),
                    color: "#fff",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5, 0);

        const pointButton = createButton(
            this,
            -calcPx(this.cameraWidth, 308) / 2 +
                calcPx(this.cameraWidth, 24) +
                calcPx(this.cameraWidth, 126) / 2,
            -calcPx(this.cameraWidth, 148) / 2 +
                calcPx(this.cameraWidth, 46) +
                calcPx(this.cameraWidth, 78) / 2,
            calcPx(this.cameraWidth, 126),
            calcPx(this.cameraWidth, 78),
            0xfca210,
            "点数",
            calcPx(this.cameraWidth, 24),
            () => {
                this.organizeHandPlayingCards("point");
            },
        );
        const suitButton = createButton(
            this,
            calcPx(this.cameraWidth, 308) / 2 -
                calcPx(this.cameraWidth, 24) -
                calcPx(this.cameraWidth, 126) / 2,
            -calcPx(this.cameraWidth, 148) / 2 +
                calcPx(this.cameraWidth, 46) +
                calcPx(this.cameraWidth, 78) / 2,
            calcPx(this.cameraWidth, 126),
            calcPx(this.cameraWidth, 78),
            0xfca210,
            "花色",
            calcPx(this.cameraWidth, 24),
            () => {
                this.organizeHandPlayingCards("suit");
            },
        );

        // 理牌按钮容器
        const organizingCardsContainer = this.add.container(
            calcPx(this.cameraWidth, 1326) + calcPx(this.cameraWidth, 308) / 2,
            this.cameraHeight -
                calcPx(this.cameraWidth, 72) -
                calcPx(this.cameraWidth, 148) / 2,
            [
                organizingCardsBorder,
                organizingCardsText,
                pointButton,
                suitButton,
            ],
        );

        // 出牌按钮
        const playPlayingCardsButton = createButton(
            this,
            calcPx(this.cameraWidth, 1074) + calcPx(this.cameraWidth, 242) / 2,
            this.cameraHeight -
                calcPx(this.cameraWidth, 78) -
                calcPx(this.cameraWidth, 142) / 2,
            calcPx(this.cameraWidth, 242),
            calcPx(this.cameraWidth, 142),
            0x0b9dfb,
            "出牌",
            calcPx(this.cameraWidth, 34),
            () => {},
        );

        // 弃牌按钮
        const discardPlayingCardsButton = createButton(
            this,
            this.cameraWidth -
                calcPx(this.cameraWidth, 783) -
                calcPx(this.cameraWidth, 242) / 2,
            this.cameraHeight -
                calcPx(this.cameraWidth, 78) -
                calcPx(this.cameraWidth, 142) / 2,
            calcPx(this.cameraWidth, 242),
            calcPx(this.cameraWidth, 142),
            0xfc5f54,
            "弃牌",
            calcPx(this.cameraWidth, 34),
            () => {},
        );
    }

    organizeHandPlayingCards(type: "point" | "suit") {
        if (type === "point") {
            this.handPlayingCards.sort((a, b) => b.rank - a.rank);
            this.handPlayingCards.forEach((card, idx) => {
                if (!card.container) return;
                this.tweens.add({
                    targets: card.container,
                    x: this.getHandPlayingCardXByIndex(card, idx),
                    duration: 200,
                    ease: "Back.easeOut",
                    onComplete: () => {
                        if (!card.container) return;
                        this.handPlayCardsContainer.moveTo(
                            card.container,
                            idx + 2,
                        );
                    },
                });
            });
        } else {
            this.handPlayingCards.sort((a, b) => {
                // 先比花色权重
                const suitDiff =
                    (SUIT_RANK_MAP[b.suit] || 0) - (SUIT_RANK_MAP[a.suit] || 0);
                if (suitDiff !== 0) return suitDiff;

                //  花色相同，再比点数
                return b.rank - a.rank;
            });
            this.handPlayingCards.forEach((card, idx) => {
                if (!card.container) return;
                this.tweens.add({
                    targets: card.container,
                    x: this.getHandPlayingCardXByIndex(card, idx),
                    duration: 200,
                    ease: "Back.easeOut",
                    onComplete: () => {
                        if (!card.container) return;
                        this.handPlayCardsContainer.moveTo(
                            card.container,
                            idx + 2,
                        );
                    },
                });
            });
        }
    }

    /**
     * 抽手牌卡牌
     * @param num 抽取的牌数
     */
    async drawHandPlayingCards(num: number = this.gameData.handLimit) {
        for (let i = 0; i < num; i++) {
            let drawnCard: IPlayingCard;
            if (this.currentDeck.length) {
                drawnCard = this.currentDeck.shift()!;
            } else {
                // 牌堆已经空了 重新洗牌补充牌堆
                this.currentDeck = this.random.shuffle(
                    this.gameData.completeDeck,
                );
                drawnCard = this.currentDeck.shift()!;
            }
            this.handPlayingCards.push(
                await this.createHandPlayingCard(drawnCard),
            );
            this.handPlayingCardsNumberText.setText(
                `${this.handPlayingCards.length}/${this.gameData.handLimit}`,
            );
            this.currentDeckCardsNumberText.setText(
                `${this.currentDeck.length}/${this.gameData.completeDeck.length}`,
            );
            this.createOrUpdateDeckContainer();
        }

        //手牌就位后，启用事件监听
        this.enableHandPlayingCardsEvent();
        // 默认按点数排序
        this.organizeHandPlayingCards("point");
    }
    enableHandPlayingCardsEvent() {
        this.handPlayingCards.forEach((itemPlayingCard) => {
            itemPlayingCard.setClickMode(PlayingCardClickModes.select);
            itemPlayingCard.setEnableDrag(true);
            itemPlayingCard.setDragCallbacks({
                onDragStart: (card) => {
                    if (!card.container) {
                        return;
                    }
                    // 拖拽开始时，将卡片移动到最前面
                    this.handPlayCardsContainer.moveTo(
                        card.container,
                        this.handPlayCardsContainer.count("active", true) - 1,
                    );
                },
                onDragEnd: (card) => {
                    if (!card.container) {
                        return;
                    }
                    // 找到当前卡牌在 handPlayingCards 中的索引 并+2
                    // +2是因为 索引0是背景，1是牌数文本
                    const targetIndex =
                        this.handPlayingCards.findIndex(
                            (item) => item.container === card.container,
                        ) + 2;

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
                onDragMove: (card, currentX, currentY, targetX, targetY) => {
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
                            const itemTargetX = this.getHandPlayingCardXByIndex(
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
        });
    }

    getHandPlayingCardXByIndex(card: PlayingCard, idx: number) {
        if (!card.container) {
            throw new Error("card.container is null");
        }
        // 正常卡牌宽度
        const normalPlayingCardWidth = card.container.width * card.scale;

        return (
            -this.playCardsContainerWidth / 2 +
            normalPlayingCardWidth / 2 +
            (idx * (this.playCardsContainerWidth - normalPlayingCardWidth)) /
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
        const normalPlayingCardWidth = card.container.width * card.scale;

        // 当前拿起的扑克牌的最左侧
        const leftX = x - currentCardWidth / 2;

        // 原始位置的最左侧
        const originalLeftX = card.originalX - normalPlayingCardWidth / 2;

        // 当前拿起的卡牌相对于最右侧卡牌的偏移量像素 0代表恰好和最右侧卡牌 左侧对齐
        const cardOffsetX =
            leftX - (this.playCardsContainerWidth / 2 - normalPlayingCardWidth);

        // 当前拿起的卡牌相对于最右侧卡牌的偏移卡牌数量 -1代表相对于最右侧卡牌恰好向左偏移一张
        const cardOffsetNum =
            cardOffsetX /
            ((this.playCardsContainerWidth - normalPlayingCardWidth) /
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
     * 创建单张手牌卡牌
     * @param playingCards 手牌卡牌数组
     */
    async createHandPlayingCard(item: IPlayingCard) {
        const itemPlayingCard = new PlayingCard(item.suit, item.value, false);

        // 获取牌堆的最后一个 Image 的世界坐标
        const targetImage = (
            this.deckContainer.getAt(
                this.deckContainer.length - 1,
            ) as Phaser.GameObjects.Container
        ).getAll()[0] as Phaser.GameObjects.Image;
        const worldMatrixA = targetImage.getWorldTransformMatrix();

        // 计算相对于 handPlayCardsContainer 的坐标
        const localPoint = this.handPlayCardsContainer.getLocalPoint(
            worldMatrixA.tx,
            worldMatrixA.ty,
        );

        itemPlayingCard.addToScene({
            scene: this,
            x: localPoint.x,
            y: localPoint.y,
        });
        if (itemPlayingCard.container) {
            itemPlayingCard.setScale(
                calcScale(
                    this.cameraWidth,
                    itemPlayingCard.container.displayWidth,
                    180,
                ) *
                    (180 / 176),
            );
        }
        if (itemPlayingCard.container) {
            const percent =
                (this.handPlayingCards.length / this.gameData.handLimit) * 100;

            this.handPlayCardsContainer.add(itemPlayingCard.container!);
            await new Promise<void>((resolve) => {
                this.tweens.add({
                    targets: itemPlayingCard.container,
                    y: 0,
                    x: this.getHandPlayingCardXByIndex(
                        itemPlayingCard,
                        this.handPlayingCards.length,
                    ),
                    duration: 100,
                    ease: "Back.easeOut",
                    onComplete: () => {
                        resolve();
                    },
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
            });
        }

        return itemPlayingCard;
    }

    update(_time: number, delta: number): void {
        if (this.bgShader) {
            this.bgShader.update(delta);
        }
    }
}
