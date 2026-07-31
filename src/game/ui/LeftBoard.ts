import { GameData, StakeNames } from "@/types";
import { calcPx, calcScale } from "@/utils";
import { Actions, Display, GameObjects } from "phaser";
import { GameButton } from "@/game/ui";
import { stakeDataMap } from "@/config";

export default class LeftBoard extends GameObjects.Container {
    container: GameObjects.Container;
    scene: Phaser.Scene;
    BoardWidth: number;
    BoardHeight: number;
    private cameraWidth: number;
    private cameraHeight: number;

    gameData: GameData;
    /** 当前回合数 */
    NumberOfRoundText: GameObjects.Text;
    /** 本次出牌筹码 */
    chipsText: GameObjects.Text;
    /** 本次出牌倍数 */
    multText: GameObjects.Text;
    /** 本次出牌的牌型以及等级的容器 */
    handTypeContainer: GameObjects.Container;
    /** 本次出牌的牌型文本 */
    handTypeText: GameObjects.Text;
    /** 本次出牌的牌型的等级文本 */
    handTypeLevelText: GameObjects.Text;
    /** 本次出牌的总分数文本 */
    currentTotalScoreText: GameObjects.Text;
    /** 当前回合总分数 */
    roundTotalScoreText: GameObjects.Text;
    /** 当前回合总分数的容器 */
    roundScoreValueContainer: GameObjects.Container;

    constructor({
        scene,
        gameData,
    }: {
        scene: Phaser.Scene;
        gameData: GameData;
    }) {
        super(scene);
        this.scene = scene;
        this.cameraWidth = scene.cameras.main.width;
        this.cameraHeight = scene.cameras.main.height;
        this.BoardWidth = calcPx(this.cameraWidth, 502);
        this.BoardHeight = this.cameraHeight;
        this.gameData = gameData;
    }
    addToScene() {
        this.container = this.scene.add.container(
            calcPx(this.cameraWidth, 256) + this.BoardWidth / 2,
            this.cameraHeight / 2,
        );
        const border = this.scene.add
            .rectangle(0, 0, this.BoardWidth, this.BoardHeight, 0x364345)
            .setStrokeStyle(calcPx(this.cameraWidth, 3), 0x000000, 0.2);
        const bg = this.scene.add
            .rectangle(
                0,
                0,
                this.BoardWidth - calcPx(this.cameraWidth, 10),
                this.BoardHeight,
                0x454f51,
            )
            .setStrokeStyle(calcPx(this.cameraWidth, 3), 0x000000, 0.2);

        const roundScoreContainer = this.createRoundScore();

        const currentScoreContainer = this.createCurrentScore();

        const numberOfPlaysContainer = this.createNumberOfPlays();

        const numberOfDiscardsContainer = this.createNumberOfDiscards();

        const amountOfMoneyContainer = this.createAmountOfMoneyContainer();

        const numberOfAnteContainer = this.createNumberOfAnte();
        const numberOfRoundContainer = this.createNumberOfRound();

        const gameInfoButton = new GameButton(
            this.scene,
            -this.BoardWidth / 2 +
                calcPx(this.cameraWidth, 30) +
                calcPx(this.cameraWidth, 144) / 2,
            -this.BoardHeight / 2 +
                calcPx(this.cameraWidth, 778) +
                calcPx(this.cameraWidth, 170) / 2,
            calcPx(this.cameraWidth, 144),
            calcPx(this.cameraWidth, 170),
            0xfc5f54,
            "比赛\n信息",
            calcPx(this.cameraWidth, 36),
            () => {},
        );

        const optionsButton = new GameButton(
            this.scene,
            -this.BoardWidth / 2 +
                calcPx(this.cameraWidth, 30) +
                calcPx(this.cameraWidth, 144) / 2,
            -this.BoardHeight / 2 +
                calcPx(this.cameraWidth, 966) +
                calcPx(this.cameraWidth, 170) / 2,
            calcPx(this.cameraWidth, 144),
            calcPx(this.cameraWidth, 170),
            0xfca210,
            "选项",
            calcPx(this.cameraWidth, 36),
            () => {},
        );

        this.container.add([
            border,
            bg,
            roundScoreContainer,
            currentScoreContainer,
            numberOfPlaysContainer,
            numberOfDiscardsContainer,
            amountOfMoneyContainer,
            numberOfAnteContainer,
            numberOfRoundContainer,
            gameInfoButton.container,
            optionsButton.container,
        ]);
    }

