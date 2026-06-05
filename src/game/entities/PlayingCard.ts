import Phaser from "phaser";
import { Suit, PlayingCardValue, PlayingCardClickMode } from "@/types";
import {
    PLAYING_CARD_ALL_SUITS,
    PLAYING_CARD_ALL_VALUES,
    PLAYING_CARD_SUIT_ROW,
    PLAYING_CARD_VALUE_COL,
    PLAYING_CARD_SUIT_NAME,
} from "@/config";

/** 选中时向上位移的像素值 */
const SELECT_OFFSET_Y = -30;

/**
 * 扑克牌类
 *
 * 构造函数可传入指定花色和点数；不传则随机生成一张牌。
 */
export class PlayingCard {
    readonly suit: Suit;
    readonly value: PlayingCardValue;
    readonly frame: number;
    readonly name: string;
    /** 是否正面朝上（可读写，不会带动画，需配合 flip() 或直接更新后用 refreshFace() 同步） */
    faceUp: boolean;
    scale: number = 1;
    /** 添加到场景后的 Container 引用（未添加时为 null） */
    container: Phaser.GameObjects.Container | null = null;

    private scene: Phaser.Scene | null = null;
    private base: Phaser.GameObjects.Image | null = null;
    private overlay: Phaser.GameObjects.Image | null = null;
    private clickMode: PlayingCardClickMode = PlayingCardClickMode.none;
    private selected = false;

    // 长按拖拽相关属性
    private enableDrag = false;
    private longPressTimer: Phaser.Time.TimerEvent | null = null;
    private longPressStartTime = 0;
    private isLongPressTriggered = false;
    private dragOffsetX = 0;
    private dragOffsetY = 0;
    private dragThreshold = 5; // 移动阈值，超过此距离才视为拖拽
    private longPressThreshold = 200; // 长按阈值（毫秒）
    private onDragStartCallback: ((card: PlayingCard) => void) | null = null;
    private onDragEndCallback:
        | ((card: PlayingCard, x: number, y: number) => void)
        | null = null;

    constructor(suit?: Suit, value?: PlayingCardValue, faceUp = true) {
        this.suit =
            suit ??
            PLAYING_CARD_ALL_SUITS[
                Math.floor(Math.random() * PLAYING_CARD_ALL_SUITS.length)
            ];
        this.value =
            value ??
            PLAYING_CARD_ALL_VALUES[
                Math.floor(Math.random() * PLAYING_CARD_ALL_VALUES.length)
            ];
        this.frame =
            PLAYING_CARD_SUIT_ROW[this.suit] * 13 +
            PLAYING_CARD_VALUE_COL[this.value];
        this.name = `${this.value} of ${PLAYING_CARD_SUIT_NAME[this.suit]}`;
        this.faceUp = faceUp;
    }

