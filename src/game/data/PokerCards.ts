import { Suit, CardValue, type PokerCard } from "./types/card";

type PokerCardDict = Record<string, PokerCard>;

export const POKER_CARDS: PokerCardDict = {
    [`${Suit.Hearts}_${CardValue.Two}`]: {
        name: "2 of Hearts",
        value: CardValue.Two,
        suit: Suit.Hearts,
        frame: 0,
    },
    [`${Suit.Hearts}_${CardValue.Three}`]: {
        name: "3 of Hearts",
        value: CardValue.Three,
        suit: Suit.Hearts,
        frame: 1,
    },
    [`${Suit.Hearts}_${CardValue.Four}`]: {
        name: "4 of Hearts",
        value: CardValue.Four,
        suit: Suit.Hearts,
        frame: 2,
    },
    [`${Suit.Hearts}_${CardValue.Five}`]: {
        name: "5 of Hearts",
        value: CardValue.Five,
        suit: Suit.Hearts,
        frame: 3,
    },
    [`${Suit.Hearts}_${CardValue.Six}`]: {
        name: "6 of Hearts",
        value: CardValue.Six,
        suit: Suit.Hearts,
        frame: 4,
    },
    [`${Suit.Hearts}_${CardValue.Seven}`]: {
        name: "7 of Hearts",
        value: CardValue.Seven,
        suit: Suit.Hearts,
        frame: 5,
    },
    [`${Suit.Hearts}_${CardValue.Eight}`]: {
        name: "8 of Hearts",
        value: CardValue.Eight,
        suit: Suit.Hearts,
        frame: 6,
    },
    [`${Suit.Hearts}_${CardValue.Nine}`]: {
        name: "9 of Hearts",
        value: CardValue.Nine,
        suit: Suit.Hearts,
        frame: 7,
    },
    [`${Suit.Hearts}_${CardValue.Ten}`]: {
        name: "10 of Hearts",
        value: CardValue.Ten,
        suit: Suit.Hearts,
        frame: 8,
    },
    [`${Suit.Hearts}_${CardValue.Jack}`]: {
        name: "Jack of Hearts",
        value: CardValue.Jack,
        suit: Suit.Hearts,
        frame: 9,
    },
    [`${Suit.Hearts}_${CardValue.Queen}`]: {
        name: "Queen of Hearts",
        value: CardValue.Queen,
        suit: Suit.Hearts,
        frame: 10,
    },
    [`${Suit.Hearts}_${CardValue.King}`]: {
        name: "King of Hearts",
        value: CardValue.King,
        suit: Suit.Hearts,
        frame: 11,
    },
    [`${Suit.Hearts}_${CardValue.Ace}`]: {
        name: "Ace of Hearts",
        value: CardValue.Ace,
        suit: Suit.Hearts,
        frame: 12,
    },

    [`${Suit.Clubs}_${CardValue.Two}`]: {
        name: "2 of Clubs",
        value: CardValue.Two,
        suit: Suit.Clubs,
        frame: 13,
    },
    [`${Suit.Clubs}_${CardValue.Three}`]: {
        name: "3 of Clubs",
        value: CardValue.Three,
        suit: Suit.Clubs,
        frame: 14,
    },
    [`${Suit.Clubs}_${CardValue.Four}`]: {
        name: "4 of Clubs",
        value: CardValue.Four,
        suit: Suit.Clubs,
        frame: 15,
    },
    [`${Suit.Clubs}_${CardValue.Five}`]: {
        name: "5 of Clubs",
        value: CardValue.Five,
        suit: Suit.Clubs,
        frame: 16,
    },
    [`${Suit.Clubs}_${CardValue.Six}`]: {
        name: "6 of Clubs",
        value: CardValue.Six,
        suit: Suit.Clubs,
        frame: 17,
    },
    [`${Suit.Clubs}_${CardValue.Seven}`]: {
        name: "7 of Clubs",
        value: CardValue.Seven,
        suit: Suit.Clubs,
        frame: 18,
    },
    [`${Suit.Clubs}_${CardValue.Eight}`]: {
        name: "8 of Clubs",
        value: CardValue.Eight,
        suit: Suit.Clubs,
        frame: 19,
    },
    [`${Suit.Clubs}_${CardValue.Nine}`]: {
        name: "9 of Clubs",
        value: CardValue.Nine,
        suit: Suit.Clubs,
        frame: 20,
    },
    [`${Suit.Clubs}_${CardValue.Ten}`]: {
        name: "10 of Clubs",
        value: CardValue.Ten,
        suit: Suit.Clubs,
        frame: 21,
    },
    [`${Suit.Clubs}_${CardValue.Jack}`]: {
        name: "Jack of Clubs",
        value: CardValue.Jack,
        suit: Suit.Clubs,
        frame: 22,
    },
    [`${Suit.Clubs}_${CardValue.Queen}`]: {
        name: "Queen of Clubs",
        value: CardValue.Queen,
        suit: Suit.Clubs,
        frame: 23,
    },
    [`${Suit.Clubs}_${CardValue.King}`]: {
        name: "King of Clubs",
        value: CardValue.King,
        suit: Suit.Clubs,
        frame: 24,
    },
    [`${Suit.Clubs}_${CardValue.Ace}`]: {
        name: "Ace of Clubs",
        value: CardValue.Ace,
        suit: Suit.Clubs,
        frame: 25,
    },

    [`${Suit.Diamonds}_${CardValue.Two}`]: {
        name: "2 of Diamonds",
        value: CardValue.Two,
        suit: Suit.Diamonds,
        frame: 26,
    },
    [`${Suit.Diamonds}_${CardValue.Three}`]: {
        name: "3 of Diamonds",
        value: CardValue.Three,
        suit: Suit.Diamonds,
        frame: 27,
    },
    [`${Suit.Diamonds}_${CardValue.Four}`]: {
        name: "4 of Diamonds",
        value: CardValue.Four,
        suit: Suit.Diamonds,
        frame: 28,
    },
    [`${Suit.Diamonds}_${CardValue.Five}`]: {
        name: "5 of Diamonds",
        value: CardValue.Five,
        suit: Suit.Diamonds,
        frame: 29,
    },
    [`${Suit.Diamonds}_${CardValue.Six}`]: {
        name: "6 of Diamonds",
        value: CardValue.Six,
        suit: Suit.Diamonds,
        frame: 30,
    },
    [`${Suit.Diamonds}_${CardValue.Seven}`]: {
        name: "7 of Diamonds",
        value: CardValue.Seven,
        suit: Suit.Diamonds,
        frame: 31,
    },
    [`${Suit.Diamonds}_${CardValue.Eight}`]: {
        name: "8 of Diamonds",
        value: CardValue.Eight,
        suit: Suit.Diamonds,
        frame: 32,
    },
    [`${Suit.Diamonds}_${CardValue.Nine}`]: {
        name: "9 of Diamonds",
        value: CardValue.Nine,
        suit: Suit.Diamonds,
        frame: 33,
    },
    [`${Suit.Diamonds}_${CardValue.Ten}`]: {
        name: "10 of Diamonds",
        value: CardValue.Ten,
        suit: Suit.Diamonds,
        frame: 34,
    },
    [`${Suit.Diamonds}_${CardValue.Jack}`]: {
        name: "Jack of Diamonds",
        value: CardValue.Jack,
        suit: Suit.Diamonds,
        frame: 35,
    },
    [`${Suit.Diamonds}_${CardValue.Queen}`]: {
        name: "Queen of Diamonds",
        value: CardValue.Queen,
        suit: Suit.Diamonds,
        frame: 36,
    },
    [`${Suit.Diamonds}_${CardValue.King}`]: {
        name: "King of Diamonds",
        value: CardValue.King,
        suit: Suit.Diamonds,
        frame: 37,
    },
    [`${Suit.Diamonds}_${CardValue.Ace}`]: {
        name: "Ace of Diamonds",
        value: CardValue.Ace,
        suit: Suit.Diamonds,
        frame: 38,
    },

    [`${Suit.Spades}_${CardValue.Two}`]: {
        name: "2 of Spades",
        value: CardValue.Two,
        suit: Suit.Spades,
        frame: 39,
    },
    [`${Suit.Spades}_${CardValue.Three}`]: {
        name: "3 of Spades",
        value: CardValue.Three,
        suit: Suit.Spades,
        frame: 40,
    },
    [`${Suit.Spades}_${CardValue.Four}`]: {
        name: "4 of Spades",
        value: CardValue.Four,
        suit: Suit.Spades,
        frame: 41,
    },
    [`${Suit.Spades}_${CardValue.Five}`]: {
        name: "5 of Spades",
        value: CardValue.Five,
        suit: Suit.Spades,
        frame: 42,
    },
    [`${Suit.Spades}_${CardValue.Six}`]: {
        name: "6 of Spades",
        value: CardValue.Six,
        suit: Suit.Spades,
        frame: 43,
    },
    [`${Suit.Spades}_${CardValue.Seven}`]: {
        name: "7 of Spades",
        value: CardValue.Seven,
        suit: Suit.Spades,
        frame: 44,
    },
    [`${Suit.Spades}_${CardValue.Eight}`]: {
        name: "8 of Spades",
        value: CardValue.Eight,
        suit: Suit.Spades,
        frame: 45,
    },
    [`${Suit.Spades}_${CardValue.Nine}`]: {
        name: "9 of Spades",
        value: CardValue.Nine,
        suit: Suit.Spades,
        frame: 46,
    },
    [`${Suit.Spades}_${CardValue.Ten}`]: {
        name: "10 of Spades",
        value: CardValue.Ten,
        suit: Suit.Spades,
        frame: 47,
    },
    [`${Suit.Spades}_${CardValue.Jack}`]: {
        name: "Jack of Spades",
        value: CardValue.Jack,
        suit: Suit.Spades,
        frame: 48,
    },
    [`${Suit.Spades}_${CardValue.Queen}`]: {
        name: "Queen of Spades",
        value: CardValue.Queen,
        suit: Suit.Spades,
        frame: 49,
    },
    [`${Suit.Spades}_${CardValue.King}`]: {
        name: "King of Spades",
        value: CardValue.King,
        suit: Suit.Spades,
        frame: 50,
    },
    [`${Suit.Spades}_${CardValue.Ace}`]: {
        name: "Ace of Spades",
        value: CardValue.Ace,
        suit: Suit.Spades,
        frame: 51,
    },
};

/** 以数组形式获取全部 52 张牌 */
export const ALL_POKER_CARDS = Object.values(POKER_CARDS);

/** 根据 key（如 "Hearts_Ace"）快速查找一张牌 */
export function getPokerCard(key: string) {
    return POKER_CARDS[key];
}
