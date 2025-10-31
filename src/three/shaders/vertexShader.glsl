varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform float uSize;

void main() {
  vUv = uv;
  vPosition = position;
  
  vec3 pos = position;
  
  // Add wave animation
  float wave = sin(pos.x * 0.5 + uTime) * cos(pos.z * 0.5 + uTime) * 0.3;
  pos.y += wave;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
