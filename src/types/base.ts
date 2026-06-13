import BigNumber from "bignumber.js";
import { IPlayingCard, Suits } from "./PlayingCardTypes";

/**
 *   牌组名称枚举
 */
export enum DeckNames {
    /**
     *  @name 红色牌组
     *  @description  每回合弃牌次数 +1
     */
    RedDeck = "RedDeck",
    /**
     *  @name 蓝色牌组
     *  @description 每回合出牌次数 +1
     */
    BlueDeck = "BlueDeck",
    /**
     *  @name 黄色牌组
     *  @description 开局额外获得$10
     */
    YellowDeck = "YellowDeck",
    /**
     *  @name 绿色牌组
     *  @description 每回合没用完的出牌和弃牌次数分别提供$2和$1的奖金。本局游戏没有利息。
     */
    GreenDeck = "GreenDeck",
    /**
     *  @name 黑色牌组
     *  @description 小丑槽位 +1，出牌次数 -1
     */
    BlackDeck = "BlackDeck",
    /**
     *  @name 魔法牌组
     *  @description 开局时拥有水晶球和两张愚者
     */
    MagicDeck = "MagicDeck",
    /**
     *  @name 星云牌组
     *  @description 开局时拥有望远镜，消耗槽位 -1。
     */
    NebulaDeck = "NebulaDeck",
    /**
     *  @name 幽灵牌组
     *  @description 商店中可能出现幻灵牌，初始带有妖法。
     */
    GhostDeck = "GhostDeck",
    /**
     *  @name 废弃牌组
     *  @description 开局时牌组里没有人头牌（JQK）
     */
    AbandonedDeck = "AbandonedDeck",
    /**
     *  @name 方格牌组
     *  @description 开局时牌组只有2种花色：黑桃和红桃，各有26张
     */
    CheckeredDeck = "CheckeredDeck",
    /**
     *  @name 黄道牌组
     *  @description 开局时拥有塔罗牌商人、星球牌商人、库存过剩
     */
    ZodiacDeck = "ZodiacDeck",
    /**
     *  @name 彩绘牌组
     *  @description 手牌上限 +2，小丑槽位 -1
     */
    PaintedDeck = "PaintedDeck",
    /**
     *  @name 浮雕牌组
     *  @description 每次击败 BOSS盲注 后，获得一个双倍标签
     */
    AnaglyphDeck = "AnaglyphDeck",
    /**
     *  @name 等离子牌组
     *  @description 筹码和倍率在计分前，变为两者的平均数。基础盲注分数要求 x2。
     */
    PlasmaDeck = "PlasmaDeck",

    /**
     *  @name 古怪牌组
     *  @description 开局时牌组中的所有牌花色和点数都是随机的
     */
    ErraticDeck = "ErraticDeck",
}

/**
 *   赌注名称枚举
 */
export enum StakeNames {
    /**
     *  @name 白注
     *  @description 基础难度
     */
    WhiteStake = "WhiteStake",
    /**
     *  @name 红注
     *  @description 小盲注没有奖励金。叠加之前所有赌注的效果。
     */
    RedStake = "RedStake",
    /**
     *  @name 绿注
     *  @description 所需得分增长速度加快。叠加之前所有赌注的效果。
     */
    GreenStake = "GreenStake",
    /**
     *  @name 黑注
     *  @description 商店出售永固小丑(无法出售或摧毁)。叠加之前所有赌注的效果。
     */
    BlackStake = "BlackStake",
    /**
     *  @name 蓝注
     *  @description 弃牌次数-1。叠加之前所有赌注的效果。
     */
    BlueStake = "BlueStake",
    /**
     *  @name 紫注
     *  @description 所需得分增长速度加快。叠加之前所有赌注的效果。
     */
    PurpleStake = "PurpleStake",
    /**
     *  @name 橙注
     *  @description 小丑有30%几率被添加〖易腐〗[在5回合后被禁用]。叠加之前所有赌注的效果。
     */
    OrangeStake = "OrangeStake",
    /**
     *  @name 金注
     *  @description 小丑有30%几率被添加〖租赁〗[初始$1，每回合额外收费$3]。叠加之前所有赌注的效果。
     */
    GoldStake = "GoldStake",
}

