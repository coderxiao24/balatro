import { PlayingCard } from "@/game/entities/PlayingCard";

// 扑克牌花色枚举（与精灵图行的顺序一致）
export enum Suits {
    /** 红心 */
    Hearts = "Hearts",
    /** 梅花 */
    Clubs = "Clubs",
    /** 方片 */
    Diamonds = "Diamonds",
    /** 黑桃 */
    Spades = "Spades",
}

// 扑克牌点数枚举
export enum PlayingCardValues {
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
export interface IPlayingCard {
    name: string;
    value: PlayingCardValues;
    suit: Suits;
    frame: number;
}

/** 点击交互模式 */
export enum PlayingCardClickModes {
    none = "none",
    flip = "flip",
    select = "select",
}

export type PlayingCardDict = Record<string, IPlayingCard>;

/**
 * 添加卡牌到场景的配置选项
 */
export interface AddToSceneOptions {
    scene: Phaser.Scene;
    x: number;
    y: number;
    clickMode?: PlayingCardClickModes;
    enableDrag?: boolean;
}

/**
 * 拖拽回调配置选项
 * currentX | currentY 代表当前卡牌的坐标
 * targetX | targetY 代表拖拽目标的坐标
 */
export interface DragCallbacksOptions {
    onDragStart?: (
        card: PlayingCard,
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
    ) => void;
    onDragMove?: (
        card: PlayingCard,
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
    ) => void | null;

    onDragEnd?: (
        card: PlayingCard,
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
    ) => void;
    canDrop?: (
        card: PlayingCard,
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
    ) => boolean | { x: number; y: number } | null;
}
