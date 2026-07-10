import { GameData, StakeNames } from "@/types";
import { calcPx, calcScale } from "@/utils";
import { GameObjects } from "phaser";
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
    NumberOfRoundText: GameObjects.Text;
    chipsText: GameObjects.Text;
    multText: GameObjects.Text;
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

        const scoreText = this.scene.add
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

        const currentScoreContainer = this.scene.add.container(0, 0, [
            stakeChipIcon,
            scoreText,
        ]);

        const bounds = currentScoreContainer.getBounds();

        currentScoreContainer.x = 0 - bounds.width / 2;

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
                currentScoreContainer,
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

        container.add([bg, chipsContainer, multContainer, multImg]);

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
    updataRoundText() {
        this.NumberOfRoundText.setText(this.gameData.round.toString());
    }
    updataChipsText(
        valueOrFn: number | string | ((value: string) => number | string),
    ) {
        if (typeof valueOrFn === "function") {
            this.chipsText.setText(valueOrFn(this.chipsText.text).toString());
        } else {
            this.chipsText.setText(valueOrFn.toString());
        }
    }
    updataMultText(value: number | string) {
        this.multText.setText(value.toString());
    }
}
