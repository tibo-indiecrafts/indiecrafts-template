"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import * as React from "react";

export interface RadarProps {
  speed?: number;
  scale?: number;
  ringCount?: number;
  spokeCount?: number;
  ringThickness?: number;
  spokeThickness?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  sweepLobes?: number;
  color?: string;
  backgroundColor?: string;
  falloff?: number;
  brightness?: number;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
}

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

const VERTEX = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const FRAGMENT = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uRingCount;
uniform float uSpokeCount;
uniform float uRingThickness;
uniform float uSpokeThickness;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepLobes;
uniform vec3 uColor;
uniform vec3 uBgColor;
uniform float uFalloff;
uniform float uBrightness;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;

#define TAU 6.28318530718
#define PI 3.14159265359

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  st = st * 2.0 - 1.0;
  st.x *= uResolution.x / uResolution.y;

  if (uEnableMouse) {
    vec2 mShift = (uMouse * 2.0 - 1.0);
    mShift.x *= uResolution.x / uResolution.y;
    st -= mShift * uMouseInfluence;
  }

  st *= uScale;

  float dist = length(st);
  float theta = atan(st.y, st.x);
  float t = uTime * uSpeed;

  float ringPhase = dist * uRingCount - t;
  float ringDist = abs(fract(ringPhase) - 0.5);
  float ringGlow = 1.0 - smoothstep(0.0, uRingThickness, ringDist);

  float spokeAngle = abs(fract(theta * uSpokeCount / TAU + 0.5) - 0.5) * TAU / uSpokeCount;
  float arcDist = spokeAngle * dist;
  float spokeGlow = (1.0 - smoothstep(0.0, uSpokeThickness, arcDist)) * smoothstep(0.0, 0.1, dist);

  float sweepPhase = t * uSweepSpeed;
  float sweepBeam = pow(max(0.5 * sin(uSweepLobes * theta + sweepPhase) + 0.5, 0.0), uSweepWidth);

  float fade = smoothstep(1.05, 0.85, dist) * pow(max(1.0 - dist, 0.0), uFalloff);

  float intensity = max((ringGlow + spokeGlow + sweepBeam) * fade * uBrightness, 0.0);
  vec3 col = uColor * intensity + uBgColor;
  float alpha = clamp(length(col), 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}
`;

export function Radar({
  speed = 1.0,
  scale = 0.5,
  ringCount = 10.0,
  spokeCount = 10.0,
  ringThickness = 0.05,
  spokeThickness = 0.01,
  sweepSpeed = 1.0,
  sweepWidth = 2.0,
  sweepLobes = 1.0,
  color = "#9f29ff",
  backgroundColor = "#000000",
  falloff = 2.0,
  brightness = 1.0,
  enableMouseInteraction = true,
  mouseInfluence = 0.1,
}: Readonly<RadarProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height],
        },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uRingCount: { value: ringCount },
        uSpokeCount: { value: spokeCount },
        uRingThickness: { value: ringThickness },
        uSpokeThickness: { value: spokeThickness },
        uSweepSpeed: { value: sweepSpeed },
        uSweepWidth: { value: sweepWidth },
        uSweepLobes: { value: sweepLobes },
        uColor: { value: hexToVec3(color) },
        uBgColor: { value: hexToVec3(backgroundColor) },
        uFalloff: { value: falloff },
        uBrightness: { value: brightness },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseInfluence: { value: mouseInfluence },
        uEnableMouse: { value: enableMouseInteraction },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    container.appendChild(gl.canvas);

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      ];
    };
    window.addEventListener("resize", resize);
    resize();

    const currentMouse: [number, number] = [0.5, 0.5];
    const targetMouse: [number, number] = [0.5, 0.5];
    const onMouseMove = (e: MouseEvent) => {
      const rect = gl.canvas.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    const onMouseLeave = () => {
      targetMouse[0] = 0.5;
      targetMouse[1] = 0.5;
    };
    if (enableMouseInteraction) {
      gl.canvas.addEventListener("mousemove", onMouseMove);
      gl.canvas.addEventListener("mouseleave", onMouseLeave);
    }

    let frame = 0;
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      program.uniforms.uTime.value = time * 0.001;
      if (enableMouseInteraction) {
        currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      } else {
        program.uniforms.uMouse.value[0] = 0.5;
        program.uniforms.uMouse.value[1] = 0.5;
      }
      renderer.render({ scene: mesh });
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      if (enableMouseInteraction) {
        gl.canvas.removeEventListener("mousemove", onMouseMove);
        gl.canvas.removeEventListener("mouseleave", onMouseLeave);
      }
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    speed,
    scale,
    ringCount,
    spokeCount,
    ringThickness,
    spokeThickness,
    sweepSpeed,
    sweepWidth,
    sweepLobes,
    color,
    backgroundColor,
    falloff,
    brightness,
    enableMouseInteraction,
    mouseInfluence,
  ]);

  return <div ref={containerRef} className="h-full w-full" />;
}
