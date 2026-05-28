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
    TILE_SIZE = Math.floor(Math.min(vw * 5, vh * 8.7));
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
 * 计算缩放比：将当前宽度缩放到目标宽度在设计稿（2670）下应占屏幕的比例
 * @param screenTotalWidth 屏幕总宽度（实际可用宽度）
 * @param currentWidth     当前元素/区域的宽度
 * @param targetWidth      设计稿中的目标宽度（默认 2670）
 * @returns 缩放比
 */
export function calcScale(
    screenTotalWidth: number,
    currentWidth: number,
    targetWidth: number = 2670,
): number {
    if (currentWidth <= 0 || targetWidth <= 0) return 1;
    return (screenTotalWidth / 2670) * (targetWidth / currentWidth);
}

/**
 * 根据设计稿上的距离/尺寸，计算实际屏幕上对应的像素值
 * @param screenTotalWidth 屏幕总宽度（实际可用宽度）
 * @param designValue      设计稿上的距离或尺寸值
 * @param designTotalWidth 设计稿总宽度（默认 2670）
 * @returns 实际屏幕上的像素值
 */
export function calcPx(
    screenTotalWidth: number,
    designValue: number,
    designTotalWidth: number = 2670,
): number {
    if (designTotalWidth <= 0) return 0;
    return screenTotalWidth * (designValue / designTotalWidth);
}
