precision highp float;
uniform float uTime;
uniform float uMidFlash;
uniform vec2 uResolution;
varying vec2 outTexCoord;

#define PIXEL_SIZE_FAC 700.0

void main()
{
    // 获取屏幕坐标
    vec2 screen_coords = gl_FragCoord.xy;
    vec2 love_ScreenSize = uResolution;

    // 像素化效果
    float pixel_size = length(love_ScreenSize.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * love_ScreenSize.xy) / length(love_ScreenSize.xy);

    // 白色闪光：第一次在2.5秒左右，第二次在11秒左右
    float mid_white = min(1.0,
        (uTime > 2.5 ? max(0.0, sqrt(uTime - 2.5) - 60.0 * length(uv)) : 0.0)
        + (uTime > 11.0 ? max(0.0, (uTime - 11.0) * (uTime - 11.0) - 5.0 * length(uv)) : 0.0)
    );

    gl_FragColor = vec4(1.0, 1.0, 1.0, uMidFlash * mid_white);
}
