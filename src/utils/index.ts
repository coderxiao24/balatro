import { BlindsDataMap, stakeDataMap } from "@/config";
import { PlayingCard } from "@/game/entities/PlayingCard";
import {
    BlindNames,
    HandTypes,
    PlayingCardValues,
    StakeNames,
    Suits,
} from "@/types";
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
export function getScore(
    ante: number = 1,
    stakeName: StakeNames = StakeNames.WhiteStake,
    blindName: BlindNames = BlindNames.SmallBlind,
): BigNumber {
    const k = new BigNumber(0.75);

    const blindMult = BlindsDataMap[blindName].mult;

    // 根据难度等级选择预定义数值表
    const scoresList: Record<number, BigNumber[]> = {
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
    const scores =
        stakeDataMap[stakeName].stake_level < 3
            ? scoresList[1]
            : stakeDataMap[stakeName].stake_level < 6
              ? scoresList[2]
              : scoresList[3];

    // Ante < 1 的边界情况
    if (ante < 1) {
        return new BigNumber(100);
    }

    // Ante 1-8 使用预定义数值
    if (ante <= 8) {
        return scores[ante - 1].times(blindMult); // JavaScript 数组从 0 开始
    }

    // Ante > 8 使用指数增长公式
    const a = scores[7];
    const b = new BigNumber(1.6);
    const c = ante - 8;
    const d = 1 + 0.2 * c;

    // 核心计算：score = floor(a * (b + (k * c)^d)^c)
    // 注：(k*c)^d 的指数 d 非整数，BigNumber.pow 不支持，此处 k*c 值较小可用 Math.pow
    const innerTerm = new BigNumber(Math.pow(k.toNumber() * c, d));
    let score = a
        .times(b.plus(innerTerm).pow(c))
        .times(blindMult)
        .integerValue(BigNumber.ROUND_FLOOR);

    // 取整：保留两位有效数字
    const scoreStr = score.toFixed(0, BigNumber.ROUND_FLOOR);
    if (scoreStr.length > 2) {
        const firstTwo = scoreStr.slice(0, 2);
        const zeros = "0".repeat(scoreStr.length - 2);
        score = new BigNumber(firstTwo + zeros);
    }

    return score;
}

/**
 * 将 16进制格式颜色值变暗 (乘以指定系数)
 * @param {number} hexColor
 * @param {number} [factor=0.7] 变暗系数，默认 0.7 保留70% 亮度
 * @returns {number} 变暗后的颜色
 */
export function darkenHexNumber(hexColor: number, factor = 0.7) {
    const r = (hexColor >> 16) & 0xff;
    const g = (hexColor >> 8) & 0xff;
    const b = hexColor & 0xff;
    const newR = Math.max(0, Math.min(255, Math.round(r * factor)));
    const newG = Math.max(0, Math.min(255, Math.round(g * factor)));
    const newB = Math.max(0, Math.min(255, Math.round(b * factor)));
    return (newR << 16) | (newG << 8) | newB;
}

/**
 * 将任意格式的 Hex 颜色字符串转换为 16进制数字 (0xRRGGBB)
 * @param {string} hex - 例如 '#fff', '#000000', '#1478B4'
 * @returns {number} 返回纯数字，例如 0xFFFFFF, 0x000000, 0x1478B4
 */
export function stringToHexNumber(hex: string) {
    let cleanHex = hex.replace(/^#/, "").toUpperCase();

    if (cleanHex.length === 3 || cleanHex.length === 4) {
        cleanHex = cleanHex
            .split("")
            .map((char) => char + char)
            .join("");
    }

    return parseInt(cleanHex.substring(0, 6), 16);
}
/**
 * 根据扑克牌数组判断牌型
 * @param playingCards 手牌数组
 * @returns 牌型
 */
export function getHandTypeByPlayingCards(playingCards: PlayingCard[]) {
    const playingCardValuesMap: Record<PlayingCardValues, number> = {
        [PlayingCardValues.Two]: 0,
        [PlayingCardValues.Three]: 0,
        [PlayingCardValues.Four]: 0,
        [PlayingCardValues.Five]: 0,
        [PlayingCardValues.Six]: 0,
        [PlayingCardValues.Seven]: 0,
        [PlayingCardValues.Eight]: 0,
        [PlayingCardValues.Nine]: 0,
        [PlayingCardValues.Ten]: 0,
        [PlayingCardValues.Jack]: 0,
        [PlayingCardValues.Queen]: 0,
        [PlayingCardValues.King]: 0,
        [PlayingCardValues.Ace]: 0,
    };

    const playingCardSuitsMap: Record<Suits, number> = {
        [Suits.Hearts]: 0,
        [Suits.Diamonds]: 0,
        [Suits.Clubs]: 0,
        [Suits.Spades]: 0,
    };

    playingCards.forEach((card) => {
        playingCardValuesMap[card.value]++;
        playingCardSuitsMap[card.suit]++;
    });

    const valueCounts = Object.values(playingCardValuesMap)
        .filter((value) => value > 0)
        .sort((a, b) => b - a);

    /** 是否为顺子 */
    const isStraight = getIsStraight(playingCardValuesMap);

    /** 是否为同花 */
    const isFlush = Object.values(playingCardSuitsMap).some(
        (count) => count >= 5,
    );

    if (isFlush && valueCounts[0] === 5) {
        return HandTypes.FlushFive;
    }

    if (isFlush && valueCounts[0] === 3 && valueCounts[1] === 2) {
        return HandTypes.FlushHouse;
    }

    if (valueCounts[0] === 5) {
        return HandTypes.FiveOfAKind;
    }

    if (isFlush && getIsRoyalStraight(playingCardValuesMap)) {
        return HandTypes.RoyalFlush;
    }

    if (isFlush && isStraight) {
        return HandTypes.StraightFlush;
    }

    if (valueCounts[0] === 4) {
        return HandTypes.FourOfAKind;
    }

    if (valueCounts[0] === 3 && valueCounts[1] === 2) {
        return HandTypes.FullHouse;
    }

    if (isFlush) {
        return HandTypes.Flush;
    }

    if (isStraight) {
        return HandTypes.Straight;
    }

    if (valueCounts[0] === 3) {
        return HandTypes.ThreeOfAKind;
    }

    if (valueCounts[0] === 2 && valueCounts[1] === 2) {
        return HandTypes.TwoPair;
    }
    if (valueCounts[0] === 2) {
        return HandTypes.Pair;
    }
    return HandTypes.HighCard;
}

/**
 * 判断手牌是否构成顺子
 * @param playingCardValuesMap 牌值计数的Map
 * @returns 是否为顺子
 */
function getIsStraight(
    playingCardValuesMap: Record<PlayingCardValues, number>,
): boolean {
    //提取所有计数 > 0 的牌值，转为数字并排序
    const activeValues = Object.keys(playingCardValuesMap)
        .filter((key) => playingCardValuesMap[key as PlayingCardValues] > 0)
        .map((key) => Number(key)) // 将 "1", "2" ... "13" 转为数字
        .sort((a, b) => a - b);

    // 去重后不足5张，不可能是顺子
    if (activeValues.length < 5) return false;

    // 首尾差值为4，且没有重复牌（因为activeValues是去重后的长度）
    const isNormalStraight = activeValues[4] - activeValues[0] === 4;

    // 检查是否通天顺：10-J-Q-K-A
    const isRoyalStraight = getIsRoyalStraight(playingCardValuesMap);

    return isNormalStraight || isRoyalStraight;
}

/**
 * 判断手牌是否构成通天顺（10-J-Q-K-A）
 * @param playingCardValuesMap 牌值计数的Map
 * @returns 是否为通天顺
 */
function getIsRoyalStraight(
    playingCardValuesMap: Record<PlayingCardValues, number>,
): boolean {
    return (
        playingCardValuesMap[PlayingCardValues.Ten] > 0 &&
        playingCardValuesMap[PlayingCardValues.Jack] > 0 &&
        playingCardValuesMap[PlayingCardValues.Queen] > 0 &&
        playingCardValuesMap[PlayingCardValues.King] > 0 &&
        playingCardValuesMap[PlayingCardValues.Ace] > 0
    );
}
