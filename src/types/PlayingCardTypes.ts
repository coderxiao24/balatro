import { PlayingCard } from "@/game/entities/PlayingCard";

/** 扑克牌花色枚举 */
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

/** 扑克牌点数枚举 */
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

/** 扑克牌存档数据的结构 */
export interface IPlayingCard {
    /** 卡牌名称 */
    name: string;
    /** 卡牌点数 */
    value: PlayingCardValues;
    /** 卡牌花色 */
    suit: Suits;
    /**
     * 其他属性待补充
     */
    [key: string]: any;
}

/** 扑克牌点击事件的交互模式 */
export enum PlayingCardClickModes {
    /** 无交互 */
    none = "none",
    /** 翻牌 */
    flip = "flip",
    /** 选择 */
    select = "select",
}

/**
 * 添加卡牌到场景的配置选项
 */
export interface AddToSceneOptions {
    /** 场景 */
    scene: Phaser.Scene;
    /** 卡牌X轴坐标 */
    x: number;
    /** 卡牌Y轴坐标 */
    y: number;
    /** 点击交互模式 */
    clickMode?: PlayingCardClickModes;
    /** 是否启用拖拽 */
    enableDrag?: boolean;
}

/**
 * 拖拽回调配置选项
 * card 代表当前拖拽的卡牌实例
 * currentX | currentY 代表当前卡牌的坐标
 * targetX | targetY 代表拖拽目标的坐标
 */
export interface DragCallbacksOptions {
    /** 拖拽开始回调 */
    onDragStart?: (
        card: PlayingCard,
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
    ) => void;
    /** 拖拽移动回调 */
    onDragMove?: (
        card: PlayingCard,
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
    ) => void | null;
    /** 拖拽放置验证回调 */
    canDrop?: (
        card: PlayingCard,
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
    ) => boolean | { x: number; y: number } | null;
    /** 拖拽结束回调 */
    onDragEnd?: (
        card: PlayingCard,
        currentX: number,
        currentY: number,
        targetX: number,
        targetY: number,
    ) => void;
}

/**
 * 选择回调配置选项
 * card 代表当前拖拽选择的卡牌实例
 */
export interface SelectCallbacksOptions {
    /** 选择开始回调  value 代表 选择事件完成后卡牌是否选中的状态 */
    onSelectStart?: (card: PlayingCard, value: boolean) => void;
    /** 选择验证回调  value 代表 选择事件完成后卡牌是否选中的状态 */
    canSelect?: (card: PlayingCard, value: boolean) => boolean;
    /** 选择结束回调 value 代表 选择事件完成后卡牌是否选中的状态 */
    onSelectEnd?: (card: PlayingCard, value: boolean) => void;
}
