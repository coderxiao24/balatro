uniform float time;
 
vec2 rand2 (vec2 co) {
    co = vec2(dot(co, vec2(127.1, 311.7)), dot(co, vec2(269.5, 183.3)));
    return fract(sin(co) * 43758.5453);
}
 
float perlinNoise (vec2 uv)
{
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    return mix(mix(dot(rand2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                dot(rand2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), f.x),
            mix(dot(rand2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                dot(rand2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), f.x), f.y) * 0.5 + 0.5;
}