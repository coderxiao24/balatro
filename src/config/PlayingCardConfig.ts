import { Suits, PlayingCardValues, PlayingCardDict } from "@/types";

/** 花色的行索引（用于计算 frame） */
export const PLAYING_CARD_SUIT_ROW: Record<Suits, number> = {
    [Suits.Hearts]: 0,
    [Suits.Clubs]: 1,
    [Suits.Diamonds]: 2,
    [Suits.Spades]: 3,
};

/** PlayingCardValues 在行内的列索引 */
export const PLAYING_CARD_VALUE_COL: Record<PlayingCardValues, number> = {
    [PlayingCardValues.Two]: 0,
    [PlayingCardValues.Three]: 1,
    [PlayingCardValues.Four]: 2,
    [PlayingCardValues.Five]: 3,
    [PlayingCardValues.Six]: 4,
    [PlayingCardValues.Seven]: 5,
    [PlayingCardValues.Eight]: 6,
    [PlayingCardValues.Nine]: 7,
    [PlayingCardValues.Ten]: 8,
    [PlayingCardValues.Jack]: 9,
    [PlayingCardValues.Queen]: 10,
    [PlayingCardValues.King]: 11,
    [PlayingCardValues.Ace]: 12,
};

/** 所有 Suits 枚举值数组（用于随机） */
export const PLAYING_CARD_ALL_SUITS = Object.values(Suits);

/** 所有 PlayingCardValues 枚举值数组（用于随机） */
export const PLAYING_CARD_ALL_VALUES = Object.values(PlayingCardValues);

/** 花色英文名 */
export const PLAYING_CARD_SUIT_NAME: Record<Suits, string> = {
    [Suits.Hearts]: "Hearts",
    [Suits.Clubs]: "Clubs",
    [Suits.Diamonds]: "Diamonds",
    [Suits.Spades]: "Spades",
};

