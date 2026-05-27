// 扑克牌花色枚举（与精灵图行的顺序一致）
export enum Suit {
    Hearts = "Hearts",
    Clubs = "Clubs",
    Diamonds = "Diamonds",
    Spades = "Spades",
}

// 扑克牌点数枚举
export enum CardValue {
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",
    Ten = "10",
    Jack = "11",
    Queen = "12",
    King = "13",
    Ace = "1",
}

// 一张扑克牌的全部数据
export interface PokerCard {
    name: string;
    value: CardValue;
    suit: Suit;
    frame: number;
}