    /**
     * 创建回合分数容器
     */
    createRoundScore() {
        const container = this.scene.add.container(
            0,
            -this.BoardHeight / 2 +
                calcPx(this.cameraWidth, 411) +
                calcPx(this.cameraWidth, 87) / 2,
        );

        const bg = this.scene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 476),
                calcPx(this.cameraWidth, 87),
                0x343e40,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        const roundScoreText = this.scene.add.text(
            -calcPx(this.cameraWidth, 476) / 2 + calcPx(this.cameraWidth, 40),
            -calcPx(this.cameraWidth, 87) / 2 + calcPx(this.cameraWidth, 10),
            "回合\n分数",
            {
                fontSize: calcPx(this.cameraWidth, 30),
                color: "#FFF",
                fontFamily: "NotoSansSC",
                lineSpacing: 0,
            },
        );

        const stakeChipIcon = this.scene.add
            .image(
                0,
                0,
                "chips",
                stakeDataMap[this.gameData.stake].pos.x +
                    5 * stakeDataMap[this.gameData.stake].pos.y,
            )
            .setOrigin(0, 0.5);

        stakeChipIcon.setScale(
            calcScale(this.cameraWidth, stakeChipIcon.displayWidth, 46) *
                (58 / 54),
        );

        this.roundTotalScoreText = this.scene.add
            .text(
                stakeChipIcon.displayWidth + calcPx(this.cameraWidth, 14),
                0,
                "0",
                {
                    fontSize: calcPx(this.cameraWidth, 53),
                    color: "#FFF",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0, 0.5);

        this.roundScoreValueContainer = this.scene.add.container(0, 0, [
            stakeChipIcon,
            this.roundTotalScoreText,
        ]);

        const bounds = this.roundScoreValueContainer.getBounds();

        this.roundScoreValueContainer.x = 0 - bounds.width / 2;

        const childContainer = this.scene.add.container(
            calcPx(this.cameraWidth, 476) / 2 -
                calcPx(this.cameraWidth, 11) -
                calcPx(this.cameraWidth, 320) / 2,
            0,
            [
                this.scene.add
                    .rectangle(
                        0,
                        0,
                        calcPx(this.cameraWidth, 320),
                        calcPx(this.cameraWidth, 68),
                        0x454f51,
                    )
                    .setRounded(calcPx(this.cameraWidth, 12)),
                this.roundScoreValueContainer,
            ],
        );

        container.add([bg, roundScoreText, childContainer]);

        return container;
    }
    /**
     * 创建当前分数容器
     */
    createCurrentScore() {
        const container = this.scene.add.container(
            0,
            -this.BoardHeight / 2 +
                calcPx(this.cameraWidth, 510) +
                calcPx(this.cameraWidth, 243) / 2,
        );

        const bg = this.scene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 476),
                calcPx(this.cameraWidth, 243),
                0x343e40,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        this.handTypeContainer = this.scene.add.container(
            0,
            -calcPx(this.cameraWidth, 243) / 2 + calcPx(this.cameraWidth, 24),
        );

        this.handTypeText = this.scene.add.text(0, 0, "高牌", {
            fontSize: calcPx(this.cameraWidth, 56),
            color: "#FFF",
            fontFamily: "NotoSansSC",
        });

