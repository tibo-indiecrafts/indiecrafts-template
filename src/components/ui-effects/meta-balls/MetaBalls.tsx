"use client";

import { Camera, Mesh, Program, Renderer, Transform, Triangle, Vec3 } from "ogl";
import * as React from "react";

export interface MetaBallsProps {
  color?: string;
  speed?: number;
  enableMouseInteraction?: boolean;
  hoverSmoothness?: number;
  animationSize?: number;
  ballCount?: number;
  clumpFactor?: number;
  cursorBallSize?: number;
  cursorBallColor?: string;
  enableTransparency?: boolean;
  className?: string;
}

interface BallParams {
  st: number;
  dtFactor: number;
  baseScale: number;
  toggle: number;
  radius: number;
}

const MAX_BALLS = 50;

function parseHexColor(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.substring(0, 2), 16) / 255,
    parseInt(c.substring(2, 4), 16) / 255,
    parseInt(c.substring(4, 6), 16) / 255,
  ];
}

const fract = (x: number) => x - Math.floor(x);

function hash31(p: number): number[] {
  const r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const rYzx = [r[1], r[2], r[0]];
  const dot =
    r[0] * (rYzx[0] + 33.33) + r[1] * (rYzx[1] + 33.33) + r[2] * (rYzx[2] + 33.33);
  return r.map((v) => fract(v + dot));
}

function hash33(v: number[]): number[] {
  const p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
  const pYxz = [p[1], p[0], p[2]];
  const dot =
    p[0] * (pYxz[0] + 33.33) + p[1] * (pYxz[1] + 33.33) + p[2] * (pYxz[2] + 33.33);
  const q = p.map((v) => fract(v + dot));
  const pXxy = [q[0], q[0], q[1]];
  const pYxx = [q[1], q[0], q[0]];
  const pZyx = [q[2], q[1], q[0]];
  return [0, 1, 2].map((i) => fract((pXxy[i] + pYxx[i]) * pZyx[i]));
}

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iMetaBalls[50];
uniform float iClumpFactor;
uniform bool enableTransparency;
out vec4 outColor;