/**
 *   盲注名称枚举
 */
export enum BlindNames {
    /** 小盲注 - Small Blind */
    SmallBlind = "Small Blind",
    /** 大盲注 - Big Blind */
    BigBlind = "Big Blind",
    /** 钩子 - The Hook */
    TheHook = "The Hook",
    /** 公牛 - The Ox */
    TheOx = "The Ox",
    /** 房屋 - The House */
    TheHouse = "The House",
    /** 围墙 - The Wall */
    TheWall = "The Wall",
    /** 车轮 - The Wheel */
    TheWheel = "The Wheel",
    /** 手臂 - The Arm */
    TheArm = "The Arm",
    /** 梅花 - The Club */
    TheClub = "The Club",
    /** 鱼 - The Fish */
    TheFish = "The Fish",
    /** 灵媒 - The Psychic */
    ThePsychic = "The Psychic",
    /** 挑衅 - The Goad */
    TheGoad = "The Goad",
    /** 水 - The Water */
    TheWater = "The Water",
    /** 窗口 - The Window */
    TheWindow = "The Window",
    /** 镣铐 - The Manacle */
    TheManacle = "The Manacle",
    /** 眼睛 - The Eye */
    TheEye = "The Eye",
    /** 嘴巴 - The Mouth */
    TheMouth = "The Mouth",
    /** 植物 - The Plant */
    ThePlant = "The Plant",
    /** 巨蟒 - The Serpent */
    TheSerpent = "The Serpent",
    /** 支柱 - The Pillar */
    ThePillar = "The Pillar",
    /** 针 - The Needle */
    TheNeedle = "The Needle",
    /** 头部 - The Head */
    TheHead = "The Head",
    /** 牙齿 - The Tooth */
    TheTooth = "The Tooth",
    /** 燧石 - The Flint */
    TheFlint = "The Flint",
    /** 标记 - The Mark */
    TheMark = "The Mark",
    /** 琥珀之实 - Amber Acorn */
    AmberAcorn = "Amber Acorn",
    /** 翠绿之叶 - Verdant Leaf */
    VerdantLeaf = "Verdant Leaf",
    /** 靛紫之杯 - Violet Vessel */
    VioletVessel = "Violet Vessel",
    /** 绯红之心 - Crimson Heart */
    CrimsonHeart = "Crimson Heart",
    /** 蔚蓝之铃 - Cerulean Bell */
    CeruleanBell = "Cerulean Bell",
}

/**
 *   底注对应赌注分数接口
 */
export interface AnteScore {
    [StakeNames.WhiteStake]: BigNumber;
    [StakeNames.GreenStake]: BigNumber;
    [StakeNames.PurpleStake]: BigNumber;
}

/**
 *   选择盲注的卡片ui的类型枚举
 */
export enum BlindCardTypes {
    /**
     *  @name 当前
     */
    Active = "Active",
    /**
     *  @name 已跳过
     */
    Skip = "Skip",
    /**
     *  @name 已通过
     */
    Pass = "Pass",
    /**
     *  @name 下一回合
     */
    Next = "Next",
}

/**
 *   历史盲注数据接口
 */
export interface HistoryBlind {
    CardsType: BlindCardTypes;
    [key: string]: any;
}

/**
 *   游戏存档数据接口
 */
export interface GameData {
    /** 牌组 */
    deck: DeckNames;
    /** 赌注 */
    stake: StakeNames;
    /** 底注 */
    ante: number;
    /** 回合数 */
    round: number;
    /** 完整牌组 */
    completeDeck: IPlayingCard[];
    /** 历史盲注 */
    historyBlinds: HistoryBlind[];
    /** 手牌上限 */
    handLimit: number;
}

/**
 *   手牌类型枚举
 */
