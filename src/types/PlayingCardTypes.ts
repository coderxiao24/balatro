// 扑克牌花色枚举（与精灵图行的顺序一致）
export enum Suit {
    Hearts = "Hearts",
    Clubs = "Clubs",
    Diamonds = "Diamonds",
    Spades = "Spades",
}

// 扑克牌点数枚举
export enum PlayingCardValue {
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
export interface PlayingCard {
    name: string;
    value: PlayingCardValue;
    suit: Suit;
    frame: number;
}

/** 点击交互模式 */
export enum PlayingCardClickMode {
    none = "none",
    flip = "flip",
    select = "select",
}

export type PlayingCardDict = Record<string, PlayingCard>;

/**
 * 添加卡牌到场景的配置选项
 */
export interface AddToSceneOptions {
    scene: Phaser.Scene;
    x: number;
    y: number;
    clickMode?: PlayingCardClickMode;
    enableDrag?: boolean;
}

/**
 * 拖拽回调配置选项
 */
export interface DragCallbacksOptions {
    onDragStart?: (card: any) => void;
    onDragEnd?: (card: any, x: number, y: number) => void;
    canDrop?: (
        card: any,
        x: number,
        y: number,
    ) => boolean | { x: number; y: number } | null;
}
