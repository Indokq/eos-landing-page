uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uScrollProgress;

varying vec2 vUv;
varying vec3 vPosition;

// Noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Mouse influence
  vec2 mouseInfluence = uMouse * 0.3;
  
  // Animated noise layers
  float noise1 = snoise(uv * 2.0 + uTime * 0.1 + mouseInfluence);
  float noise2 = snoise(uv * 4.0 - uTime * 0.15 + mouseInfluence * 0.5);
  float noise3 = snoise(uv * 8.0 + uTime * 0.2);
  
  // Combine noises
  float combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
  
  // Create gradient base
  vec3 color1 = vec3(0.05, 0.05, 0.15); // Dark blue
  vec3 color2 = vec3(0.1, 0.2, 0.4);    // Medium blue
  vec3 color3 = vec3(0.3, 0.5, 0.9);    // Bright blue
  
  // Mix colors based on position and noise
  float gradientMix = smoothstep(0.0, 1.0, vUv.y + combinedNoise * 0.3);
  vec3 gradient = mix(color1, color2, gradientMix);
  gradient = mix(gradient, color3, combinedNoise * 0.2);
  
  // Add radial glow from center
  vec2 center = vec2(0.5, 0.5);
  float distFromCenter = length(uv - center);
  float radialGlow = 1.0 - smoothstep(0.0, 1.2, distFromCenter);
  gradient += color3 * radialGlow * 0.15;
  
  // Scroll-based color shift
  gradient = mix(gradient, gradient * 1.2, uScrollProgress * 0.3);
  
  gl_FragColor = vec4(gradient, 1.0);
}
