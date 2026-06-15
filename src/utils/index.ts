import { BlindsDataMap, stakeDataMap } from "@/config";
import { BlindNames, StakeNames } from "@/types";
import { Preferences } from "@capacitor/preferences";
import BigNumber from "bignumber.js";

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

/**
 * 计算指定赌注指定盲注指定底注 的得分要求
 * @param {number} [ante=1] - 当前 Ante 等级
 * @param {StakeNames} [stakeName=WhiteStake] - 赌注名称,不传则默认白注
 * @param {BlindNames} [blindName=SmallBlind] - 盲注名称,不传则默认小盲注（获取底注基础得分要求）
 * @returns {BigNumber} - 得分要求
 */
export function getAmount(
    ante: number = 1,
    stakeName: StakeNames = StakeNames.WhiteStake,
    blindName: BlindNames = BlindNames.SmallBlind,
): BigNumber {
    const k = new BigNumber(0.75);

    const blindMult = BlindsDataMap[blindName].mult;
    // 根据难度等级选择预定义数值表
    const amountsList: Record<number, BigNumber[]> = {
        1: [300, 800, 2000, 5000, 11000, 20000, 35000, 50000].map(
            (v) => new BigNumber(v),
        ),
        2: [300, 900, 2600, 8000, 20000, 36000, 60000, 100000].map(
            (v) => new BigNumber(v),
        ),
        3: [300, 1000, 3200, 9000, 25000, 60000, 110000, 200000].map(
            (v) => new BigNumber(v),
        ),
    };

    /**
     * 根据赌注等级选择预定义数值表
     * 绿注以下：难度等级1
     * 绿注以上，紫注以下：难度等级2 所需得分增长速度加快
     * 紫注以上：难度等级3 所需得分增长速度再次加快
     */
    const amounts =
        stakeDataMap[stakeName].stake_level < 3
            ? amountsList[1]
            : stakeDataMap[stakeName].stake_level < 6
              ? amountsList[2]
              : amountsList[3];

    // Ante < 1 的边界情况
    if (ante < 1) {
        return new BigNumber(100);
    }

    // Ante 1-8 使用预定义数值
    if (ante <= 8) {
        return amounts[ante - 1].times(blindMult); // JavaScript 数组从 0 开始
    }

    // Ante > 8 使用指数增长公式
    const a = amounts[7];
    const b = new BigNumber(1.6);
    const c = ante - 8;
    const d = 1 + 0.2 * c;

    // 核心计算：amount = floor(a * (b + (k * c)^d)^c)
    // 注：(k*c)^d 的指数 d 非整数，BigNumber.pow 不支持，此处 k*c 值较小可用 Math.pow
    const innerTerm = new BigNumber(Math.pow(k.toNumber() * c, d));
    let amount = a
        .times(b.plus(innerTerm).pow(c))
        .times(blindMult)
        .integerValue(BigNumber.ROUND_FLOOR);

    // 取整：保留两位有效数字
    const amountStr = amount.toFixed(0, BigNumber.ROUND_FLOOR);
    if (amountStr.length > 2) {
        const firstTwo = amountStr.slice(0, 2);
        const zeros = "0".repeat(amountStr.length - 2);
        amount = new BigNumber(firstTwo + zeros);
    }

    return amount;
}
