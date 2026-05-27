// 全局常量 & 尺寸工具
//
// 由于 Phaser 使用 Scale.RESIZE 模式，画布会随窗口大小变化，
// 因此 vw/vh 需要从场景的 cameras.main 实时获取。
// 这里提供工具函数方便在任意场景中计算响应式尺寸。

/** 基础网格单位（可被 resize 重新计算） */
export let TILE_SIZE = 32;

/**
 * 根据当前场景相机重新计算 TILE_SIZE
 * 逻辑：取 vw 和 vh 的较小值，除以一个基数得到网格大小
 */
export function recalcTileSize(camWidth: number, camHeight: number): number {
    const vw = camWidth / 100;
    const vh = camHeight / 100;
    TILE_SIZE = Math.floor(Math.min(vw * 8, vh * 12));
    return TILE_SIZE;
}

/** 获取当前场景的 1vw（画布宽度的 1%） */
export function vw(camWidth: number): number {
    return camWidth / 100;
}

/** 获取当前场景的 1vh（画布高度的 1%） */
export function vh(camHeight: number): number {
    return camHeight / 100;
}

/**
 * 使用示例（在场景的 create / resize 回调中）：
 *
 *   import { vw, vh, recalcTileSize, TILE_SIZE } from "../Constants";
 *
 *   const { width, height } = this.cameras.main;
 *   recalcTileSize(width, height);
 *   // 之后可以直接使用 TILE_SIZE
 *   console.log(TILE_SIZE);
 *   console.log(vw(width), vh(height));
 */
