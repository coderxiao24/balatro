import {
    calcPx,
    calcScale,
    getHandTypeByPlayingCards,
    preferences,
} from "@/utils";
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
import { Actions, Display, GameObjects, Math } from "phaser";
import { BalatroBackground } from "@/game/entities/shaders/BalatroBackground";
import { AudioManager } from "../manager/AudioManager";
import { BlindsDataMap, SUIT_RANK_MAP } from "@/config";
import { GameButton } from "../ui";

export class Game extends BaseScene {
    sortType: "point" | "suit" = "point";
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

    organizingCardsContainer: GameObjects.Container;
    /**
     * 出牌按钮
     */
    playPlayingCardsButton: GameButton;
    /**
     * 弃牌按钮
     */
    discardPlayingCardsButton: GameButton;
    playedPlayingCards: PlayingCard[] = [];
    playedPlayCardsContainer: GameObjects.Container;
    playedPlayCardsContainerOriginalX: number;

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
        // 当前牌堆的牌的数量
        const currentCards = this.currentDeck?.length || 0;

        // 牌堆ui要展示的牌的数量
        const cardCount = window.Math.max(
            0,
            window.Math.ceil(currentCards / 10),
        );

        // 2. 容器的基准坐标（居中点）
        const containerX =
            calcPx(this.cameraWidth, 2105) + calcPx(this.cameraWidth, 184) / 2;
        const containerY =
            this.cameraHeight -
            calcPx(this.cameraWidth, 77) -
            this.playCardsContainerHeight / 2;

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
                            184,
                        ) *
                            (184 / 178),
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
        // 手牌容器开始
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
                this.playCardsContainerHeight / 2,
            duration: 200,
            ease: "Back.easeOut",
            onComplete: () => {
                // 进入游戏 抽满手牌上限
                this.drawHandPlayingCards();
            },
        });

        // 手牌容器结束

        this.playedPlayCardsContainerOriginalX =
            calcPx(this.cameraWidth, 1390) + calcPx(this.cameraWidth, 184) / 2;
        // 打出的牌容器开始
        this.playedPlayCardsContainer = this.add
            .container(
                this.playedPlayCardsContainerOriginalX,
                this.cameraHeight -
                    calcPx(this.cameraWidth, 428) -
                    calcPx(this.cameraWidth, 248) / 2,
            )
            .setDepth(1);

        // 打出的牌容器结束

        // 理牌容器开始
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

        const pointButton = new GameButton(
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
                this.sortType = "point";
                this.sortHandPlayingCards(this.sortType);
            },
        ).container;
        const suitButton = new GameButton(
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
                this.sortType = "suit";
                this.sortHandPlayingCards(this.sortType);
            },
        ).container;

        // 理牌按钮容器
        this.organizingCardsContainer = this.add.container(
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
        // 理牌容器结束

        // 出牌按钮开始
        this.playPlayingCardsButton = new GameButton(
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
            async () => {
                const selectedPlayingCards = this.handPlayingCards.filter(
                    (item) => item.isSelected,
                );

                if (!selectedPlayingCards.length) return;

                // 出牌按钮点击后直接把出牌和弃牌按钮禁用
                this.updatePlayAndDiscardButtonDisabled(true);

                await this.playPlayingCardHandPlayingCardUiChange(false);

                for (let i = 0; i < selectedPlayingCards.length; i++) {
                    const card = selectedPlayingCards[i];

                    await this.playPlayingCard(
                        card,
                        i,
                        selectedPlayingCards.length,
                    );
                }

                // todo 开始计分
                console.log(
                    "牌型",
                    getHandTypeByPlayingCards(selectedPlayingCards),
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // 计分完成

                // 已打出的牌离场
                await this.playedPlayingCardsLeave();

                await this.playPlayingCardHandPlayingCardUiChange(true);

                await this.organizeCurrentHandPlayingCards();
                // 下一轮抽牌
                this.drawHandPlayingCards(
                    this.gameData.handLimit - this.handPlayingCards.length,
                );
            },
            true,
        );
        // 出牌按钮结束

        // 弃牌按钮开始
        this.discardPlayingCardsButton = new GameButton(
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
            true,
        );
        // 弃牌按钮结束
    }

    /**
     * 已打出的牌离场
     */
    async playedPlayingCardsLeave() {
        if (!this.playedPlayingCards.length)
            throw new Error("已打出的牌不能为空");

        for (let index = 0; index < this.playedPlayingCards.length; index++) {
            const card = this.playedPlayingCards[index];
            if (!card.container) throw new Error("已打出的牌容器不能为空");
            //拿到世界坐标
            const { tx, ty } = card.container.getWorldTransformMatrix();
            // 从出牌容器移除此牌
            this.playedPlayCardsContainer.remove(card.container);
            card.container.x = tx;
            card.container.y = ty;
            card.container.setDepth(0);

            await new Promise<void>((resolve) => {
                if (!card.container) return;
                this.tweens.add({
                    targets: card.container,
                    x: this.cameraWidth + card.container.displayHeight / 2,
                    y: card.container.y - card.container.displayHeight / 2,
                    rotation: Math.DegToRad(90),
                    duration: 200,
                    ease: "Sine.easeIn",
                    onComplete: () => {
                        card.removeFromScene();
                        resolve();
                    },
                    onStart: () => {
                        const percent =
                            (index + 1) / this.playedPlayingCards.length;

                        AudioManager.getInstance().playSound(
                            this.scene.key,
                            "card1",
                            {
                                volume: 0.6,
                                rate: 0.85 + percent * 0.2,
                            },
                        );
                        card.flip(200);
                    },
                });
            });
        }
        this.playedPlayingCards = [];
    }

    /**
     * 出单张牌
     */
    async playPlayingCard(
        card: PlayingCard,
        index: number = 0,
        totalCount: number = 0,
    ) {
        if (!card.container) return;

        // 关闭交互事件
        card.setClickMode(PlayingCardClickModes.none);
        card.setEnableDrag(false);

        //拿到世界坐标
        const { tx, ty } = card.container.getWorldTransformMatrix();
        // 从手牌容器移除此牌
        this.handPlayCardsContainer.remove(card.container);

        // 计算出相对于出牌区域的坐标
        const localPoint = this.playedPlayCardsContainer.getLocalPoint(tx, ty);

        // 将相对于出牌区域的坐标设置为此牌的坐标
        card.container.x = localPoint.x;
        card.container.y = localPoint.y;

        const bounds = this.playedPlayCardsContainer.getBounds();

        // 将此牌添加到出牌区域容器内
        this.playedPlayCardsContainer.add(card.container);

        // 此牌移动到出牌容器内对应位置
        const p1 = new Promise<void>((resolve) => {
            if (!card.container) return;
            this.tweens.add({
                targets: card.container,
                x:
                    card.container.displayWidth / 2 +
                    this.playedPlayingCards.length *
                        (card.container.displayWidth +
                            calcPx(this.cameraWidth, 30)),
                y: 0,
                duration: 200,
                ease: "Back.easeOut",
                onComplete: () => {
                    resolve();
                },
            });
        });

        // 出牌容器整体居中
        const p2 = new Promise<void>((resolve) => {
            if (!card.container) return;
            this.tweens.add({
                targets: this.playedPlayCardsContainer,
                x:
                    this.playedPlayCardsContainerOriginalX -
                    (bounds.width + card.container.displayWidth) / 2,
                duration: 200,
                ease: "Back.easeOut",
                onComplete: () => {
                    resolve();
                },
            });
        });

        // 扑克牌的移动和出牌容器的移动同时进行
        await Promise.all([p1, p2]);

        const percent = (index + 1) / totalCount;
        AudioManager.getInstance().playSound(this.scene.key, "card1", {
            volume: 0.6,
            rate: 0.85 + percent * 0.2,
        });

        // 动画完成后把扑克牌是否选中状态置为false，已打出的手牌不存在选中或不选中状态
        card.selected = false;

        this.handPlayingCards = this.handPlayingCards.filter(
            (item) => item !== card,
        );
        this.handPlayingCardsNumberText.setText(
            `${this.handPlayingCards.length}/${this.gameData.handLimit}`,
        );
        this.playedPlayingCards.push(card);
    }

    /**
     * 出牌后手牌区域的ui变化
     * @param isFinish 出牌是否完成
     */
    async playPlayingCardHandPlayingCardUiChange(isFinish: boolean) {
        this.organizingCardsContainer.setVisible(isFinish);
        this.playPlayingCardsButton.container.setVisible(isFinish);
        this.discardPlayingCardsButton.container.setVisible(isFinish);

        await new Promise<void>((resolve) => {
            isFinish
                ? this.tweens.add({
                      targets: this.handPlayCardsContainer,
                      y:
                          this.cameraHeight -
                          calcPx(this.cameraWidth, 261) -
                          this.playCardsContainerHeight / 2,
                      duration: 200,
                      ease: "Back.easeOut",
                      onComplete: () => {
                          resolve();
                      },
                  })
                : this.tweens.add({
                      targets: this.handPlayCardsContainer,
                      y:
                          this.cameraHeight -
                          calcPx(this.cameraWidth, 77) -
                          this.playCardsContainerHeight / 2,
                      duration: 200,
                      ease: "Back.easeOut",
                      onComplete: () => {
                          resolve();
                      },
                  });
        });
    }

    /**
     * 排序手牌卡牌
     * @param type 排序类型
     */
    async sortHandPlayingCards(type: "point" | "suit") {
        if (type === "point") {
            this.handPlayingCards.sort((a, b) => b.rank - a.rank);
            await this.organizeCurrentHandPlayingCards();
        } else {
            this.handPlayingCards.sort((a, b) => {
                // 先比花色权重
                const suitDiff =
                    (SUIT_RANK_MAP[b.suit] || 0) - (SUIT_RANK_MAP[a.suit] || 0);
                if (suitDiff !== 0) return suitDiff;

                //  花色相同，再比点数
                return b.rank - a.rank;
            });
            await this.organizeCurrentHandPlayingCards();
        }
    }

    /**
     * 整理当前手牌卡牌的位置
     */
    async organizeCurrentHandPlayingCards() {
        await Promise.all(
            this.handPlayingCards.map((card, idx) => {
                if (!card.container) throw new Error("手牌容器不存在");
                return new Promise<void>((resolve) => {
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
                            resolve();
                        },
                    });
                });
            }),
        );
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
                // todo 后续改为牌堆空了游戏结束
                this.currentDeck = this.random.shuffle(
                    this.gameData.completeDeck,
                );
                this.createOrUpdateDeckContainer();
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
        // 就位后 按照上次排序类型理牌
        this.sortHandPlayingCards(this.sortType);
    }
    enableHandPlayingCardsEvent() {
        this.handPlayingCards.forEach((itemPlayingCard) => {
            itemPlayingCard.setClickMode(PlayingCardClickModes.select);
            itemPlayingCard.setEnableDrag(true);
            itemPlayingCard.setSelectCallbacks({
                canSelect: (_, value) => {
                    // 取消选择时，直接返回true
                    if (!value) return true;

                    // 选择时，判断当前是否选择了5张牌
                    return (
                        this.handPlayingCards.filter((item) => item.isSelected)
                            .length < 5
                    );
                },
                onSelectEnd: () => {
                    this.updatePlayAndDiscardButtonDisabled();
                },
            });
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
                                    duration: 200,
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
     * 更新出牌和弃牌按钮的禁用状态
     * @param disabled 是否禁用 不传则根据是否有选中的牌来判断 传入则设置为该值
     */
    updatePlayAndDiscardButtonDisabled(disabled?: boolean) {
        if (disabled !== undefined) {
            this.playPlayingCardsButton.setDisabled(disabled);
            this.discardPlayingCardsButton.setDisabled(disabled);
            return;
        }
        const selectedCards = this.handPlayingCards.filter(
            (item) => item.isSelected,
        );
        this.playPlayingCardsButton.setDisabled(!selectedCards.length);
        this.discardPlayingCardsButton.setDisabled(!selectedCards.length);
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
        if (!itemPlayingCard.container) {
            throw new Error("itemPlayingCard.container is null");
        }

        itemPlayingCard.setScale(
            calcScale(
                this.cameraWidth,
                itemPlayingCard.container.displayWidth,
                184,
            ) *
                (184 / 176),
        );
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
                duration: 200,
                ease: "Back.easeOut",
                onComplete: () => {
                    resolve();
                },
                onStart: () => {
                    itemPlayingCard.flip(200);
                    AudioManager.getInstance().playSound(
                        this.scene.key,
                        "card1",
                        {
                            volume: 0.6,
                            rate: 0.85 + (percent * 0.2) / 100,
                        },
                    );
                },
            });
        });

        return itemPlayingCard;
    }

    update(_time: number, delta: number): void {
        if (this.bgShader) {
            this.bgShader.update(delta);
        }
    }
}
