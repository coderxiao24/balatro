import { calcPx } from "@/utils";
import { Geom, GameObjects } from "phaser";
import { AudioManager } from "../manager/AudioManager";

export class GameButton {
    container: GameObjects.Container;
    btnColor: number;
    textColor: string = "#ffffff";
    btnBg: GameObjects.Rectangle;
    btnText: GameObjects.Text;
    fontSize: number;
    LONG_PRESS_THRESHOLD: number = 300;
    isPointerDown: boolean = false;
    pressStartTime: number = 0;
    startX: number = 0;
    startY: number = 0;
    scene: Phaser.Scene;
    onClick: () => void;
    originXY: { x: number; y: number };
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        w: number,
        h: number,
        color: number,
        text: string,
        fontSize: number,
        onClick: () => void,
        disabled: boolean = false,
    ) {
        const container = scene.add.container(x, y);

        this.originXY = { x, y };
        this.scene = scene;
        this.btnColor = color;
        this.fontSize = fontSize;

        this.btnBg = scene.add
            .rectangle(0, 0, w, h, this.btnColor)
            .setRounded(calcPx(this.scene.cameras.main.width, 12));

        this.btnText = scene.add
            .text(0, 0, text, {
                fontSize: `${this.fontSize}px`,
                color: this.textColor,
                fontFamily: "NotoSansSC",
            })
            .setOrigin(0.5);

        container.add([this.btnBg, this.btnText]);

        container.setInteractive(
            new Geom.Rectangle(-w / 2, -h / 2, w, h),
            Geom.Rectangle.Contains,
        );

        this.onClick = onClick;
        this.container = container;
        this.setDisabled(disabled);
    }

    setDisabled(disabled: boolean) {
        this.btnBg.fillColor = disabled ? 0x666666 : this.btnColor;
        this.btnText.setColor(disabled ? "#7A7A7A" : this.textColor);
        this.container.setAlpha(1);
        this.container.y = this.originXY.y;
        if (disabled) {
            this.clearEvent();
        } else {
            this.bindEvent();
        }
    }

    bindEvent() {
        const { width } = this.scene.cameras.main;
        this.container.on("pointerover", () => {
            this.container.y = this.originXY.y + calcPx(width, 12);
            this.container.setAlpha(0.5);
        });

        this.container.on("pointerout", () => {
            this.container.y = this.originXY.y;
            this.container.setAlpha(1);
            // 如果滑出按钮区域，重置按下状态
            this.isPointerDown = false;
        });

        //  按下时：记录时间和初始位置
        this.container.on("pointerdown", (_pointer: Phaser.Input.Pointer) => {
            this.isPointerDown = true;
            this.pressStartTime = Date.now();
            this.startX = _pointer.x;
            this.startY = _pointer.y;
            this.container.setAlpha(0.5);
        });

        //  松开时：判断是否为有效点击
        this.container.on("pointerup", (_pointer: Phaser.Input.Pointer) => {
            if (!this.isPointerDown) return; // 防止重复触发或滑出后再松开
            this.container.setAlpha(1);
            const duration = Date.now() - this.pressStartTime;
            const distance = Math.sqrt(
                Math.pow(_pointer.x - this.startX, 2) +
                    Math.pow(_pointer.y - this.startY, 2),
            );

            // 重置状态
            this.isPointerDown = false;

            // 只有当 按下时间小于阈值 且 手指没有发生明显位移 时，才视为有效点击
            if (duration < this.LONG_PRESS_THRESHOLD && distance < 10) {
                AudioManager.getInstance().playSound(
                    this.scene.scene.key,
                    "button",
                    {
                        volume: 0.7,
                        rate: 0.8,
                    },
                );
                this.onClick();
            }
        });
    }

    clearEvent() {
        this.container.off("pointerdown");
        this.container.off("pointerup");
        this.container.off("pointerover");
        this.container.off("pointerout");
    }
}
