"use client";

import * as React from "react";
import * as THREE from "three";

import { logger } from "@/lib/logger";

export interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  pillarRotation?: number;
  quality?: "low" | "medium" | "high";
}

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_TEMPLATE = (iterations: number, waveIter: number, stepMult: number) => `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uIntensity;
uniform bool uInteractive;
uniform float uGlowAmount;
uniform float uPillarWidth;
uniform float uPillarHeight;
uniform float uNoiseIntensity;
uniform float uRotCos;
uniform float uRotSin;
uniform float uPillarRotCos;
uniform float uPillarRotSin;
uniform float uWaveSin[4];
uniform float uWaveCos[4];
varying vec2 vUv;

const float PI = 3.141592653589793;
const float EPSILON = 0.001;
const float E = 2.71828182845904523536;

float noise(vec2 coord) {
  vec2 r = (E * sin(E * coord));
  return fract(r.x * r.y * (1.0 + coord.x));
}

void main() {
  vec2 fragCoord = vUv * uResolution;
  vec2 uv = (fragCoord * 2.0 - uResolution) / uResolution.y;
  uv = vec2(
    uv.x * uPillarRotCos - uv.y * uPillarRotSin,
    uv.x * uPillarRotSin + uv.y * uPillarRotCos
  );

  vec3 origin = vec3(0.0, 0.0, -10.0);
  vec3 direction = normalize(vec3(uv, 1.0));
  float maxDepth = 50.0;
  float depth = 0.1;

  float rotCos = uRotCos;
  float rotSin = uRotSin;
  if (uInteractive && length(uMouse) > 0.0) {
    float mouseAngle = uMouse.x * PI * 2.0;
    rotCos = cos(mouseAngle);
    rotSin = sin(mouseAngle);
  }

  vec3 color = vec3(0.0);
  const int ITERATIONS = ${iterations};
  const int WAVE_ITERATIONS = ${waveIter};
  const float STEP_MULT = ${stepMult.toFixed(1)};

  for (int i = 0; i < ITERATIONS; i++) {
    vec3 pos = origin + direction * depth;
    float newX = pos.x * rotCos - pos.z * rotSin;
    float newZ = pos.x * rotSin + pos.z * rotCos;
    pos.x = newX;
    pos.z = newZ;

    vec3 deformed = pos;
    deformed.y *= uPillarHeight;
    deformed = deformed + vec3(0.0, uTime, 0.0);

    float frequency = 1.0;
    float amplitude = 1.0;
    for (int j = 0; j < WAVE_ITERATIONS; j++) {
      float wx = deformed.x * uWaveCos[j] - deformed.z * uWaveSin[j];
      float wz = deformed.x * uWaveSin[j] + deformed.z * uWaveCos[j];
      deformed.x = wx;
      deformed.z = wz;
      float phase = uTime * float(j) * 2.0;
      vec3 oscillation = cos(deformed.zxy * frequency - phase);
      deformed += oscillation * amplitude;
      frequency *= 2.0;
      amplitude *= 0.5;
    }

    vec2 cosinePair = cos(deformed.xz);
    float fieldDistance = length(cosinePair) - 0.2;

    float radialBound = length(pos.xz) - uPillarWidth;
    float k = 4.0;
    float h = max(k - abs(-radialBound - (-fieldDistance)), 0.0);
    fieldDistance = -(min(-radialBound, -fieldDistance) - h * h * 0.25 / k);
    fieldDistance = abs(fieldDistance) * 0.15 + 0.01;

    vec3 gradient = mix(uBottomColor, uTopColor, smoothstep(15.0, -15.0, pos.y));
    color += gradient / fieldDistance;

    if (fieldDistance < EPSILON || depth > maxDepth) break;
    depth += fieldDistance * STEP_MULT;
  }

  float widthNormalization = uPillarWidth / 3.0;
  color = tanh(color * uGlowAmount / widthNormalization);

  float rnd = noise(gl_FragCoord.xy);
  color -= rnd / 15.0 * uNoiseIntensity;

  gl_FragColor = vec4(color * uIntensity, 1.0);
}
`;

