import { Suit, PlayingCardValue, PlayingCardDict } from "@/types";

/** 花色的行索引（用于计算 frame） */
export const PLAYING_CARD_SUIT_ROW: Record<Suit, number> = {
    [Suit.Hearts]: 0,
    [Suit.Clubs]: 1,
    [Suit.Diamonds]: 2,
    [Suit.Spades]: 3,
};

/** PlayingCardValue 在行内的列索引 */
export const PLAYING_CARD_VALUE_COL: Record<PlayingCardValue, number> = {
    [PlayingCardValue.Two]: 0,
    [PlayingCardValue.Three]: 1,
    [PlayingCardValue.Four]: 2,
    [PlayingCardValue.Five]: 3,
    [PlayingCardValue.Six]: 4,
    [PlayingCardValue.Seven]: 5,
    [PlayingCardValue.Eight]: 6,
    [PlayingCardValue.Nine]: 7,
    [PlayingCardValue.Ten]: 8,
    [PlayingCardValue.Jack]: 9,
    [PlayingCardValue.Queen]: 10,
    [PlayingCardValue.King]: 11,
    [PlayingCardValue.Ace]: 12,
};

/** 所有 Suit 枚举值数组（用于随机） */
export const PLAYING_CARD_ALL_SUITS = Object.values(Suit);

/** 所有 PlayingCardValue 枚举值数组（用于随机） */
export const PLAYING_CARD_ALL_VALUES = Object.values(PlayingCardValue);

/** 花色英文名 */
export const PLAYING_CARD_SUIT_NAME: Record<Suit, string> = {
    [Suit.Hearts]: "Hearts",
    [Suit.Clubs]: "Clubs",
    [Suit.Diamonds]: "Diamonds",
    [Suit.Spades]: "Spades",
};

