import { Suits, PlayingCardValues, IPlayingCard } from "@/types";

/** 花色的行索引（用于计算 frame） */
export const PLAYING_CARD_SUIT_ROW: Readonly<Record<Suits, number>> = {
    [Suits.Hearts]: 0,
    [Suits.Clubs]: 1,
    [Suits.Diamonds]: 2,
    [Suits.Spades]: 3,
};

/** PlayingCardValues 在行内的列索引（用于计算 frame） */
export const PLAYING_CARD_VALUE_COL: Readonly<
    Record<PlayingCardValues, number>
> = {
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
export const PLAYING_CARD_ALL_SUITS: Readonly<Suits[]> = Object.values(Suits);

/** 所有 PlayingCardValues 枚举值数组（用于随机） */
export const PLAYING_CARD_ALL_VALUES: Readonly<PlayingCardValues[]> =
    Object.values(PlayingCardValues);

/** 初始扑克牌数据对象 */
export const INITIAL_PLAYING_CARDS_MAP: Readonly<Record<string, IPlayingCard>> =
    {
        [`${Suits.Hearts}_${PlayingCardValues.Two}`]: {
            name: "2 of Hearts",
            value: PlayingCardValues.Two,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Three}`]: {
            name: "3 of Hearts",
            value: PlayingCardValues.Three,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Four}`]: {
            name: "4 of Hearts",
            value: PlayingCardValues.Four,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Five}`]: {
            name: "5 of Hearts",
            value: PlayingCardValues.Five,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Six}`]: {
            name: "6 of Hearts",
            value: PlayingCardValues.Six,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Seven}`]: {
            name: "7 of Hearts",
            value: PlayingCardValues.Seven,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Eight}`]: {
            name: "8 of Hearts",
            value: PlayingCardValues.Eight,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Nine}`]: {
            name: "9 of Hearts",
            value: PlayingCardValues.Nine,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Ten}`]: {
            name: "10 of Hearts",
            value: PlayingCardValues.Ten,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Jack}`]: {
            name: "11 of Hearts",
            value: PlayingCardValues.Jack,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Queen}`]: {
            name: "12 of Hearts",
            value: PlayingCardValues.Queen,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.King}`]: {
            name: "13 of Hearts",
            value: PlayingCardValues.King,
            suit: Suits.Hearts,
        },
        [`${Suits.Hearts}_${PlayingCardValues.Ace}`]: {
            name: "1 of Hearts",
            value: PlayingCardValues.Ace,
            suit: Suits.Hearts,
        },

        [`${Suits.Clubs}_${PlayingCardValues.Two}`]: {
            name: "2 of Clubs",
            value: PlayingCardValues.Two,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Three}`]: {
            name: "3 of Clubs",
            value: PlayingCardValues.Three,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Four}`]: {
            name: "4 of Clubs",
            value: PlayingCardValues.Four,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Five}`]: {
            name: "5 of Clubs",
            value: PlayingCardValues.Five,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Six}`]: {
            name: "6 of Clubs",
            value: PlayingCardValues.Six,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Seven}`]: {
            name: "7 of Clubs",
            value: PlayingCardValues.Seven,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Eight}`]: {
            name: "8 of Clubs",
            value: PlayingCardValues.Eight,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Nine}`]: {
            name: "9 of Clubs",
            value: PlayingCardValues.Nine,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Ten}`]: {
            name: "10 of Clubs",
            value: PlayingCardValues.Ten,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Jack}`]: {
            name: "11 of Clubs",
            value: PlayingCardValues.Jack,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Queen}`]: {
            name: "12 of Clubs",
            value: PlayingCardValues.Queen,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.King}`]: {
            name: "13 of Clubs",
            value: PlayingCardValues.King,
            suit: Suits.Clubs,
        },
        [`${Suits.Clubs}_${PlayingCardValues.Ace}`]: {
            name: "1 of Clubs",
            value: PlayingCardValues.Ace,
            suit: Suits.Clubs,
        },

        [`${Suits.Diamonds}_${PlayingCardValues.Two}`]: {
            name: "2 of Diamonds",
            value: PlayingCardValues.Two,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Three}`]: {
            name: "3 of Diamonds",
            value: PlayingCardValues.Three,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Four}`]: {
            name: "4 of Diamonds",
            value: PlayingCardValues.Four,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Five}`]: {
            name: "5 of Diamonds",
            value: PlayingCardValues.Five,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Six}`]: {
            name: "6 of Diamonds",
            value: PlayingCardValues.Six,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Seven}`]: {
            name: "7 of Diamonds",
            value: PlayingCardValues.Seven,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Eight}`]: {
            name: "8 of Diamonds",
            value: PlayingCardValues.Eight,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Nine}`]: {
            name: "9 of Diamonds",
            value: PlayingCardValues.Nine,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Ten}`]: {
            name: "10 of Diamonds",
            value: PlayingCardValues.Ten,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Jack}`]: {
            name: "11 of Diamonds",
            value: PlayingCardValues.Jack,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Queen}`]: {
            name: "12 of Diamonds",
            value: PlayingCardValues.Queen,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.King}`]: {
            name: "13 of Diamonds",
            value: PlayingCardValues.King,
            suit: Suits.Diamonds,
        },
        [`${Suits.Diamonds}_${PlayingCardValues.Ace}`]: {
            name: "1 of Diamonds",
            value: PlayingCardValues.Ace,
            suit: Suits.Diamonds,
        },

        [`${Suits.Spades}_${PlayingCardValues.Two}`]: {
            name: "2 of Spades",
            value: PlayingCardValues.Two,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Three}`]: {
            name: "3 of Spades",
            value: PlayingCardValues.Three,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Four}`]: {
            name: "4 of Spades",
            value: PlayingCardValues.Four,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Five}`]: {
            name: "5 of Spades",
            value: PlayingCardValues.Five,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Six}`]: {
            name: "6 of Spades",
            value: PlayingCardValues.Six,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Seven}`]: {
            name: "7 of Spades",
            value: PlayingCardValues.Seven,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Eight}`]: {
            name: "8 of Spades",
            value: PlayingCardValues.Eight,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Nine}`]: {
            name: "9 of Spades",
            value: PlayingCardValues.Nine,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Ten}`]: {
            name: "10 of Spades",
            value: PlayingCardValues.Ten,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Jack}`]: {
            name: "11 of Spades",
            value: PlayingCardValues.Jack,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Queen}`]: {
            name: "12 of Spades",
            value: PlayingCardValues.Queen,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.King}`]: {
            name: "13 of Spades",
            value: PlayingCardValues.King,
            suit: Suits.Spades,
        },
        [`${Suits.Spades}_${PlayingCardValues.Ace}`]: {
            name: "1 of Spades",
            value: PlayingCardValues.Ace,
            suit: Suits.Spades,
        },
    };

/** 以数组形式获取全部 52 张牌(初始牌堆) */
export const INITIAL_PLAYING_CARDS_ARRAY: Readonly<IPlayingCard[]> =
    Object.values(INITIAL_PLAYING_CARDS_MAP);
