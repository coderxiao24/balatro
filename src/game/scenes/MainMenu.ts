import { GameObjects, Geom } from "phaser";

import { BalatroSplash } from "@/game/entities/shaders/BalatroSplash";
import { calcPx, calcScale } from "@/utils";
import { PlayingCard } from "@/game/entities/PlayingCard";
import {
    DeckNames,
    GameData,
    IPlayingCard,
    PlayingCardValues,
    StakeNames,
    Suits,
} from "@/types";
import { BaseScene } from "./BaseScene";
import { AudioManager } from "@/game/manager/AudioManager";
import { PlayingCardClickModes } from "@/types";
import { preferences } from "@/utils";
import { cloneDeep } from "lodash";

import { INITIAL_PLAYING_CARDS_ARRAY } from "@/config";
import { GameButton } from "../ui";

export class MainMenu extends BaseScene {
    background: GameObjects.Image;
    logo: GameObjects.Image;

    logoTween: Phaser.Tweens.Tween | null;
    bgShader: BalatroSplash;
    buttonGroup: GameObjects.Container | null = null;

    constructor() {
        super("MainMenu");
    }

    create(data?: { skipFlashIn?: boolean }) {
        const { width, height } = this.cameras.main;

        this.bgShader = new BalatroSplash(
            this,
            width / 2,
            height / 2,
            width,
            height,
            {
                colour1: [254 / 255, 95 / 255, 85 / 255, 1.0],
                colour2: [0, 157 / 255, 255 / 255, 1.0],
                vortSpeed: 0.4,
                midFlash: 0.0,
                vortOffset: 0.0,
                time: 12,
            },
        );
        this.add.existing(this.bgShader);

        this.logo = this.add.image(width / 2, 0, "balatro");

        this.logo.setScale(
            calcScale(width, this.logo.displayHeight, 864) * (864 / 848),
        );
        this.logo.y = calcPx(width, 32) + this.logo.displayHeight / 2;
        const A = new PlayingCard(Suits.Spades, PlayingCardValues.Ace);
        A.addToScene({
            scene: this,
            x: width / 2,
            y: 0,
            clickMode: PlayingCardClickModes.none,
            enableDrag: true,
        });

        if (A.container) {
            A.setScale(
                calcScale(width, A.container.displayWidth, 240) * (240 / 236),
            );
            A.container.y = calcPx(width, 300) + A.container.displayHeight / 2;
        }

        // 设置拖拽回调，包括放置验证
        A.setDragCallbacks({
            canDrop: () => false,
        });

        const targetY = height - calcPx(width, 88) - calcPx(width, 198) / 2;

        this.buttonGroup = this.add.container(width / 2, targetY);

        const spacing = calcPx(width, 20);

        const startGameBtn = new GameButton(
            this,
            -(calcPx(width, 352) / 2 + calcPx(width, 256) / 2 + spacing),
            0,
            calcPx(width, 352),
            calcPx(width, 150),
            0x449bf8,
            "开始游戏",
            calcPx(width, 70),
            async () => {
                const data: GameData = {
                    deck: DeckNames.RedDeck,
                    stake: StakeNames.WhiteStake,
                    ante: 1,
                    round: 0,
                    completeDeck: cloneDeep(
                        INITIAL_PLAYING_CARDS_ARRAY,
                    ) as IPlayingCard[],
                    historyBlinds: [],
                    handLimit: 8,
                };

                await preferences.setItem("gameData", data);
                this.scene.start("Game");
            },
        );

        const optionBtn = new GameButton(
            this,
            0,
            0,
            calcPx(width, 256),
            calcPx(width, 130),
            0xf0a63b,
            "选项",
            calcPx(width, 42),
            () => {
                // this.scene.start("Option");
            },
        );

        const favoriteBtn = new GameButton(
            this,
            calcPx(width, 352) / 2 + calcPx(width, 256) / 2 + spacing,
            0,
            calcPx(width, 352),
            calcPx(width, 150),
            0x6ba688,
            "收藏",
            calcPx(width, 52),
            () => {
                // this.scene.start("Favorite");
            },
        );

        this.buttonGroup.add([
            startGameBtn.container,
            optionBtn.container,
            favoriteBtn.container,
        ]);

        const groupBg = this.add.rectangle(
            0,
            0,
            calcPx(width, 352) * 2 + calcPx(width, 256) + spacing * 4,
            calcPx(width, 150) + calcPx(width, 24) * 2,
            0x536267,
        );
        groupBg.setRounded(calcPx(width, 20)); // 设置圆角
        this.buttonGroup.addAt(groupBg, 0);

        // 闪光进场：从 Splash 场景自动跳转过来时做闪光入场，点击跳转则跳过
        if (!data?.skipFlashIn) {
            // 有闪光进场：按钮组从屏幕下方飞入
            this.buttonGroup.y = height + calcPx(width, 198);

            this.bgShader.flashIn(2 * 1000, () => {
                AudioManager.getInstance().playSound(this.scene.key, "whoosh", {
                    volume: 0.2,
                    rate: 0.7,
                });
                this.tweens.add({
                    targets: this.buttonGroup,
                    y: targetY,
                    duration: 400,
                    ease: "Back.easeOut",
                });
            });
        }
    }

    update(time: number, delta: number): void {
        // 每帧更新着色器动画
        this.bgShader.update(time, delta);
    }

    /** 检查卡牌是否在按钮组内 */
    private isInsideButtonGroup(x: number, y: number): boolean {
        if (!this.buttonGroup) return false;

        // 获取按钮组的边界
        const bounds = this.buttonGroup.getBounds();
        return Geom.Rectangle.Contains(bounds, x, y);
    }
}
