uniform float uTime;
uniform vec3 uColor;
uniform float uGlowIntensity;
uniform vec3 uCameraPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  // Fresnel effect
  vec3 viewDirection = normalize(uCameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);
  
  // Base color with metallic look
  vec3 baseColor = uColor;
  
  // Add holographic shimmer
  float shimmer = sin(vPosition.x * 10.0 + uTime * 2.0) * 
                  cos(vPosition.y * 10.0 - uTime * 1.5) * 0.5 + 0.5;
  baseColor += vec3(0.1, 0.3, 0.5) * shimmer * 0.3;
  
  // Edge glow with fresnel
  vec3 glowColor = vec3(0.4, 0.7, 1.0);
  vec3 finalColor = mix(baseColor, glowColor, fresnel * 0.6);
  
  // Add emissive glow
  finalColor += uColor * uGlowIntensity * 0.5;
  
  // Animated scanlines
  float scanline = sin(vPosition.y * 20.0 + uTime * 3.0) * 0.5 + 0.5;
  finalColor += vec3(0.05, 0.1, 0.2) * scanline * 0.2;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
