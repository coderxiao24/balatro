import { Preferences } from "@capacitor/preferences";

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