        this.handTypeLevelText = this.scene.add.text(0, 0, "等级1", {
            fontSize: calcPx(this.cameraWidth, 32),
            color: "#EFEFEF",
            fontFamily: "NotoSansSC",
        });
        this.handTypeContainer.add([this.handTypeText, this.handTypeLevelText]);
        Actions.AlignTo(
            [this.handTypeText, this.handTypeLevelText],
            Display.Align.RIGHT_CENTER,
            calcPx(this.cameraWidth, 20),
        );
        this.handTypeContainer.setVisible(false);

        this.currentTotalScoreText = this.scene.add
            .text(
                0,
                -calcPx(this.cameraWidth, 243) / 2 +
                    calcPx(this.cameraWidth, 30),
                "0",
                {
                    fontSize: calcPx(this.cameraWidth, 64),
                    color: "#FFF",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5, 0)
            .setVisible(false);

        const chipsBg = this.scene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 194),
                calcPx(this.cameraWidth, 100),
                0x0b9dfb,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        this.chipsText = this.scene.add
            .text(
                calcPx(this.cameraWidth, 194) / 2 -
                    calcPx(this.cameraWidth, 10),
                0,
                "0",
                {
                    fontSize: calcPx(this.cameraWidth, 62),
                    color: "#FFF",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(1, 0.5);

        const multBg = this.scene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 194),
                calcPx(this.cameraWidth, 100),
                0xfc5f54,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        this.multText = this.scene.add
            .text(
                -calcPx(this.cameraWidth, 194) / 2 +
                    calcPx(this.cameraWidth, 10),
                0,
                "0",
                {
                    fontSize: calcPx(this.cameraWidth, 62),
                    color: "#FFF",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0, 0.5);

        const chipsContainer = this.scene.add.container(
            -calcPx(this.cameraWidth, 476) / 2 +
                calcPx(this.cameraWidth, 194) / 2 +
                calcPx(this.cameraWidth, 16),
            calcPx(this.cameraWidth, 243) / 2 -
                calcPx(this.cameraWidth, 100) / 2 -
                calcPx(this.cameraWidth, 22),
            [chipsBg, this.chipsText],
        );

        const multContainer = this.scene.add.container(
            calcPx(this.cameraWidth, 476) / 2 -
                calcPx(this.cameraWidth, 194) / 2 -
                calcPx(this.cameraWidth, 16),
            calcPx(this.cameraWidth, 243) / 2 -
                calcPx(this.cameraWidth, 100) / 2 -
                calcPx(this.cameraWidth, 22),
            [multBg, this.multText],
        );

        const multImg = this.scene.add.image(
            0,
            calcPx(this.cameraWidth, 243) / 2 -
                calcPx(this.cameraWidth, 100) / 2 -
                calcPx(this.cameraWidth, 22),
            "mult",
        );
        multImg.setScale(calcScale(this.cameraWidth, multImg.displayWidth, 36));

        container.add([
            bg,
            this.handTypeContainer,
            this.currentTotalScoreText,
            chipsContainer,
            multContainer,
            multImg,
        ]);

        return container;
    }
    /**
     * 创建剩余出牌次数容器
     */
    createNumberOfPlays() {
        const width = calcPx(this.cameraWidth, 140);
        const height = calcPx(this.cameraWidth, 116);
        const container = this.scene.add.container(
            -this.BoardWidth / 2 + calcPx(this.cameraWidth, 196) + width / 2,
            -this.BoardHeight / 2 + calcPx(this.cameraWidth, 768) + height / 2,
        );

        const bg = this.scene.add
            .rectangle(0, 0, width, height, 0x343e40)
            .setRounded(calcPx(this.cameraWidth, 12));

        const playACardText = this.scene.add
            .text(0, -height / 2 + calcPx(this.cameraWidth, 5), "出牌", {
                fontSize: calcPx(this.cameraWidth, 26),
                color: "#FFF",
                fontFamily: "NotoSansSC",
            })
            .setOrigin(0.5, 0);

        const NumberOfPlaysTextBg = this.scene.add
            .rectangle(
                0,
                height / 2 -
                    calcPx(this.cameraWidth, 10) -
                    calcPx(this.cameraWidth, 64) / 2,
                calcPx(this.cameraWidth, 116),
                calcPx(this.cameraWidth, 64),
                0x454f51,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        const NumberOfPlaysText = this.scene.add
            .text(
                0,
                height / 2 -
                    calcPx(this.cameraWidth, 10) -
                    calcPx(this.cameraWidth, 64) / 2,
                this.gameData.currentNumberOfPlays?.toString() || "0",
                {
                    fontSize: calcPx(this.cameraWidth, 54),
                    color: "#0E9EFC",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5);

        container.add([
            bg,
            playACardText,
            NumberOfPlaysTextBg,
            NumberOfPlaysText,
        ]);

        return container;
    }
    /**
     * 创建剩余弃牌次数容器
     */
    createNumberOfDiscards() {
        const width = calcPx(this.cameraWidth, 140);
        const height = calcPx(this.cameraWidth, 116);
        const container = this.scene.add.container(
            -this.BoardWidth / 2 + calcPx(this.cameraWidth, 348) + width / 2,
            -this.BoardHeight / 2 + calcPx(this.cameraWidth, 768) + height / 2,
        );

        const bg = this.scene.add
            .rectangle(0, 0, width, height, 0x343e40)
            .setRounded(calcPx(this.cameraWidth, 12));

        const foldText = this.scene.add
            .text(0, -height / 2 + calcPx(this.cameraWidth, 5), "弃牌", {
                fontSize: calcPx(this.cameraWidth, 26),
                color: "#FFF",
                fontFamily: "NotoSansSC",
            })
            .setOrigin(0.5, 0);

        const NumberOfDiscardsTextBg = this.scene.add
            .rectangle(
                0,
                height / 2 -
                    calcPx(this.cameraWidth, 10) -
                    calcPx(this.cameraWidth, 64) / 2,
                calcPx(this.cameraWidth, 116),
                calcPx(this.cameraWidth, 64),
                0x454f51,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        const NumberOfDiscardsText = this.scene.add
            .text(
                0,
                height / 2 -
                    calcPx(this.cameraWidth, 10) -
                    calcPx(this.cameraWidth, 64) / 2,
                this.gameData.currentNumberOfDiscards?.toString() || "0",
                {
                    fontSize: calcPx(this.cameraWidth, 54),
                    color: "#FC5F54",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5);

        container.add([
            bg,
            foldText,
            NumberOfDiscardsTextBg,
            NumberOfDiscardsText,
        ]);

        return container;
    }
    /**
     * 创建当前金额容器
     */
    createAmountOfMoneyContainer() {
        const width = calcPx(this.cameraWidth, 293);
        const height = calcPx(this.cameraWidth, 116);
        const container = this.scene.add.container(
            -this.BoardWidth / 2 + calcPx(this.cameraWidth, 196) + width / 2,
            -this.BoardHeight / 2 + calcPx(this.cameraWidth, 901) + height / 2,
        );

        const bg = this.scene.add
            .rectangle(0, 0, width, height, 0x343e40)
            .setRounded(calcPx(this.cameraWidth, 12));

        const amountOfMoneyTextBg = this.scene.add
            .rectangle(
                0,
                0,
                calcPx(this.cameraWidth, 260),
                calcPx(this.cameraWidth, 96),
                0x454f51,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        const amountOfMoneyText = this.scene.add
            .text(0, 0, `$${this.gameData.money}`, {
                fontSize: calcPx(this.cameraWidth, 64),
                color: "#F3B959",
                fontFamily: "NotoSansSC",
            })
            .setOrigin(0.5);

        container.add([bg, amountOfMoneyTextBg, amountOfMoneyText]);

        return container;
    }
    /**
     * 创建当前底注容器
     */
    createNumberOfAnte() {
        const width = calcPx(this.cameraWidth, 140);
        const height = calcPx(this.cameraWidth, 116);
        const container = this.scene.add.container(
            -this.BoardWidth / 2 + calcPx(this.cameraWidth, 196) + width / 2,
            -this.BoardHeight / 2 + calcPx(this.cameraWidth, 1030) + height / 2,
        );

        const bg = this.scene.add
            .rectangle(0, 0, width, height, 0x343e40)
            .setRounded(calcPx(this.cameraWidth, 12));

        const anteText = this.scene.add
            .text(0, -height / 2 + calcPx(this.cameraWidth, 5), "底注", {
                fontSize: calcPx(this.cameraWidth, 26),
                color: "#FFF",
                fontFamily: "NotoSansSC",
            })
            .setOrigin(0.5, 0);

        const NumberOfAnteTextBg = this.scene.add
            .rectangle(
                0,
                height / 2 -
                    calcPx(this.cameraWidth, 10) -
                    calcPx(this.cameraWidth, 64) / 2,
                calcPx(this.cameraWidth, 116),
                calcPx(this.cameraWidth, 64),
                0x454f51,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        const NumberOfAnteText = this.scene.add
            .text(
                0,
                height / 2 -
                    calcPx(this.cameraWidth, 10) -
                    calcPx(this.cameraWidth, 64) / 2,
                `${this.gameData.ante}/8`,
                {
                    fontSize: calcPx(this.cameraWidth, 54),
                    color: "#FD9A10",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5);

        container.add([bg, anteText, NumberOfAnteTextBg, NumberOfAnteText]);

        return container;
    }
    /**
     * 创建当前回合容器
     */
    createNumberOfRound() {
        const width = calcPx(this.cameraWidth, 140);
        const height = calcPx(this.cameraWidth, 116);
        const container = this.scene.add.container(
            -this.BoardWidth / 2 + calcPx(this.cameraWidth, 348) + width / 2,
            -this.BoardHeight / 2 + calcPx(this.cameraWidth, 1030) + height / 2,
        );

        const bg = this.scene.add
            .rectangle(0, 0, width, height, 0x343e40)
            .setRounded(calcPx(this.cameraWidth, 12));

        const roundText = this.scene.add
            .text(0, -height / 2 + calcPx(this.cameraWidth, 5), "回合", {
                fontSize: calcPx(this.cameraWidth, 26),
                color: "#FFF",
                fontFamily: "NotoSansSC",
            })
            .setOrigin(0.5, 0);

        const NumberOfRoundTextBg = this.scene.add
            .rectangle(
                0,
                height / 2 -
                    calcPx(this.cameraWidth, 10) -
                    calcPx(this.cameraWidth, 64) / 2,
                calcPx(this.cameraWidth, 116),
                calcPx(this.cameraWidth, 64),
                0x454f51,
            )
            .setRounded(calcPx(this.cameraWidth, 12));

        this.NumberOfRoundText = this.scene.add
            .text(
                0,
                height / 2 -
                    calcPx(this.cameraWidth, 10) -
                    calcPx(this.cameraWidth, 64) / 2,
                this.gameData.round.toString(),
                {
                    fontSize: calcPx(this.cameraWidth, 54),
                    color: "#FD9A10",
                    fontFamily: "NotoSansSC",
                },
            )
            .setOrigin(0.5);

        container.add([
            bg,
            roundText,
            NumberOfRoundTextBg,
            this.NumberOfRoundText,
        ]);

        return container;
    }
    updateRoundText() {
        this.NumberOfRoundText.setText(this.gameData.round.toString());
    }
    updateChipsText(
        valueOrFn: number | string | ((value: string) => number | string),
    ) {
        if (typeof valueOrFn === "function") {
            this.chipsText.setText(valueOrFn(this.chipsText.text).toString());
        } else {
            this.chipsText.setText(valueOrFn.toString());
        }
    }
    updateMultText(
        valueOrFn: number | string | ((value: string) => number | string),
    ) {
        if (typeof valueOrFn === "function") {
            this.multText.setText(valueOrFn(this.multText.text).toString());
        } else {
            this.multText.setText(valueOrFn.toString());
        }
    }
    /**
     * 当前显示的得分(过渡中的值)
     */
    private currentDisplayScore: number = 0;
    /**
     * 更新当前回合总得分时候正在运行的 Tween
     */
    private activeScoreTween: Phaser.Tweens.Tween | null = null; // 记录当前正在运行的 Tween

    /**
     * 更新当前回合总得分
     */
    updateRoundTotalScoreText(
        valueOrFn: number | string | ((value: string) => number | string),
        duration: number = 0,
    ) {
        //  计算目标数值
        let targetValue: number;
        if (typeof valueOrFn === "function") {
            targetValue = Number(valueOrFn(this.roundTotalScoreText.text));
        } else {
            targetValue = Number(valueOrFn);
        }

        if (this.activeScoreTween && this.activeScoreTween.isPlaying()) {
            this.activeScoreTween.stop();
        }

        this.currentDisplayScore = Number(this.roundTotalScoreText.text) || 0;

        this.activeScoreTween = this.scene.tweens.add({
            targets: this,
            currentDisplayScore: targetValue,
            duration: duration,
            ease: "Sine.easeOut",
            onUpdate: () => {
                // 5. 每一帧更新文本内容
                this.roundTotalScoreText.setText(
                    Math.round(this.currentDisplayScore).toString(),
                );

                // 6. 每一帧重新计算边界并居中
                const bounds = this.roundScoreValueContainer.getBounds();
                this.roundScoreValueContainer.x = 0 - bounds.width / 2;
            },
            onComplete: () => {
                this.activeScoreTween = null;
            },
        });
    }

    /**
     * 更新手型类型容器(当前出牌的牌型和等级)
     */
    updateHandTypeContainer(
        visible: boolean,
        handType: string = "",
        level: string = "",
    ) {
        this.handTypeText.setText(handType);

        this.handTypeLevelText.setText(`等级${level}`);

        Actions.AlignTo(
            [this.handTypeText, this.handTypeLevelText],
            Display.Align.RIGHT_CENTER,
            calcPx(this.cameraWidth, 20),
        );
        const bounds = this.handTypeContainer.getBounds();

        this.handTypeContainer.x = 0 - bounds.width / 2;
        this.handTypeContainer.setVisible(visible);
    }

    /**
     * 当前显示的得分(过渡中的值)
     */
    private currentDisplayScore1: number = 0;
    /**
     * 更新当前回合总得分时候正在运行的 Tween
     */
    private activeScoreTween1: Phaser.Tweens.Tween | null = null; // 记录当前正在运行的 Tween
    /**
     * 更新本次出牌的总分数文本
     */
    updateCurrentTotalScoreText(
        visible: boolean,
        value: string = "",
        duration: number = 0,
    ) {
        if (this.activeScoreTween1 && this.activeScoreTween1.isPlaying()) {
            this.activeScoreTween1.stop();
        }

        this.currentDisplayScore1 =
            Number(this.currentTotalScoreText.text) || 0;

        this.activeScoreTween1 = this.scene.tweens.add({
            targets: this,
            currentDisplayScore1: Number(value),
            duration: duration,
            ease: "Sine.easeOut",
            onStart: () => {
                if (visible) {
                    this.currentTotalScoreText.setVisible(visible);
                }
            },
            onUpdate: () => {
                // 5. 每一帧更新文本内容
                this.currentTotalScoreText.setText(
                    Math.round(this.currentDisplayScore1).toString(),
                );
            },
            onComplete: () => {
                this.activeScoreTween1 = null;
                if (!visible) {
                    this.currentTotalScoreText.setVisible(visible);
                }
            },
        });
    }
}
