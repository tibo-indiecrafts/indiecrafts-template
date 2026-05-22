"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import * as React from "react";

export interface LiquidChromeProps {
  className?: string;
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
}

const VERT = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uBaseColor;
uniform float uAmplitude;
uniform float uFrequencyX;
uniform float uFrequencyY;
uniform vec2 uMouse;
varying vec2 vUv;

vec4 renderImage(vec2 uvCoord) {
    vec2 fragCoord = uvCoord * uResolution.xy;
    vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

    for (float i = 1.0; i < 10.0; i++){
        uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
        uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
    }

    vec2 diff = (uvCoord - uMouse);
    float dist = length(diff);
    float falloff = exp(-dist * 20.0);
    float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
    uv += (diff / (dist + 0.0001)) * ripple * falloff;

    vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
    return vec4(color, 1.0);
}

void main() {
    vec4 col = vec4(0.0);
    int samples = 0;
    for (int i = -1; i <= 1; i++){
        for (int j = -1; j <= 1; j++){
            vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
            col += renderImage(vUv + offset);
            samples++;
        }
    }
    gl_FragColor = col / float(samples);
}
`;

export function LiquidChrome({
  className,
  baseColor = [0.1, 0.1, 0.1],
  speed = 0.2,
  amplitude = 0.5,
  frequencyX = 3,
  frequencyY = 2,
  interactive = true,
}: Readonly<LiquidChromeProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  // Stash hot props in a ref so the (intentionally empty-deps) WebGL setup
  // doesn't tear down / rebuild the GL context on every prop change.
  const propsRef = React.useRef({
    baseColor,
    speed,
    amplitude,
    frequencyX,
    frequencyY,
    interactive,
  });
  React.useLayoutEffect(() => {
    propsRef.current = {
      baseColor,
      speed,
      amplitude,
      frequencyX,
      frequencyY,
      interactive,
    };
  });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ antialias: true });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);
    gl.canvas.style.display = "block";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const initial = propsRef.current;
    const resUniform = new Float32Array([1, 1, 1]);
    const baseColorUniform = new Float32Array(initial.baseColor);
    const mouseUniform = new Float32Array([0, 0]);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: resUniform },
        uBaseColor: { value: baseColorUniform },
        uAmplitude: { value: initial.amplitude },
        uFrequencyX: { value: initial.frequencyX },
        uFrequencyY: { value: initial.frequencyY },
        uMouse: { value: mouseUniform },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      resUniform[0] = gl.canvas.width;
      resUniform[1] = gl.canvas.height;
      resUniform[2] = gl.canvas.width / gl.canvas.height;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseUniform[0] = (event.clientX - rect.left) / rect.width;
      mouseUniform[1] = 1 - (event.clientY - rect.top) / rect.height;
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      const touch = event.touches[0];
      const rect = container.getBoundingClientRect();
      mouseUniform[0] = (touch.clientX - rect.left) / rect.width;
      mouseUniform[1] = 1 - (touch.clientY - rect.top) / rect.height;
    };
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove);

    let raf = 0;
    const tick = (t: number) => {
      const p = propsRef.current;
      program.uniforms.uTime.value = t * 0.001 * p.speed;
      program.uniforms.uAmplitude.value = p.amplitude;
      program.uniforms.uFrequencyX.value = p.frequencyX;
      program.uniforms.uFrequencyY.value = p.frequencyY;
      baseColorUniform[0] = p.baseColor[0];
      baseColorUniform[1] = p.baseColor[1];
      baseColorUniform[2] = p.baseColor[2];
      // Zero out mouse uniform when interactive is off so the ripple anchors
      // at (0,0) instead of wherever the last move landed.
      if (!p.interactive) {
        mouseUniform[0] = 0;
        mouseUniform[1] = 0;
      }
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className ?? ""}`} />
  );
}