    /**
     * 将牌添加到场景中
     * @param scene     目标场景
     * @param x         x 坐标
     * @param y         y 坐标
     * @param clickMode 点击交互模式："none" | "flip" | "select"，默认 "none"
     * @param enableDrag 是否启用长按拖拽，默认 false
     */
    addToScene(
        scene: Phaser.Scene,
        x: number,
        y: number,
        clickMode: PlayingCardClickMode = PlayingCardClickMode.none,
        enableDrag = false,
    ): Phaser.GameObjects.Container {
        this.scene = scene;
        this.clickMode = clickMode;
        this.enableDrag = enableDrag;
        this.selected = false;

        // 根据 this.faceUp 决定初始显示
        this.base = scene.add.image(0, 0, "Enhancers", this.faceUp ? 1 : 0);
        this.overlay = scene.add.image(0, 0, "8BitDeck", this.frame);
        this.overlay.setVisible(this.faceUp);

        this.container = scene.add.container(x, y, [this.base, this.overlay]);

        if (clickMode !== PlayingCardClickMode.none || enableDrag) {
            this.container.setSize(
                this.base.displayWidth,
                this.base.displayHeight,
            );
            this.container.setInteractive({
                useHandCursor: true,
            });

            // 注册统一的交互事件
            this.container.on("pointerdown", (pointer: Phaser.Input.Pointer) =>
                this.handlePointerDown(pointer),
            );
            this.container.on("pointermove", (pointer: Phaser.Input.Pointer) =>
                this.handlePointerMove(pointer),
            );
            this.container.on("pointerup", (pointer: Phaser.Input.Pointer) =>
                this.handlePointerUp(pointer),
            );
            // this.container.on(
            //     "pointerupoutside",
            //     (pointer: Phaser.Input.Pointer) =>
            //         this.handlePointerUp(pointer),
            // );
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
                    scaleX: this.scale || 1,
                    duration: 150,
                    ease: "Sine.easeOut",
                });
            },
        });
    }

    setScale(value: number): void {
        this.scale = value;
        this.container?.setScale(value);
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

    // ── 长按拖拽相关方法 ──────────────────────────────

    /** 设置拖拽回调函数 */
    setDragCallbacks(
        onDragStart: (card: PlayingCard) => void,
        onDragEnd: (card: PlayingCard, x: number, y: number) => void,
    ): void {
        this.onDragStartCallback = onDragStart;
        this.onDragEndCallback = onDragEnd;
    }

    /** 获取当前是否正在拖拽 */
    get dragging(): boolean {
        return this.longPressTimer !== null || this.isLongPressTriggered;
    }

    /** 设置长按触发时间（毫秒） */
    setLongPressThreshold(ms: number): void {
        this.longPressThreshold = ms;
    }

    /** 处理指针按下 */
    private handlePointerDown(pointer: Phaser.Input.Pointer): void {
        if (!this.container || !this.scene) return;

        // 取消之前的计时器
        if (this.longPressTimer) {
            this.longPressTimer.destroy();
            this.longPressTimer = null;
        }

        // 记录按下时间和偏移量
        this.longPressStartTime = Date.now();
        this.isLongPressTriggered = false;
        this.dragOffsetX = pointer.x - this.container.x;
        this.dragOffsetY = pointer.y - this.container.y;

        // 如果启用了拖拽，设置长按计时器
        if (this.enableDrag) {
            this.longPressTimer = this.scene.time.delayedCall(
                this.longPressThreshold,
                () => this.triggerLongPress(pointer),
            );
        }
    }

    /** 处理指针移动 */
    private handlePointerMove(pointer: Phaser.Input.Pointer): void {
        if (!this.container || !this.scene) return;

        // 检查是否触发了长按或已经处于拖拽状态
        if (!this.isLongPressTriggered) {
            // 计算移动距离
            const dx = Math.abs(
                pointer.x - this.container.x - this.dragOffsetX,
            );
            const dy = Math.abs(
                pointer.y - this.container.y - this.dragOffsetY,
            );

            // 如果移动超过阈值，立即触发拖拽
            if (dx > this.dragThreshold || dy > this.dragThreshold) {
                // 取消长按计时器
                if (this.longPressTimer) {
                    this.longPressTimer.destroy();
                    this.longPressTimer = null;
                }

                // 如果启用了拖拽且点击模式为select，触发拖拽
                if (
                    this.enableDrag &&
                    this.clickMode === PlayingCardClickMode.select
                ) {
                    this.triggerLongPress(pointer);
                }
            }
        }

        // 如果正在拖拽，更新位置
        if (this.isLongPressTriggered) {
            this.container.x = pointer.x - this.dragOffsetX;
            this.container.y = pointer.y - this.dragOffsetY;
        }
    }

    /** 处理指针释放 */
    private handlePointerUp(pointer: Phaser.Input.Pointer): void {
        if (!this.container || !this.scene) return;

        // 取消长按计时器
        if (this.longPressTimer) {
            this.longPressTimer.destroy();
            this.longPressTimer = null;
        }

        // 如果已触发长按拖拽
        if (this.isLongPressTriggered) {
            this.isLongPressTriggered = false;

            // 触发拖拽结束回调
            this.onDragEndCallback?.(this, this.container.x, this.container.y);
            // 卡片被放回
            this.scene.tweens.add({
                targets: this.container,
                scale: this.scale,
                duration: 100,
                ease: "Back.easeOut",
            });
            // 恢复深度
            this.container.setDepth(0);
        } else {
            // 未触发拖拽，视为点击（仅在启用click模式时）
            if (this.clickMode !== PlayingCardClickMode.none) {
                this.handleClick();
            }
        }
    }

    /** 触发长按拖拽 */
    private triggerLongPress(pointer: Phaser.Input.Pointer): void {
        if (!this.container || !this.scene) return;

        this.isLongPressTriggered = true;
        this.longPressTimer = null;

        // 将卡片置于顶层
        this.container.setDepth(100);

        // 卡片被拿起
        this.scene.tweens.add({
            targets: this.container,
            scale: this.scale * 1.2,
            duration: 100,
            ease: "Back.easeOut",
        });

        // 触发拖拽开始回调
        this.onDragStartCallback?.(this);
    }
}
