#pragma phaserTemplate(shaderName)
precision highp float;
#pragma phaserTemplate(fragmentHeader)

uniform float uTime;
uniform float uSpinTime;
uniform vec4 uColour1;
uniform vec4 uColour2;
uniform vec4 uColour3;
uniform float uContrast;
uniform float uSpinAmount;
uniform vec2 uResolution;

#define PIXEL_SIZE_FAC 700.
#define SPIN_EASE 0.5

void main() {
    vec2 screen_coords = gl_FragCoord.xy;
    
    float pixel_size = length(uResolution.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(screen_coords.xy * (1. / pixel_size)) * pixel_size - 0.5 * uResolution.xy) / length(uResolution.xy) - vec2(0.12, 0.);
    float uv_len = length(uv);

    float speed = (uSpinTime * SPIN_EASE * 0.2) + 302.2;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed - SPIN_EASE * 20. * (1. * uSpinAmount * uv_len + (1. - 1. * uSpinAmount));
    vec2 mid = (uResolution.xy / length(uResolution.xy)) / 2.;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

    uv *= 30.;
    speed = uTime * (2.);
    vec2 uv2 = vec2(uv.x + uv.y);

    for(int i = 0; i < 5; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
        uv -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
    }

    float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
    float paint_res = min(2., max(0., length(uv) * (0.035) * contrast_mod));
    float c1p = max(0., 1. - contrast_mod * abs(1. - paint_res));
    float c2p = max(0., 1. - contrast_mod * abs(paint_res));
    float c3p = 1. - min(1., c1p + c2p);

    vec4 ret_col = (0.3 / uContrast) * uColour1 + (1. - 0.3 / uContrast) * (uColour1 * c1p + uColour2 * c2p + vec4(c3p * uColour3.rgb, c3p * uColour1.a));

    gl_FragColor = ret_col;
}