import { StakeNames } from "@/types";
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
    stakeName: StakeNames;
    constructor({
        scene,
        stakeName,
    }: {
        scene: Phaser.Scene;
        stakeName: StakeNames;
    }) {
        super(scene);
        this.scene = scene;
        this.cameraWidth = scene.cameras.main.width;
        this.cameraHeight = scene.cameras.main.height;
        this.BoardWidth = calcPx(this.cameraWidth, 502);
        this.BoardHeight = this.cameraHeight;
        this.stakeName = stakeName;
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

        const roundScoreContainer = this.crateRoundScore();

        this.container.add([border, bg, roundScoreContainer]);
    }
    crateRoundScore() {
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
                stakeDataMap[this.stakeName].pos.x +
                    5 * stakeDataMap[this.stakeName].pos.y,
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
}