export enum HandTypes {
    /**
     *  @name 同花五条
     */
    FlushFive = "FlushFive",
    /**
     *  @name 同花葫芦
     */
    FlushHouse = "FlushHouse",
    /**
     *  @name 五条
     */
    FiveOfAKind = "FiveOfAKind",
    /**
     *  @name 皇家同花顺
     */
    RoyalFlush = "RoyalFlush",
    /**
     *  @name 同花顺
     */
    StraightFlush = "StraightFlush",
    /**
     *  @name 四条
     */
    FourOfAKind = "FourOfAKind",
    /**
     *  @name 葫芦
     */
    FullHouse = "FullHouse",
    /**
     *  @name 同花
     */
    Flush = "Flush",
    /**
     *  @name 顺子
     */
    Straight = "Straight",
    /**
     *  @name 三条
     */
    ThreeOfAKind = "ThreeOfAKind",
    /**
     *  @name 两对
     */
    TwoPair = "TwoPair",
    /**
     *  @name 对子
     */
    Pair = "Pair",
    /**
     *  @name 高牌
     */
    HighCard = "HighCard",
}

/**
 * 牌型数据接口
 */
export interface HandDataValue {
    /** 描述 */
    desc: string;
    /** 是否可见 */
    visible: boolean;
    /** 排序权重 */
    order: number;
    /** 基础倍率 */
    mult: number;
    /** 基础筹码 */
    chips: number;
    /** Single-game Multiplier 在当前这一把游戏内的倍率 */
    s_mult: number;
    /** Single-game Chips 在当前这一把游戏内的筹码 */
    s_chips: number;
    /** 当前等级 */
    level: number;
    /** 牌型每次进行全局升级（Level up）时，增加的基础倍率。 */
    l_mult: number;
    /** 牌型每次进行全局升级（Level up）时，增加的基础筹码。 */
    l_chips: number;
    /** 累计打出次数 */
    played: number;
    /** 本回合打出次数 */
    played_this_round: number;
    /** 示例牌组（5张） */
    example: (IPlayingCard & {
        /** 是否是计分牌 */
        isScoring: boolean;
    })[];
}

/** 盲注的负面效果定义 */
export interface BlindDebuff {
    /** 被禁用的花色，如 'Clubs' | 'Spades' | 'Hearts' | 'Diamonds' */
    suit?: Suits;
    /** 打出的牌的数量限制 如果出的牌数量不等于该值，触发debuff */
    h_size_ge?: number;
    /** 人头牌限制标识，如 'face' 表示J/Q/K被削弱 */
    is_face?: string;
    /** 允许扩展其他未列出的debuff类型 */
    [key: string]: any;
}

/** Boss盲注的出场规则与视觉配置 */
export interface BossConfig {
    /** 最早可出现的底注(Ante)编号 */
    min: number;
    /** 最晚可出现的底注编号 目前没有boss存在最晚回合出现限制 */
    max: number;
    /** 是否为终局决战Boss（仅Ante 8+特殊轮次出现） */
    showdown?: boolean;
}

/** 单个盲注的完整数据定义 */
export interface BlindDefinition {
    /** 盲注显示名称（运行时可能经过本地化处理） */
    name: string;
    /** 当前存档中是否已被击败 */
    defeated: boolean;
    /** 内部排序ID（不等于实际出场顺序） */
    order: number;
    /** 击败后获得的基础金钱奖励 */
    dollars: number;
    /** 目标分数倍率（实际过关分 = 底注基础分 × mult） */
    mult: number;
    /** 动态变量数组，用于填充描述文本占位符（如 "localize:ph_most_played"） */
    vars: (string | number)[];
    /** 自定义debuff描述文本，为空时使用默认模板 */
    debuff_text?: string;
    /** 该盲注施加的具体负面效果 */
    debuff: BlindDebuff;
    /** 精灵图(Sprite Atlas)中的渲染坐标 */
    pos: { x: number; y: number };
    /** Boss专属配置，普通小盲/大盲无此字段 */
    boss?: BossConfig;
    /** Boss UI主题颜色 */
    boss_colour?: string;
}