function parseColor(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const QUALITY_SETTINGS = {
  low: {
    iterations: 24,
    waveIterations: 1,
    pixelRatio: 0.5,
    precision: "mediump" as const,
    stepMultiplier: 1.5,
  },
  medium: {
    iterations: 40,
    waveIterations: 2,
    pixelRatio: 0.65,
    precision: "mediump" as const,
    stepMultiplier: 1.2,
  },
  high: {
    iterations: 80,
    waveIterations: 4,
    pixelRatio: 2,
    precision: "highp" as const,
    stepMultiplier: 1.0,
  },
};

export function LightPillar({
  topColor = "#5227FF",
  bottomColor = "#FF9FFC",
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className,
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = "screen",
  pillarRotation = 0,
  quality = "high",
}: Readonly<LightPillarProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const materialRef = React.useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = React.useRef(new THREE.Vector2(0, 0));
  const rotationSpeedRef = React.useRef(rotationSpeed);

  // Sync the live ref so the rAF loop reads the latest speed without
  // forcing a full WebGL teardown on every change.
  React.useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const lowEnd =
      isMobile ||
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4);
    let effectiveQuality: "low" | "medium" | "high" = quality;
    if (lowEnd && quality === "high") effectiveQuality = "medium";
    if (isMobile && quality !== "low") effectiveQuality = "low";
    const settings = QUALITY_SETTINGS[effectiveQuality];

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: effectiveQuality === "low" ? "low-power" : "high-performance",
        precision: settings.precision,
        stencil: false,
        depth: false,
      });
    } catch (error) {
      logger.error("LightPillar: failed to create WebGL renderer", { error });
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      effectiveQuality === "high"
        ? Math.min(window.devicePixelRatio, settings.pixelRatio)
        : settings.pixelRatio,
    );
    container.appendChild(renderer.domElement);

    const waveSin = new Float32Array(4);
    const waveCos = new Float32Array(4);
    const waveAngle = 0.4;
    for (let i = 0; i < 4; i++) {
      waveSin[i] = Math.sin(waveAngle);
      waveCos[i] = Math.cos(waveAngle);
    }
    const pillarRotRad = (pillarRotation * Math.PI) / 180;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_TEMPLATE(
        settings.iterations,
        settings.waveIterations,
        settings.stepMultiplier,
      ),
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uRotCos: { value: 1.0 },
        uRotSin: { value: 0.0 },
        uPillarRotCos: { value: Math.cos(pillarRotRad) },
        uPillarRotSin: { value: Math.sin(pillarRotRad) },
        uWaveSin: { value: waveSin },
        uWaveCos: { value: waveCos },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let mouseMoveTimeout: number | null = null;
    const onMouseMove = (e: MouseEvent) => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = window.setTimeout(() => {
        mouseMoveTimeout = null;
      }, 16);
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);
    };
    if (interactive) {
      container.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    let time = 0;
    let lastTime = performance.now();
    const targetFps = effectiveQuality === "low" ? 30 : 60;
    const frameTime = 1000 / targetFps;
    let raf = 0;
    const tick = (now: number) => {
      const delta = now - lastTime;
      if (delta >= frameTime) {
        time += 0.016 * rotationSpeedRef.current;
        material.uniforms.uTime.value = time;
        const a = time * 0.3;
        material.uniforms.uRotCos.value = Math.cos(a);
        material.uniforms.uRotSin.value = Math.sin(a);
        renderer.render(scene, camera);
        lastTime = now - (delta % frameTime);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let resizeTimeout: number | null = null;
    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        renderer.setSize(w, h);
        material.uniforms.uResolution.value.set(w, h);
      }, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (interactive) {
        container.removeEventListener("mousemove", onMouseMove);
      }
      cancelAnimationFrame(raf);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      material.dispose();
      geometry.dispose();
      materialRef.current = null;
    };
    // Quality + interactive trigger full re-init since they bake into the
    // fragment shader / event listeners. Other prop changes flow into the
    // uniforms via the per-prop effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot setup; prop updates are pushed via uniform-sync effects below
  }, [quality, interactive]);

  // Per-prop uniform syncs — keep WebGL context alive across prop edits.
  React.useEffect(() => {
    materialRef.current?.uniforms.uTopColor.value.copy(parseColor(topColor));
  }, [topColor]);
  React.useEffect(() => {
    materialRef.current?.uniforms.uBottomColor.value.copy(parseColor(bottomColor));
  }, [bottomColor]);
  React.useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.uIntensity.value = intensity;
  }, [intensity]);
  React.useEffect(() => {
    if (materialRef.current) materialRef.current.uniforms.uGlowAmount.value = glowAmount;
  }, [glowAmount]);
  React.useEffect(() => {
    if (materialRef.current)
      materialRef.current.uniforms.uPillarWidth.value = pillarWidth;
  }, [pillarWidth]);
  React.useEffect(() => {
    if (materialRef.current)
      materialRef.current.uniforms.uPillarHeight.value = pillarHeight;
  }, [pillarHeight]);
  React.useEffect(() => {
    if (materialRef.current)
      materialRef.current.uniforms.uNoiseIntensity.value = noiseIntensity;
  }, [noiseIntensity]);
  React.useEffect(() => {
    if (!materialRef.current) return;
    const r = (pillarRotation * Math.PI) / 180;
    materialRef.current.uniforms.uPillarRotCos.value = Math.cos(r);
    materialRef.current.uniforms.uPillarRotSin.value = Math.sin(r);
  }, [pillarRotation]);

  return (
    <div
      ref={containerRef}
      className={`absolute top-0 left-0 h-full w-full ${className ?? ""}`}
      style={{ mixBlendMode }}
    />
  );
}
