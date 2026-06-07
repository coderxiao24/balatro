import BigNumber from "bignumber.js";

/**
 *   牌组枚举
 */
export enum Decks {
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
 *   赌注枚举
 */
export enum Stakes {
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
 *   盲注类型枚举
 */
export enum BlindsType {
    /**
     *  @name 小盲注
     *  @description 无特殊效果。跳过此盲注可获得一个标签。通过奖励3$
     */
    SmallBlind = "SmallBlind",
    /**
     *  @name 大盲注
     *  @description 无特殊效果。跳过此盲注可获得一个标签。通过奖励4$
     */
    BigBlind = "BigBlind",
    /**
     *  @name BOSS盲注
     *  @description 有特殊效果并且不可跳过。通过奖励5$
     */
    BossBlind = "BossBlind",
}

/**
 *   底注分数接口
 */
export interface AnteScore {
    [Stakes.WhiteStake]: BigNumber;
    [Stakes.GreenStake]: BigNumber;
    [Stakes.PurpleStake]: BigNumber;
}

/**
 *   盲注卡片ui的类型枚举
 */
export enum BlindCardsType {
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