float getMetaBallValue(vec2 c, float r, vec2 p) {
  vec2 d = p - c;
  return (r * r) / dot(d, d);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  float scale = iAnimationSize / iResolution.y;
  vec2 coord = (fc - iResolution.xy * 0.5) * scale;
  vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
  float m1 = 0.0;
  for (int i = 0; i < 50; i++) {
    if (i >= iBallCount) break;
    m1 += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord);
  }
  float m2 = getMetaBallValue(mouseW, iCursorBallSize, coord);
  float total = m1 + m2;
  float f = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
  vec3 cFinal = vec3(0.0);
  if (total > 0.0) {
    float alpha1 = m1 / total;
    float alpha2 = m2 / total;
    cFinal = iColor * alpha1 + iCursorColor * alpha2;
  }
  outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);
}
`;

export function MetaBalls({
  color = "#ffffff",
  speed = 0.3,
  enableMouseInteraction = true,
  hoverSmoothness = 0.05,
  animationSize = 30,
  ballCount = 15,
  clumpFactor = 1,
  cursorBallSize = 3,
  cursorBallColor = "#ffffff",
  enableTransparency = false,
  className,
}: Readonly<MetaBallsProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Hot props read every frame; init effect stays empty-deps so live tweaks
  // don't tear down the GL context.
  const propsRef = React.useRef({
    color,
    cursorBallColor,
    speed,
    enableMouseInteraction,
    hoverSmoothness,
    animationSize,
    ballCount,
    clumpFactor,
    cursorBallSize,
    enableTransparency,
  });
  React.useLayoutEffect(() => {
    propsRef.current = {
      color,
      cursorBallColor,
      speed,
      enableMouseInteraction,
      hoverSmoothness,
      animationSize,
      ballCount,
      clumpFactor,
      cursorBallSize,
      enableTransparency,
    };
  });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = 1;
    const initial = propsRef.current;
    const renderer = new Renderer({
      dpr,
      alpha: true,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, initial.enableTransparency ? 0 : 1);
    gl.canvas.style.display = "block";
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10,
    });
    camera.position.z = 1;

    const geometry = new Triangle(gl);
    const [r1, g1, b1] = parseHexColor(initial.color);
    const [r2, g2, b2] = parseHexColor(initial.cursorBallColor);
    const metaBallsUniform: Vec3[] = Array.from(
      { length: MAX_BALLS },
      () => new Vec3(0, 0, 0),
    );

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: new Vec3(r1, g1, b1) },
        iCursorColor: { value: new Vec3(r2, g2, b2) },
        iAnimationSize: { value: initial.animationSize },
        iBallCount: { value: initial.ballCount },
        iCursorBallSize: { value: initial.cursorBallSize },
        iMetaBalls: { value: metaBallsUniform },
        iClumpFactor: { value: initial.clumpFactor },
        enableTransparency: { value: initial.enableTransparency },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    const buildBallParams = (count: number) => {
      const out: BallParams[] = [];
      for (let i = 0; i < count; i++) {
        const idx = i + 1;
        const h1 = hash31(idx);
        const st = h1[0] * (2 * Math.PI);
        const dtFactor = 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI);
        const baseScale = 5.0 + h1[1] * (10.0 - 5.0);
        const h2 = hash33(h1);
        const toggle = Math.floor(h2[0] * 2.0);
        const radius = 0.5 + h2[2] * (2.0 - 0.5);
        out.push({ st, dtFactor, baseScale, toggle, radius });
      }
      return out;
    };
    let ballParams = buildBallParams(Math.min(initial.ballCount, MAX_BALLS));
    let lastBallCount = initial.ballCount;

    const mouseBallPos = { x: 0, y: 0 };
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = `${width}px`;
      gl.canvas.style.height = `${height}px`;
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      if (!propsRef.current.enableMouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerX = (px / rect.width) * gl.canvas.width;
      pointerY = (1 - py / rect.height) * gl.canvas.height;
    };
    const onPointerEnter = () => {
      if (propsRef.current.enableMouseInteraction) pointerInside = true;
    };
    const onPointerLeave = () => {
      pointerInside = false;
    };
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);

    const startTime = performance.now();
    let raf = 0;

    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      const p = propsRef.current;
      const elapsed = (t - startTime) * 0.001;
      program.uniforms.iTime.value = elapsed;

      // Live-sync uniforms that don't require buffer re-allocation.
      const [cr, cg, cb] = parseHexColor(p.color);
      program.uniforms.iColor.value.set(cr, cg, cb);
      const [kr, kg, kb] = parseHexColor(p.cursorBallColor);
      program.uniforms.iCursorColor.value.set(kr, kg, kb);
      program.uniforms.iAnimationSize.value = p.animationSize;
      program.uniforms.iCursorBallSize.value = p.cursorBallSize;
      program.uniforms.iClumpFactor.value = p.clumpFactor;
      program.uniforms.enableTransparency.value = p.enableTransparency;
      gl.clearColor(0, 0, 0, p.enableTransparency ? 0 : 1);

      const effective = Math.min(p.ballCount, MAX_BALLS);
      if (effective !== lastBallCount) {
        ballParams = buildBallParams(effective);
        lastBallCount = effective;
      }
      program.uniforms.iBallCount.value = effective;

      for (let i = 0; i < effective; i++) {
        const b = ballParams[i];
        const dt = elapsed * p.speed * b.dtFactor;
        const th = b.st + dt;
        const x = Math.cos(th);
        const y = Math.sin(th + dt * b.toggle);
        metaBallsUniform[i].set(
          x * b.baseScale * p.clumpFactor,
          y * b.baseScale * p.clumpFactor,
          b.radius,
        );
      }

      let targetX: number;
      let targetY: number;
      if (pointerInside) {
        targetX = pointerX;
        targetY = pointerY;
      } else {
        const cx = gl.canvas.width * 0.5;
        const cy = gl.canvas.height * 0.5;
        const rx = gl.canvas.width * 0.15;
        const ry = gl.canvas.height * 0.15;
        targetX = cx + Math.cos(elapsed * p.speed) * rx;
        targetY = cy + Math.sin(elapsed * p.speed) * ry;
      }
      mouseBallPos.x += (targetX - mouseBallPos.x) * p.hoverSmoothness;
      mouseBallPos.y += (targetY - mouseBallPos.y) * p.hoverSmoothness;
      program.uniforms.iMouse.value.set(mouseBallPos.x, mouseBallPos.y, 0);

      renderer.render({ scene, camera });
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className ?? ""}`} />
  );
}