/** 扑克牌数据字典 */
export const PLAYING_CARDS: PlayingCardDict = {
    [`${Suit.Hearts}_${PlayingCardValue.Two}`]: {
        name: "2 of Hearts",
        value: PlayingCardValue.Two,
        suit: Suit.Hearts,
        frame: 0,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Three}`]: {
        name: "3 of Hearts",
        value: PlayingCardValue.Three,
        suit: Suit.Hearts,
        frame: 1,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Four}`]: {
        name: "4 of Hearts",
        value: PlayingCardValue.Four,
        suit: Suit.Hearts,
        frame: 2,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Five}`]: {
        name: "5 of Hearts",
        value: PlayingCardValue.Five,
        suit: Suit.Hearts,
        frame: 3,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Six}`]: {
        name: "6 of Hearts",
        value: PlayingCardValue.Six,
        suit: Suit.Hearts,
        frame: 4,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Seven}`]: {
        name: "7 of Hearts",
        value: PlayingCardValue.Seven,
        suit: Suit.Hearts,
        frame: 5,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Eight}`]: {
        name: "8 of Hearts",
        value: PlayingCardValue.Eight,
        suit: Suit.Hearts,
        frame: 6,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Nine}`]: {
        name: "9 of Hearts",
        value: PlayingCardValue.Nine,
        suit: Suit.Hearts,
        frame: 7,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Ten}`]: {
        name: "10 of Hearts",
        value: PlayingCardValue.Ten,
        suit: Suit.Hearts,
        frame: 8,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Jack}`]: {
        name: "Jack of Hearts",
        value: PlayingCardValue.Jack,
        suit: Suit.Hearts,
        frame: 9,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Queen}`]: {
        name: "Queen of Hearts",
        value: PlayingCardValue.Queen,
        suit: Suit.Hearts,
        frame: 10,
    },
    [`${Suit.Hearts}_${PlayingCardValue.King}`]: {
        name: "King of Hearts",
        value: PlayingCardValue.King,
        suit: Suit.Hearts,
        frame: 11,
    },
    [`${Suit.Hearts}_${PlayingCardValue.Ace}`]: {
        name: "Ace of Hearts",
        value: PlayingCardValue.Ace,
        suit: Suit.Hearts,
        frame: 12,
    },

    [`${Suit.Clubs}_${PlayingCardValue.Two}`]: {
        name: "2 of Clubs",
        value: PlayingCardValue.Two,
        suit: Suit.Clubs,
        frame: 13,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Three}`]: {
        name: "3 of Clubs",
        value: PlayingCardValue.Three,
        suit: Suit.Clubs,
        frame: 14,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Four}`]: {
        name: "4 of Clubs",
        value: PlayingCardValue.Four,
        suit: Suit.Clubs,
        frame: 15,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Five}`]: {
        name: "5 of Clubs",
        value: PlayingCardValue.Five,
        suit: Suit.Clubs,
        frame: 16,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Six}`]: {
        name: "6 of Clubs",
        value: PlayingCardValue.Six,
        suit: Suit.Clubs,
        frame: 17,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Seven}`]: {
        name: "7 of Clubs",
        value: PlayingCardValue.Seven,
        suit: Suit.Clubs,
        frame: 18,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Eight}`]: {
        name: "8 of Clubs",
        value: PlayingCardValue.Eight,
        suit: Suit.Clubs,
        frame: 19,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Nine}`]: {
        name: "9 of Clubs",
        value: PlayingCardValue.Nine,
        suit: Suit.Clubs,
        frame: 20,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Ten}`]: {
        name: "10 of Clubs",
        value: PlayingCardValue.Ten,
        suit: Suit.Clubs,
        frame: 21,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Jack}`]: {
        name: "Jack of Clubs",
        value: PlayingCardValue.Jack,
        suit: Suit.Clubs,
        frame: 22,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Queen}`]: {
        name: "Queen of Clubs",
        value: PlayingCardValue.Queen,
        suit: Suit.Clubs,
        frame: 23,
    },
    [`${Suit.Clubs}_${PlayingCardValue.King}`]: {
        name: "King of Clubs",
        value: PlayingCardValue.King,
        suit: Suit.Clubs,
        frame: 24,
    },
    [`${Suit.Clubs}_${PlayingCardValue.Ace}`]: {
        name: "Ace of Clubs",
        value: PlayingCardValue.Ace,
        suit: Suit.Clubs,
        frame: 25,
    },

    [`${Suit.Diamonds}_${PlayingCardValue.Two}`]: {
        name: "2 of Diamonds",
        value: PlayingCardValue.Two,
        suit: Suit.Diamonds,
        frame: 26,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Three}`]: {
        name: "3 of Diamonds",
        value: PlayingCardValue.Three,
        suit: Suit.Diamonds,
        frame: 27,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Four}`]: {
        name: "4 of Diamonds",
        value: PlayingCardValue.Four,
        suit: Suit.Diamonds,
        frame: 28,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Five}`]: {
        name: "5 of Diamonds",
        value: PlayingCardValue.Five,
        suit: Suit.Diamonds,
        frame: 29,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Six}`]: {
        name: "6 of Diamonds",
        value: PlayingCardValue.Six,
        suit: Suit.Diamonds,
        frame: 30,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Seven}`]: {
        name: "7 of Diamonds",
        value: PlayingCardValue.Seven,
        suit: Suit.Diamonds,
        frame: 31,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Eight}`]: {
        name: "8 of Diamonds",
        value: PlayingCardValue.Eight,
        suit: Suit.Diamonds,
        frame: 32,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Nine}`]: {
        name: "9 of Diamonds",
        value: PlayingCardValue.Nine,
        suit: Suit.Diamonds,
        frame: 33,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Ten}`]: {
        name: "10 of Diamonds",
        value: PlayingCardValue.Ten,
        suit: Suit.Diamonds,
        frame: 34,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Jack}`]: {
        name: "Jack of Diamonds",
        value: PlayingCardValue.Jack,
        suit: Suit.Diamonds,
        frame: 35,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Queen}`]: {
        name: "Queen of Diamonds",
        value: PlayingCardValue.Queen,
        suit: Suit.Diamonds,
        frame: 36,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.King}`]: {
        name: "King of Diamonds",
        value: PlayingCardValue.King,
        suit: Suit.Diamonds,
        frame: 37,
    },
    [`${Suit.Diamonds}_${PlayingCardValue.Ace}`]: {
        name: "Ace of Diamonds",
        value: PlayingCardValue.Ace,
        suit: Suit.Diamonds,
        frame: 38,
    },

    [`${Suit.Spades}_${PlayingCardValue.Two}`]: {
        name: "2 of Spades",
        value: PlayingCardValue.Two,
        suit: Suit.Spades,
        frame: 39,
    },
    [`${Suit.Spades}_${PlayingCardValue.Three}`]: {
        name: "3 of Spades",
        value: PlayingCardValue.Three,
        suit: Suit.Spades,
        frame: 40,
    },
    [`${Suit.Spades}_${PlayingCardValue.Four}`]: {
        name: "4 of Spades",
        value: PlayingCardValue.Four,
        suit: Suit.Spades,
        frame: 41,
    },
    [`${Suit.Spades}_${PlayingCardValue.Five}`]: {
        name: "5 of Spades",
        value: PlayingCardValue.Five,
        suit: Suit.Spades,
        frame: 42,
    },
    [`${Suit.Spades}_${PlayingCardValue.Six}`]: {
        name: "6 of Spades",
        value: PlayingCardValue.Six,
        suit: Suit.Spades,
        frame: 43,
    },
    [`${Suit.Spades}_${PlayingCardValue.Seven}`]: {
        name: "7 of Spades",
        value: PlayingCardValue.Seven,
        suit: Suit.Spades,
        frame: 44,
    },
    [`${Suit.Spades}_${PlayingCardValue.Eight}`]: {
        name: "8 of Spades",
        value: PlayingCardValue.Eight,
        suit: Suit.Spades,
        frame: 45,
    },
    [`${Suit.Spades}_${PlayingCardValue.Nine}`]: {
        name: "9 of Spades",
        value: PlayingCardValue.Nine,
        suit: Suit.Spades,
        frame: 46,
    },
    [`${Suit.Spades}_${PlayingCardValue.Ten}`]: {
        name: "10 of Spades",
        value: PlayingCardValue.Ten,
        suit: Suit.Spades,
        frame: 47,
    },
    [`${Suit.Spades}_${PlayingCardValue.Jack}`]: {
        name: "Jack of Spades",
        value: PlayingCardValue.Jack,
        suit: Suit.Spades,
        frame: 48,
    },
    [`${Suit.Spades}_${PlayingCardValue.Queen}`]: {
        name: "Queen of Spades",
        value: PlayingCardValue.Queen,
        suit: Suit.Spades,
        frame: 49,
    },
    [`${Suit.Spades}_${PlayingCardValue.King}`]: {
        name: "King of Spades",
        value: PlayingCardValue.King,
        suit: Suit.Spades,
        frame: 50,
    },
    [`${Suit.Spades}_${PlayingCardValue.Ace}`]: {
        name: "Ace of Spades",
        value: PlayingCardValue.Ace,
        suit: Suit.Spades,
        frame: 51,
    },
};

/** 以数组形式获取全部 52 张牌 */
export const ALL_PLAYING_CARDS = Object.values(PLAYING_CARDS);
