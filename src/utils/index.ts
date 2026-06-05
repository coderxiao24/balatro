import { PLAYING_CARDS } from "@/config/index";
import { Preferences } from "@capacitor/preferences";
import { StatusBar, Style } from "@capacitor/status-bar";
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

/** 根据 key（如 "Hearts_Ace"）快速查找一张牌 */
export function getPokerCard(key: string) {
    return PLAYING_CARDS[key];
}
