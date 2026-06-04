#pragma phaserTemplate(shaderName)
precision highp float;
#pragma phaserTemplate(fragmentHeader)
uniform float uTime;
uniform float uVortSpeed;
uniform vec4 uColour1;
uniform vec4 uColour2;
uniform float uMidFlash;
uniform float uVortOffset;
uniform vec2 uResolution;
uniform float uFlashRadius;
uniform float uFlashOpacity;
varying vec2 outTexCoord;

#define PIXEL_SIZE_FAC 700.0
#define BLACK 0.6 * vec4(79.0 / 255.0, 99.0 / 255.0, 103.0 / 255.0, 1.0 / 0.6)

void main()
{
    vec2 screen_coords = gl_FragCoord.xy;
    vec2 love_ScreenSize = uResolution;

    // 像素化效果
    float pixel_size = length(love_ScreenSize.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * love_ScreenSize.xy) / length(love_ScreenSize.xy);
    float uv_len = length(uv);

    // 中心漩涡
    float speed = uTime * uVortSpeed;
    float new_pixel_angle = atan(uv.y, uv.x) + (2.2 + 0.4 * min(6.0, speed)) * uv_len - 1.0 - speed * 0.05 - min(6.0, speed) * speed * 0.02 + uVortOffset;
    vec2 mid = (love_ScreenSize.xy / length(love_ScreenSize.xy)) / 2.0;
    vec2 sv = vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid;

    // 颜料流动效果
    sv *= 30.0;
    speed = uTime * 6.0 * uVortSpeed + uVortOffset + 1033.0;
    vec2 uv2 = vec2(sv.x + sv.y);

    for (int i = 0; i < 5; i++)
    {
        uv2 += sin(max(sv.x, sv.y)) + sv;
        sv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
        sv -= 1.0 * cos(sv.x + sv.y) - 1.0 * sin(sv.x * 0.711 - sv.y);
    }

    // 烟雾混合
    float smoke_res = min(2.0, max(-2.0, 1.5 + length(sv) * 0.12 - 0.17 * (min(10.0, uTime * 1.2 - 4.0))));
    if (smoke_res < 0.2)
    {
        smoke_res = (smoke_res - 0.2) * 0.6 + 0.2;
    }

    float c1p = max(0.0, 1.0 - 2.0 * abs(1.0 - smoke_res));
    float c2p = max(0.0, 1.0 - 2.0 * smoke_res);
    float cb = 1.0 - min(1.0, c1p + c2p);

    vec4 ret_col = uColour1 * c1p + uColour2 * c2p + vec4(cb * BLACK.rgb, cb * uColour1.a);

    // 白色闪光（原有逻辑，保持兼容）
    float mod_flash = max(uMidFlash * 0.8, max(c1p, c2p) * 5.0 - 4.4) + uMidFlash * max(c1p, c2p);

    // 圆形扩散闪光：从中心圆形区域逐渐扩大，白光内部始终保持不透明
    // uFlashRadius: 0~1.2，表示圆形半径占屏幕对角线一半的比例
    // uFlashOpacity: 始终为1，白光内部不透明
    float max_dist = 0.5 * length(love_ScreenSize.xy) / length(love_ScreenSize.xy); // 约0.5
    float dist_from_center = length(uv);
    float flash_radius_world = uFlashRadius * max_dist;
    float in_circle = 1.0 - smoothstep(flash_radius_world * 0.8, flash_radius_world, dist_from_center);
    float circle_flash = in_circle * uFlashOpacity;

    // 合并两种闪光效果
    float total_flash = max(mod_flash, circle_flash);

    gl_FragColor = ret_col * (1.0 - total_flash) + total_flash * vec4(1.0, 1.0, 1.0, 1.0);
}
