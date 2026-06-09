// 增强溶解特效 - 动态不规则圆形扩张与燃尽边缘
#pragma phaserTemplate(shaderName)

#ifdef GL_ES
// 移动端必须使用 highp，否则噪声/随机函数会因精度不足导致图案完全变形
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform float dissolve; // 0: 未溶解, 1: 完全溶解

// 伪随机函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D Value Noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 分形噪声 (FBM) - 丰富溶解细节
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.2;
        amplitude *= 0.5;
    }
    return value;
}

// 生成多个随机圆的位置（基于固定种子，确保一致性）
vec2 getCirclePos(int idx) {
    float seedA = float(idx) * 37.183 + 12.9898;
    float seedB = float(idx) * 71.297 + 78.233;
    return vec2(
        fract(sin(seedA) * 43758.5453),
        fract(sin(seedB) * 43758.5453)
    );
}

// 计算单个圆对像素溶解强度的影响（不规则边缘 + 动态半径）
float circleInfluence(vec2 uv, vec2 center, float radius, float aspect, float timeVal) {
    // 将坐标转换到等比例空间，使圆形不受屏幕宽高比拉伸
    vec2 p = uv;
    p.x *= aspect;
    center.x *= aspect;
    
    // 基础距离
    float dist = distance(p, center);
    
    // 不规则变形1：对UV进行噪声扰动，产生不规则边缘
    vec2 noiseUV = uv * 12.0 + timeVal * 0.5;
    float distortion = (noise(noiseUV) - 0.5) * 0.12;
    float distortedDist = dist + distortion;
    
    // 不规则变形2：半径本身也随位置噪声波动
    float radiusNoise = (noise(uv * 15.0 + 1.23) - 0.5) * 0.15;
    float finalRadius = max(0.0, radius + radiusNoise);
    
    // 圆形影响：内部完全衰减（强度为0），边缘渐变过渡（制造软溶解边缘）
    float innerStart = finalRadius * 0.7;
    float influence = 1.0 - smoothstep(innerStart, finalRadius, distortedDist);
    // 增加轻微脉动效果（随时间微调）
    influence *= (0.9 + 0.1 * sin(timeVal * 3.0 + dist * 15.0));
    return clamp(influence, 0.0, 1.0);
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;
    
    // 原始溶解噪声（提供丰富的自然纹理）
    vec2 st = uv * vec2(18.0, 12.0);
    float noiseVal = fbm(st);
    // 增加一层高频细节，提升边缘丰富度
    noiseVal = clamp(noiseVal * 0.8 + fbm(uv * 35.0) * 0.2, 0.0, 1.0);
    
    // ---- 不规则圆形系统 ----
    const int CIRCLE_COUNT = 6;
    float maxCircleMask = 0.0;
    
    // 动态半径基础值：随溶解程度线性增长（从0到0.85，覆盖全屏）
    float baseRadius = dissolve * 0.85;
    
    for (int i = 0; i < CIRCLE_COUNT; i++) {
        vec2 center = getCirclePos(i);
        // 让每个圆的扩张速度略有差异，增加随机感
        float speedFactor = 0.7 + random(vec2(float(i), 0.5)) * 0.8;
        float dynamicRadius = baseRadius * speedFactor;
        
        // 额外：使圆心随溶解程度轻微漂移，模拟燃烧蔓延的不规则性
        vec2 drift = vec2(sin(time * 0.7 + float(i)), cos(time * 0.5 + float(i))) * (dissolve * 0.08);
        center += drift;
        
        float mask = circleInfluence(uv, center, dynamicRadius, aspect, time);
        maxCircleMask = max(maxCircleMask, mask);
    }
    
    // 圆形区域强化溶解：强度乘以 (1 - 圆影响)，圆内强度大幅降低，形成孔洞
    float finalStrength = noiseVal * (1.0 - maxCircleMask);
    
    // 溶解阈值判断（dissolve 0->1，阈值提高，溶解区域扩大）
    float threshold = dissolve;
    if (finalStrength < threshold) {
        discard;  // 完全透明，形成镂空
    }
    
    // ----- 增强边缘视觉效果（燃尽、光晕、火星）-----
    float edgeDist = finalStrength - threshold;      // 到溶解边缘的距离
    float glowWidth = 0.18;                          // 发光带宽度
    
    // 动态边缘强度（随时间波动，模拟火焰闪烁）
    float flicker = 0.7 + 0.4 * sin(time * 12.0 + finalStrength * 50.0);
    
    // 基础发光因子
    float glowFactor = smoothstep(0.0, glowWidth, edgeDist);
    // 使边缘附近区域有更强的亮度和颜色变化
    float edgeIntensity = (1.0 - glowFactor) * flicker;
    edgeIntensity = pow(edgeIntensity, 1.2);
    
    // 颜色设计：内部白色/淡金，边缘炽热橙红到暗红，最外侧黑边模拟烧焦
    vec3 innerColor = vec3(1.0, 0.95, 0.85);        // 暖白
    vec3 midColor = vec3(1.0, 0.55, 0.15);          // 炽热橙
    vec3 outerColor = vec3(0.6, 0.15, 0.05);        // 烧灼暗红
    
    // 根据边缘距离混合三层颜色
    vec3 finalColor;
    if (glowFactor < 0.5) {
        float t = glowFactor * 2.0;
        finalColor = mix(outerColor, midColor, t);
    } else {
        float t = (glowFactor - 0.5) * 2.0;
        finalColor = mix(midColor, innerColor, t);
    }
    
    // 增强发光饱和度与燃烧感
    finalColor += vec3(0.8, 0.3, 0.0) * edgeIntensity * (1.0 - glowFactor);
    
    // 火星特效：在溶解边缘随机生成亮星点（基于位置噪声和时间）
    vec2 sparkUV = uv * resolution.xy / 40.0;
    float sparkNoise = fract(sin(dot(sparkUV, vec2(12.9898, 78.233))) * 43758.5453);
    float isSpark = step(0.995, sparkNoise * (1.0 - glowFactor) * 1.5);
    if (isSpark > 0.5 && edgeDist < glowWidth * 1.2) {
        finalColor += vec3(1.0, 0.7, 0.2) * (0.7 + 0.5 * sin(time * 50.0));
    }
    
    // 额外：溶解后期（>0.7）加入烟灰暗化效果
    float ashFactor = smoothstep(0.6, 0.95, dissolve);
    finalColor *= (1.0 - ashFactor * 0.6);
    
    // 整体轻微动态色调偏移，增加燃尽感
    finalColor += vec3(sin(time * 3.0) * 0.05, cos(time * 2.7) * 0.03, 0.0) * (1.0 - glowFactor);
    
    gl_FragColor = vec4(finalColor, 1.0);
}