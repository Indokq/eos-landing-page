uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Create circular particle shape
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  
  // Add pulsing effect
  float pulse = sin(uTime * 2.0 + vPosition.x * 0.5) * 0.5 + 0.5;
  alpha *= pulse * 0.6 + 0.4;
  
  // Color variation based on position
  vec3 color = mix(uColor, vec3(0.2, 0.6, 1.0), vPosition.y * 0.5 + 0.5);
  
  gl_FragColor = vec4(color, alpha);
}
