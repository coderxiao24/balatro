import { Preferences } from "@capacitor/preferences";
import { StatusBar, Style } from "@capacitor/status-bar";

/** 本地存储工具 */
export const preferences = {
    setItem: async (key: string, value: any) => {
        if (typeof value !== "string") {
            value = JSON.stringify(value);
        }
        await Preferences.set({ key, value });
    },
    getItem: async (key: string) => {
        const { value } = await Preferences.get({ key });
        try {
            return JSON.parse(value || "{}");
        } catch (error) {
            return value || "";
        }
    },
    removeItem: async (key: string) => {
        await Preferences.remove({ key });
    },
    clear: async () => {
        await Preferences.clear();
    },
    keys: async () => {
        const { keys } = await Preferences.keys();
        return keys || [];
    },
    async getAll() {
        const res: Record<string, any> = {};
        const keys = await this.keys();
        const values = await Promise.all(
            keys.map((key: string) => this.getItem(key)),
        );

        keys.forEach((key: string, index) => {
            res[key] = values[index];
        });
        return res;
    },
};

export const setupStatusBar = async () => {
    try {
        // 只设置样式和隐藏，不设置 overlay
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.hide();
    } catch (error) {
        console.log("StatusBar not available (running in browser)");
    }
};

/**
 * 计算缩放比：将当前宽度缩放到目标宽度在设计稿（2670）下应占屏幕的比例
 * @param screenTotalWidth 屏幕总宽度（实际可用宽度）
 * @param currentWidth     当前元素/区域的宽度
 * @param targetWidth      设计稿中的目标宽度（默认 2670）
 * @returns 缩放比
 */
export function calcScale(
    screenTotalWidth: number,
    currentWidth: number,
    targetWidth: number = 2670,
): number {
    if (currentWidth <= 0 || targetWidth <= 0) return 1;
    return (screenTotalWidth / 2670) * (targetWidth / currentWidth);
}

/**
 * 根据设计稿上的距离/尺寸，计算实际屏幕上对应的像素值
 * @param screenTotalWidth 屏幕总宽度（实际可用宽度）
 * @param designValue      设计稿上的距离或尺寸值
 * @param designTotalWidth 设计稿总宽度（默认 2670）
 * @returns 实际屏幕上的像素值
 */
export function calcPx(
    screenTotalWidth: number,
    designValue: number,
    designTotalWidth: number = 2670,
): number {
    if (designTotalWidth <= 0) return 0;
    return screenTotalWidth * (designValue / designTotalWidth);
}