/** 扑克牌数据字典 */
export const PLAYING_CARDS: PlayingCardDict = {
    [`${Suits.Hearts}_${PlayingCardValues.Two}`]: {
        name: "2 of Hearts",
        value: PlayingCardValues.Two,
        suit: Suits.Hearts,
        frame: 0,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Three}`]: {
        name: "3 of Hearts",
        value: PlayingCardValues.Three,
        suit: Suits.Hearts,
        frame: 1,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Four}`]: {
        name: "4 of Hearts",
        value: PlayingCardValues.Four,
        suit: Suits.Hearts,
        frame: 2,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Five}`]: {
        name: "5 of Hearts",
        value: PlayingCardValues.Five,
        suit: Suits.Hearts,
        frame: 3,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Six}`]: {
        name: "6 of Hearts",
        value: PlayingCardValues.Six,
        suit: Suits.Hearts,
        frame: 4,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Seven}`]: {
        name: "7 of Hearts",
        value: PlayingCardValues.Seven,
        suit: Suits.Hearts,
        frame: 5,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Eight}`]: {
        name: "8 of Hearts",
        value: PlayingCardValues.Eight,
        suit: Suits.Hearts,
        frame: 6,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Nine}`]: {
        name: "9 of Hearts",
        value: PlayingCardValues.Nine,
        suit: Suits.Hearts,
        frame: 7,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Ten}`]: {
        name: "10 of Hearts",
        value: PlayingCardValues.Ten,
        suit: Suits.Hearts,
        frame: 8,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Jack}`]: {
        name: "Jack of Hearts",
        value: PlayingCardValues.Jack,
        suit: Suits.Hearts,
        frame: 9,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Queen}`]: {
        name: "Queen of Hearts",
        value: PlayingCardValues.Queen,
        suit: Suits.Hearts,
        frame: 10,
    },
    [`${Suits.Hearts}_${PlayingCardValues.King}`]: {
        name: "King of Hearts",
        value: PlayingCardValues.King,
        suit: Suits.Hearts,
        frame: 11,
    },
    [`${Suits.Hearts}_${PlayingCardValues.Ace}`]: {
        name: "Ace of Hearts",
        value: PlayingCardValues.Ace,
        suit: Suits.Hearts,
        frame: 12,
    },

    [`${Suits.Clubs}_${PlayingCardValues.Two}`]: {
        name: "2 of Clubs",
        value: PlayingCardValues.Two,
        suit: Suits.Clubs,
        frame: 13,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Three}`]: {
        name: "3 of Clubs",
        value: PlayingCardValues.Three,
        suit: Suits.Clubs,
        frame: 14,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Four}`]: {
        name: "4 of Clubs",
        value: PlayingCardValues.Four,
        suit: Suits.Clubs,
        frame: 15,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Five}`]: {
        name: "5 of Clubs",
        value: PlayingCardValues.Five,
        suit: Suits.Clubs,
        frame: 16,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Six}`]: {
        name: "6 of Clubs",
        value: PlayingCardValues.Six,
        suit: Suits.Clubs,
        frame: 17,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Seven}`]: {
        name: "7 of Clubs",
        value: PlayingCardValues.Seven,
        suit: Suits.Clubs,
        frame: 18,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Eight}`]: {
        name: "8 of Clubs",
        value: PlayingCardValues.Eight,
        suit: Suits.Clubs,
        frame: 19,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Nine}`]: {
        name: "9 of Clubs",
        value: PlayingCardValues.Nine,
        suit: Suits.Clubs,
        frame: 20,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Ten}`]: {
        name: "10 of Clubs",
        value: PlayingCardValues.Ten,
        suit: Suits.Clubs,
        frame: 21,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Jack}`]: {
        name: "Jack of Clubs",
        value: PlayingCardValues.Jack,
        suit: Suits.Clubs,
        frame: 22,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Queen}`]: {
        name: "Queen of Clubs",
        value: PlayingCardValues.Queen,
        suit: Suits.Clubs,
        frame: 23,
    },
    [`${Suits.Clubs}_${PlayingCardValues.King}`]: {
        name: "King of Clubs",
        value: PlayingCardValues.King,
        suit: Suits.Clubs,
        frame: 24,
    },
    [`${Suits.Clubs}_${PlayingCardValues.Ace}`]: {
        name: "Ace of Clubs",
        value: PlayingCardValues.Ace,
        suit: Suits.Clubs,
        frame: 25,
    },

    [`${Suits.Diamonds}_${PlayingCardValues.Two}`]: {
        name: "2 of Diamonds",
        value: PlayingCardValues.Two,
        suit: Suits.Diamonds,
        frame: 26,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Three}`]: {
        name: "3 of Diamonds",
        value: PlayingCardValues.Three,
        suit: Suits.Diamonds,
        frame: 27,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Four}`]: {
        name: "4 of Diamonds",
        value: PlayingCardValues.Four,
        suit: Suits.Diamonds,
        frame: 28,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Five}`]: {
        name: "5 of Diamonds",
        value: PlayingCardValues.Five,
        suit: Suits.Diamonds,
        frame: 29,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Six}`]: {
        name: "6 of Diamonds",
        value: PlayingCardValues.Six,
        suit: Suits.Diamonds,
        frame: 30,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Seven}`]: {
        name: "7 of Diamonds",
        value: PlayingCardValues.Seven,
        suit: Suits.Diamonds,
        frame: 31,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Eight}`]: {
        name: "8 of Diamonds",
        value: PlayingCardValues.Eight,
        suit: Suits.Diamonds,
        frame: 32,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Nine}`]: {
        name: "9 of Diamonds",
        value: PlayingCardValues.Nine,
        suit: Suits.Diamonds,
        frame: 33,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Ten}`]: {
        name: "10 of Diamonds",
        value: PlayingCardValues.Ten,
        suit: Suits.Diamonds,
        frame: 34,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Jack}`]: {
        name: "Jack of Diamonds",
        value: PlayingCardValues.Jack,
        suit: Suits.Diamonds,
        frame: 35,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Queen}`]: {
        name: "Queen of Diamonds",
        value: PlayingCardValues.Queen,
        suit: Suits.Diamonds,
        frame: 36,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.King}`]: {
        name: "King of Diamonds",
        value: PlayingCardValues.King,
        suit: Suits.Diamonds,
        frame: 37,
    },
    [`${Suits.Diamonds}_${PlayingCardValues.Ace}`]: {
        name: "Ace of Diamonds",
        value: PlayingCardValues.Ace,
        suit: Suits.Diamonds,
        frame: 38,
    },

    [`${Suits.Spades}_${PlayingCardValues.Two}`]: {
        name: "2 of Spades",
        value: PlayingCardValues.Two,
        suit: Suits.Spades,
        frame: 39,
    },
    [`${Suits.Spades}_${PlayingCardValues.Three}`]: {
        name: "3 of Spades",
        value: PlayingCardValues.Three,
        suit: Suits.Spades,
        frame: 40,
    },
    [`${Suits.Spades}_${PlayingCardValues.Four}`]: {
        name: "4 of Spades",
        value: PlayingCardValues.Four,
        suit: Suits.Spades,
        frame: 41,
    },
    [`${Suits.Spades}_${PlayingCardValues.Five}`]: {
        name: "5 of Spades",
        value: PlayingCardValues.Five,
        suit: Suits.Spades,
        frame: 42,
    },
    [`${Suits.Spades}_${PlayingCardValues.Six}`]: {
        name: "6 of Spades",
        value: PlayingCardValues.Six,
        suit: Suits.Spades,
        frame: 43,
    },
    [`${Suits.Spades}_${PlayingCardValues.Seven}`]: {
        name: "7 of Spades",
        value: PlayingCardValues.Seven,
        suit: Suits.Spades,
        frame: 44,
    },
    [`${Suits.Spades}_${PlayingCardValues.Eight}`]: {
        name: "8 of Spades",
        value: PlayingCardValues.Eight,
        suit: Suits.Spades,
        frame: 45,
    },
    [`${Suits.Spades}_${PlayingCardValues.Nine}`]: {
        name: "9 of Spades",
        value: PlayingCardValues.Nine,
        suit: Suits.Spades,
        frame: 46,
    },
    [`${Suits.Spades}_${PlayingCardValues.Ten}`]: {
        name: "10 of Spades",
        value: PlayingCardValues.Ten,
        suit: Suits.Spades,
        frame: 47,
    },
    [`${Suits.Spades}_${PlayingCardValues.Jack}`]: {
        name: "Jack of Spades",
        value: PlayingCardValues.Jack,
        suit: Suits.Spades,
        frame: 48,
    },
    [`${Suits.Spades}_${PlayingCardValues.Queen}`]: {
        name: "Queen of Spades",
        value: PlayingCardValues.Queen,
        suit: Suits.Spades,
        frame: 49,
    },
    [`${Suits.Spades}_${PlayingCardValues.King}`]: {
        name: "King of Spades",
        value: PlayingCardValues.King,
        suit: Suits.Spades,
        frame: 50,
    },
    [`${Suits.Spades}_${PlayingCardValues.Ace}`]: {
        name: "Ace of Spades",
        value: PlayingCardValues.Ace,
        suit: Suits.Spades,
        frame: 51,
    },
};

/** 以数组形式获取全部 52 张牌 */
export const ALL_PLAYING_CARDS = Object.values(PLAYING_CARDS);
