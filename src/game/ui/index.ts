import { calcPx } from "@/utils";
import { Geom } from "phaser";
import { AudioManager } from "../manager/AudioManager";

/**
 * 创建一个按钮
 * @param x 按钮的x坐标
 * @param y 按钮的y坐标
 * @param w 按钮的宽度
 * @param h 按钮的高度
 * @param color 按钮的颜色
 * @param text 按钮的文本
 * @param fontSize 按钮的字体大小
 * @param onClick 按钮点击事件
 * @param disabled 是否禁用按钮
 */
export const createButton = (
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
) => {
    const container = scene.add.container(x, y);
    const { width } = scene.cameras.main;

    // 禁用状态的颜色
    const btnColor = disabled ? 0x55666f : color;
    const textColor = disabled ? "#607079" : "#ffffff";

    const btn = scene.add
        .rectangle(0, 0, w, h, btnColor)
        .setRounded(calcPx(width, 12));

    const label = scene.add
        .text(0, 0, text, {
            fontSize: `${fontSize}px`,
            color: textColor,
            fontFamily: "NotoSansSC",
        })
        .setOrigin(0.5);

    container.add([btn, label]);

    // 禁用状态下不添加交互事件
    if (disabled) {
        return container;
    }

    container.setInteractive(
        new Geom.Rectangle(-w / 2, -h / 2, w, h),
        Geom.Rectangle.Contains,
    );

    container.on("pointerover", () => {
        container.y = y + calcPx(width, 12);
        container.setAlpha(0.5);
    });
    container.on("pointerout", () => {
        container.y = y;
        container.setAlpha(1);
    });

    container.on("pointerdown", () => {
        // @ts-ignore
        AudioManager.getInstance().playSound(scene.key, "button", {
            volume: 0.7,
            rate: 0.8,
        });
        onClick();
    });

    return container;
};
