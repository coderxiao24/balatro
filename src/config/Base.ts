import { AudioManager } from "@/game/manager/AudioManager";
import {
    AnteScore,
    BlindCardsType,
    Decks,
    PlayingCard,
    sceneNames,
    Stakes,
} from "@/types";
import BigNumber from "bignumber.js";

export const scenesBGMMap: Record<sceneNames, () => void> = {
    [sceneNames.MainMenu]: () => {
        AudioManager.getInstance().playMusic("music1", {
            volume: 0.6,
            rate: 0.7,
            fadeIn: 3 * 1000,
            protected: true, // 受保护，场景切换时不会被清理
        });
    },
    [sceneNames.Boot]: () => {},
    [sceneNames.Game]: () => {
        // 检查 music1 是否已经在播放（从 MainMenu 切换过来）
        const existingMusic = AudioManager.getInstance().getMusic("music1");
        if (!existingMusic || !existingMusic.isPlaying) {
            // 如果没有播放，才开始播放
            AudioManager.getInstance().playMusic("music1", {
                volume: 0.6,
                rate: 0.7,
                fadeIn: 3 * 1000,
                protected: true,
            });
        }
    },
    [sceneNames.GameOver]: () => {},
    [sceneNames.Preloader]: () => {},
    [sceneNames.Splash]: () => {},
};

/**
 *   赌注分数数组 索引代表底注等级
 */
const anteScoreArr: AnteScore[] = [
    {
        [Stakes.WhiteStake]: new BigNumber("100"),
        [Stakes.GreenStake]: new BigNumber("100"),
        [Stakes.PurpleStake]: new BigNumber("100"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("300"),
        [Stakes.GreenStake]: new BigNumber("300"),
        [Stakes.PurpleStake]: new BigNumber("300"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("800"),
        [Stakes.GreenStake]: new BigNumber("900"),
        [Stakes.PurpleStake]: new BigNumber("1000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("2000"),
        [Stakes.GreenStake]: new BigNumber("2600"),
        [Stakes.PurpleStake]: new BigNumber("3200"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("5000"),
        [Stakes.GreenStake]: new BigNumber("8000"),
        [Stakes.PurpleStake]: new BigNumber("9000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("11000"),
        [Stakes.GreenStake]: new BigNumber("20000"),
        [Stakes.PurpleStake]: new BigNumber("25000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("20000"),
        [Stakes.GreenStake]: new BigNumber("36000"),
        [Stakes.PurpleStake]: new BigNumber("60000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("35000"),
        [Stakes.GreenStake]: new BigNumber("60000"),
        [Stakes.PurpleStake]: new BigNumber("110000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("50000"),
        [Stakes.GreenStake]: new BigNumber("100000"),
        [Stakes.PurpleStake]: new BigNumber("200000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("110000"),
        [Stakes.GreenStake]: new BigNumber("200000"),
        [Stakes.PurpleStake]: new BigNumber("410000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("560000"),
        [Stakes.GreenStake]: new BigNumber("1000000"),
        [Stakes.PurpleStake]: new BigNumber("2000000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("7200000"),
        [Stakes.GreenStake]: new BigNumber("13000000"),
        [Stakes.PurpleStake]: new BigNumber("26000000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("300000000"),
        [Stakes.GreenStake]: new BigNumber("540000000"),
        [Stakes.PurpleStake]: new BigNumber("1000000000"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("47000000000"),
        [Stakes.GreenStake]: new BigNumber("84000000000"),
        [Stakes.PurpleStake]: new BigNumber("1.60E+11"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("2.90E+13"),
        [Stakes.GreenStake]: new BigNumber("5.30E+13"),
        [Stakes.PurpleStake]: new BigNumber("1.00E+14"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("7.70E+16"),
        [Stakes.GreenStake]: new BigNumber("1.30E+17"),
        [Stakes.PurpleStake]: new BigNumber("2.70E+17"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("8.60E+20"),
        [Stakes.GreenStake]: new BigNumber("1.50E+21"),
        [Stakes.PurpleStake]: new BigNumber("3.10E+21"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("4.20E+25"),
        [Stakes.GreenStake]: new BigNumber("7.60E+25"),
        [Stakes.PurpleStake]: new BigNumber("1.50E+26"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("9.20E+30"),
        [Stakes.GreenStake]: new BigNumber("1.50E+31"),
        [Stakes.PurpleStake]: new BigNumber("3.30E+31"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("9.20E+36"),
        [Stakes.GreenStake]: new BigNumber("1.60E+37"),
        [Stakes.PurpleStake]: new BigNumber("3.30E+37"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("4.30E+43"),
        [Stakes.GreenStake]: new BigNumber("7.70E+43"),
        [Stakes.PurpleStake]: new BigNumber("1.50E+44"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("9.70E+50"),
        [Stakes.GreenStake]: new BigNumber("1.70E+51"),
        [Stakes.PurpleStake]: new BigNumber("3.40E+51"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("1.00E+59"),
        [Stakes.GreenStake]: new BigNumber("1.90E+59"),
        [Stakes.PurpleStake]: new BigNumber("3.80E+59"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("5.60E+67"),
        [Stakes.GreenStake]: new BigNumber("1.00E+68"),
        [Stakes.PurpleStake]: new BigNumber("2.10E+68"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("1.60E+77"),
        [Stakes.GreenStake]: new BigNumber("2.90E+77"),
        [Stakes.PurpleStake]: new BigNumber("5.90E+77"),
    },
    {
        [Stakes.WhiteStake]: new BigNumber("2.40E+87"),
        [Stakes.GreenStake]: new BigNumber("4.40E+87"),
        [Stakes.PurpleStake]: new BigNumber("8.80E+87"),
    },
];

export const blindCardsBtnTextMap = {
    [BlindCardsType.Active]: "选择",
    [BlindCardsType.Next]: "下一回合",
    [BlindCardsType.Pass]: "已被击败",
    [BlindCardsType.Skip]: "跳过",
};

export interface BlindCardData {
    CardsType: BlindCardsType;
    [key: string]: any;
}

export interface GameData {
    deck: Decks;
    stake: Stakes;
    ante: number;
    round: number;
    playingCard: PlayingCard[];
    historyBlinds: BlindCardData[];
    handLimit: number;
}
