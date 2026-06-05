vec2 timeOffset = vec2(0.0, time);
 
// Base frequency, to match screen aspect ratio of this example.
// Change this or set it as a uniform to match your game.
vec2 frequency = vec2(16, 9);
 
// Accumulate noise from three different frequencies.
float noise0 = perlinNoise(outTexCoord * frequency * 3.0 + timeOffset * 2.0);
float noise1 = perlinNoise(outTexCoord * frequency * 5.0 + timeOffset / 1.345);
float noise2 = perlinNoise(outTexCoord * frequency * 7.0 + timeOffset / 2.1);
float sum = noise0 * 0.5 + noise1 * 0.3 + noise2 * 0.2;
 
// Round the sum up to 0.5 if below, to create flat areas.
sum = max(sum, 0.5);
 
fragColor = vec4(vec3(sum), 1.0);