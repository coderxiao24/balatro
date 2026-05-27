import Phaser from "phaser";
import { Suit, CardValue } from "./types/card";

/** 花色的行索引（用于计算 frame） */
const SUIT_ROW: Record<Suit, number> = {
    [Suit.Hearts]: 0,
    [Suit.Clubs]: 1,
    [Suit.Diamonds]: 2,
    [Suit.Spades]: 3,
};

/** CardValue 在行内的列索引 */
const VALUE_COL: Record<CardValue, number> = {
    [CardValue.Two]: 0,
    [CardValue.Three]: 1,
    [CardValue.Four]: 2,
    [CardValue.Five]: 3,
    [CardValue.Six]: 4,
    [CardValue.Seven]: 5,
    [CardValue.Eight]: 6,
    [CardValue.Nine]: 7,
    [CardValue.Ten]: 8,
    [CardValue.Jack]: 9,
    [CardValue.Queen]: 10,
    [CardValue.King]: 11,
    [CardValue.Ace]: 12,
};

/** 所有 Suit 枚举值数组（用于随机） */
const ALL_SUITS = Object.values(Suit);

/** 所有 CardValue 枚举值数组（用于随机） */
const ALL_VALUES = Object.values(CardValue);

/** 花色英文名 */
const SUIT_NAME: Record<Suit, string> = {
    [Suit.Hearts]: "Hearts",
    [Suit.Clubs]: "Clubs",
    [Suit.Diamonds]: "Diamonds",
    [Suit.Spades]: "Spades",
};

/** 点击交互模式 */
export enum ClickMode {
    none = "none",
    flip = "flip",
    select = "select",
}

/** 选中时向上位移的像素值 */
const SELECT_OFFSET_Y = -30;

/**
 * 扑克牌类
 *
 * 构造函数可传入指定花色和点数；不传则随机生成一张牌。
 */
export class PlayingCard {
    readonly suit: Suit;
    readonly value: CardValue;
    readonly frame: number;
    readonly name: string;
    /** 是否正面朝上（可读写，不会带动画，需配合 flip() 或直接更新后用 refreshFace() 同步） */
    faceUp: boolean;

    /** 添加到场景后的 Container 引用（未添加时为 null） */
    container: Phaser.GameObjects.Container | null = null;

    private scene: Phaser.Scene | null = null;
    private base: Phaser.GameObjects.Image | null = null;
    private overlay: Phaser.GameObjects.Image | null = null;
    private clickMode: ClickMode = ClickMode.none;
    private selected = false;

    constructor(suit?: Suit, value?: CardValue, faceUp = true) {
        this.suit =
            suit ?? ALL_SUITS[Math.floor(Math.random() * ALL_SUITS.length)];
        this.value =
            value ?? ALL_VALUES[Math.floor(Math.random() * ALL_VALUES.length)];
        this.frame = SUIT_ROW[this.suit] * 13 + VALUE_COL[this.value];
        this.name = `${this.value} of ${SUIT_NAME[this.suit]}`;
        this.faceUp = faceUp;
    }

    /**
     * 将牌添加到场景中
     * @param scene     目标场景
     * @param x         x 坐标
     * @param y         y 坐标
     * @param clickMode 点击交互模式："none" | "flip" | "select"，默认 "none"
     */
    addToScene(
        scene: Phaser.Scene,
        x: number,
        y: number,
        clickMode: ClickMode = ClickMode.none,
    ): Phaser.GameObjects.Container {
        this.scene = scene;
        this.clickMode = clickMode;
        this.selected = false;

        // 根据 this.faceUp 决定初始显示
        this.base = scene.add.image(0, 0, "Enhancers", this.faceUp ? 1 : 0);
        this.overlay = scene.add.image(0, 0, "8BitDeck", this.frame);
        this.overlay.setVisible(this.faceUp);

        this.container = scene.add.container(x, y, [this.base, this.overlay]);

        if (clickMode !== ClickMode.none) {
            this.container.setSize(
                this.base.displayWidth,
                this.base.displayHeight,
            );
            this.container.setInteractive({
                useHandCursor: true,
            });

            this.container.on("pointerdown", () => this.handleClick());
        }

        return this.container;
    }

    /** 从场景中移除（销毁 Container 及其子对象） */
    removeFromScene(): void {
        if (this.container) {
            this.container.destroy();
            this.container = null;
            this.base = null;
            this.overlay = null;
            this.scene = null;
        }
    }

    /** 切换牌的正面/背面（带动画） */
    flip(): void {
        if (!this.scene || !this.container || !this.base || !this.overlay)
            return;
        if (this.scene.tweens.isTweening(this.container)) return;

        const showFront = !this.faceUp;

        this.scene.tweens.add({
            targets: this.container,
            scaleX: 0,
            duration: 150,
            ease: "Sine.easeIn",
            onComplete: () => {
                this.faceUp = showFront;
                this.overlay!.setVisible(this.faceUp);
                this.base!.setFrame(this.faceUp ? 1 : 0);

                this.scene!.tweens.add({
                    targets: this.container,
                    scaleX: 1,
                    duration: 150,
                    ease: "Sine.easeOut",
                });
            },
        });
    }

    /** 切换选中/取消选中（带动画） */
    toggleSelect(): void {
        if (!this.scene || !this.container) return;
        if (this.scene.tweens.isTweening(this.container)) return;

        this.selected = !this.selected;

        this.scene.tweens.add({
            targets: this.container,
            y:
                this.container.y +
                (this.selected ? SELECT_OFFSET_Y : -SELECT_OFFSET_Y),
            duration: 150,
            ease: "Back.easeOut",
        });
    }

    /** 查询当前是否处于选中状态 */
    get isSelected(): boolean {
        return this.selected;
    }

    /** 是否为背面朝上 */
    get isFaceDown(): boolean {
        return !this.faceUp;
    }

    // ── 内部处理点击事件 ──────────────────────────────

    private handleClick(): void {
        switch (this.clickMode) {
            case "flip":
                this.flip();
                break;
            case "select":
                this.toggleSelect();
                break;
        }
    }
}
