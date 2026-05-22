"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import * as React from "react";

import { logger } from "@/lib/logger";

export interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [1, 0.5, 0.2];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}

const VERTEX = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}
`;

export function Plasma({
  color = "#ffffff",
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 1,
  mouseInteractive = true,
}: Readonly<PlasmaProps>) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch (error) {
      logger.error("Plasma: failed to create WebGL2 renderer", { error });
      return;
    }
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const useCustomColor = color ? 1.0 : 0.0;
    const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];
    const directionMultiplier = direction === "reverse" ? -1.0 : 1.0;

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive) return;
      const rect = container.getBoundingClientRect();
      const m = program.uniforms.uMouse.value as Float32Array;
      m[0] = e.clientX - rect.left;
      m[1] = e.clientY - rect.top;
    };
    if (mouseInteractive) {
      container.addEventListener("mousemove", onMouseMove);
    }

    let raf = 0;
    let contextLost = false;
    let isVisible = true;
    const t0 = performance.now();

    const tick = (t: number) => {
      if (contextLost || !isVisible) return;
      const timeValue = (t - t0) * 0.001;
      if (direction === "pingpong") {
        const period = 10;
        const segment = timeValue % period;
        const forward = Math.floor(timeValue / period) % 2 === 0;
        const u = segment / period;
        const smooth = u * u * (3 - 2 * u);
        const pingpongTime = forward ? smooth * period : (1 - smooth) * period;
        program.uniforms.uDirection.value = 1.0;
        program.uniforms.iTime.value = pingpongTime;
      } else {
        program.uniforms.iTime.value = timeValue;
      }
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(tick);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
    };
    const onContextRestored = () => {
      contextLost = false;
      if (isVisible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !contextLost) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0 },
    );
    io.observe(container);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (mouseInteractive) {
        container.removeEventListener("mousemove", onMouseMove);
      }
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return <div ref={containerRef} className="relative h-full w-full overflow-hidden" />;
}
