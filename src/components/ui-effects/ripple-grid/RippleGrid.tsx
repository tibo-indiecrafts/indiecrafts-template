"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import * as React from "react";

export interface RippleGridProps {
  enableRainbow?: boolean;
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  gridThickness?: number;
  fadeDistance?: number;
  vignetteStrength?: number;
  glowIntensity?: number;
  opacity?: number;
  gridRotation?: number;
  mouseInteraction?: boolean;
  mouseInteractionRadius?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1];
}

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform bool enableRainbow;
uniform vec3 gridColor;
uniform float rippleIntensity;
uniform float gridSize;
uniform float gridThickness;
uniform float fadeDistance;
uniform float vignetteStrength;
uniform float glowIntensity;
uniform float opacity;
uniform float gridRotation;
uniform bool mouseInteraction;
uniform vec2 mousePosition;
uniform float mouseInfluence;
uniform float mouseInteractionRadius;
varying vec2 vUv;

float pi = 3.141592;

mat2 rotate(float angle){ float s = sin(angle), c = cos(angle); return mat2(c, -s, s, c); }

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;

  if (gridRotation != 0.0) uv = rotate(gridRotation * pi / 180.0) * uv;

  float dist = length(uv);
  float func = sin(pi * (iTime - dist));
  vec2 rippleUv = uv + uv * func * rippleIntensity;

  if (mouseInteraction && mouseInfluence > 0.0) {
    vec2 mouseUv = (mousePosition * 2.0 - 1.0);
    mouseUv.x *= iResolution.x / iResolution.y;
    float mouseDist = length(uv - mouseUv);
    float influence = mouseInfluence * exp(-mouseDist * mouseDist / (mouseInteractionRadius * mouseInteractionRadius));
    float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
    rippleUv += normalize(uv - mouseUv) * mouseWave * rippleIntensity * 0.3;
  }

  vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
  vec2 b = abs(a);

  float aaWidth = 0.5;
  vec2 smoothB = vec2(smoothstep(0.0, aaWidth, b.x), smoothstep(0.0, aaWidth, b.y));

  vec3 color = vec3(0.0);
  color += exp(-gridThickness * smoothB.x * (0.8 + 0.5 * sin(pi * iTime)));
  color += exp(-gridThickness * smoothB.y);
  color += 0.5 * exp(-(gridThickness / 4.0) * sin(smoothB.x));
  color += 0.5 * exp(-(gridThickness / 3.0) * smoothB.y);

  if (glowIntensity > 0.0) {
    color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.x);
    color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.y);
  }

  float ddd = exp(-2.0 * clamp(pow(dist, fadeDistance), 0.0, 1.0));
  vec2 vignetteCoords = vUv - 0.5;
  float vignette = 1.0 - pow(length(vignetteCoords) * 2.0, vignetteStrength);
  vignette = clamp(vignette, 0.0, 1.0);

  vec3 t;
  if (enableRainbow) {
    t = vec3(
      uv.x * 0.5 + 0.5 * sin(iTime),
      uv.y * 0.5 + 0.5 * cos(iTime),
      pow(cos(iTime), 4.0)
    ) + 0.5;
  } else {
    t = gridColor;
  }

  float finalFade = ddd * vignette;
  float alpha = length(color) * finalFade * opacity;
  gl_FragColor = vec4(color * t * finalFade * opacity, alpha);
}
`;

interface Uniforms {
  iTime: { value: number };
  iResolution: { value: [number, number] };
  enableRainbow: { value: boolean };
  gridColor: { value: [number, number, number] };
  rippleIntensity: { value: number };
  gridSize: { value: number };
  gridThickness: { value: number };
  fadeDistance: { value: number };
  vignetteStrength: { value: number };
  glowIntensity: { value: number };
  opacity: { value: number };
  gridRotation: { value: number };
  mouseInteraction: { value: boolean };
  mousePosition: { value: [number, number] };
  mouseInfluence: { value: number };
  mouseInteractionRadius: { value: number };
}

export function RippleGrid({
  enableRainbow = false,
  gridColor = "#ffffff",
  rippleIntensity = 0.05,
  gridSize = 10.0,
  gridThickness = 15.0,
  fadeDistance = 1.5,
  vignetteStrength = 2.0,
  glowIntensity = 0.1,
  opacity = 1.0,
  gridRotation = 0,
  mouseInteraction = true,
  mouseInteractionRadius = 1,
}: Readonly<RippleGridProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const uniformsRef = React.useRef<Uniforms | null>(null);
  const mousePosition = React.useRef({ x: 0.5, y: 0.5 });
  const targetMouse = React.useRef({ x: 0.5, y: 0.5 });
  const mouseInfluence = React.useRef(0);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const uniforms: Uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      enableRainbow: { value: enableRainbow },
      gridColor: { value: hexToRgb(gridColor) },
      rippleIntensity: { value: rippleIntensity },
      gridSize: { value: gridSize },
      gridThickness: { value: gridThickness },
      fadeDistance: { value: fadeDistance },
      vignetteStrength: { value: vignetteStrength },
      glowIntensity: { value: glowIntensity },
      opacity: { value: opacity },
      gridRotation: { value: gridRotation },
      mouseInteraction: { value: mouseInteraction },
      mousePosition: { value: [0.5, 0.5] },
      mouseInfluence: { value: 0 },
      mouseInteractionRadius: { value: mouseInteractionRadius },
    };
    uniformsRef.current = uniforms;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w, h];
    };
    window.addEventListener("resize", resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      };
    };
    const onEnter = () => {
      mouseInfluence.current = 1.0;
    };
    const onLeave = () => {
      mouseInfluence.current = 0.0;
    };
    if (mouseInteraction) {
      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
    }

    let raf = 0;
    const tick = (t: number) => {
      uniforms.iTime.value = t * 0.001;
      mousePosition.current.x += (targetMouse.current.x - mousePosition.current.x) * 0.1;
      mousePosition.current.y += (targetMouse.current.y - mousePosition.current.y) * 0.1;
      uniforms.mouseInfluence.value +=
        (mouseInfluence.current - uniforms.mouseInfluence.value) * 0.05;
      uniforms.mousePosition.value = [mousePosition.current.x, mousePosition.current.y];
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
      }
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      uniformsRef.current = null;
    };
    // One-shot setup; prop edits flow through the sync effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hot prop sync.
  React.useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    u.enableRainbow.value = enableRainbow;
    u.gridColor.value = hexToRgb(gridColor);
    u.rippleIntensity.value = rippleIntensity;
    u.gridSize.value = gridSize;
    u.gridThickness.value = gridThickness;
    u.fadeDistance.value = fadeDistance;
    u.vignetteStrength.value = vignetteStrength;
    u.glowIntensity.value = glowIntensity;
    u.opacity.value = opacity;
    u.gridRotation.value = gridRotation;
    u.mouseInteraction.value = mouseInteraction;
    u.mouseInteractionRadius.value = mouseInteractionRadius;
  }, [
    enableRainbow,
    gridColor,
    rippleIntensity,
    gridSize,
    gridThickness,
    fadeDistance,
    vignetteStrength,
    glowIntensity,
    opacity,
    gridRotation,
    mouseInteraction,
    mouseInteractionRadius,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden [&_canvas]:block"
    />
  );
}
