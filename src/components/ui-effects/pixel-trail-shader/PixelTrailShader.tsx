"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- r3f's `shaderMaterial` returns a class with dynamic uniform proxies that don't carry useful types; treating the material as `any` for setting uniforms keeps the file small. */

import { shaderMaterial, useTrailTexture } from "@react-three/drei";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

export interface PixelTrailShaderProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  easingFunction?: (x: number) => number;
  gooeyFilter?: { id: string; strength: number };
  gooeyEnabled?: boolean;
  color?: string;
  className?: string;
}

const identityEase = (x: number) => x;

const DotMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(),
    mouseTrail: null,
    gridSize: 100,
    pixelColor: new THREE.Color("#ffffff"),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;
      float trail = texture2D(mouseTrail, gridUvCenter).r;
      gl_FragColor = vec4(pixelColor, trail);
    }
  `,
);

function GooeyFilter({ id, strength }: Readonly<{ id: string; strength: number }>) {
  return (
    <svg className="absolute z-[1] overflow-hidden">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

interface SceneProps {
  gridSize: number;
  trailSize: number;
  maxAge: number;
  interpolate: number;
  easingFunction: (x: number) => number;
  pixelColor: string;
}

function Scene({
  gridSize,
  trailSize,
  maxAge,
  interpolate,
  easingFunction,
  pixelColor,
}: Readonly<SceneProps>) {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  // Lazy-init to keep `new DotMaterial()` out of the render path (React
  // Compiler purity rule rejects `useMemo(() => new X(), [])`).
  const [dotMaterial] = React.useState(() => new DotMaterial());
  React.useEffect(() => () => dotMaterial.dispose(), [dotMaterial]);
  React.useEffect(() => {
    ((dotMaterial as any).uniforms.pixelColor.value as THREE.Color).set(pixelColor);
  }, [dotMaterial, pixelColor]);

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: trailSize,
    maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction || identityEase,
  }) as [THREE.Texture | null, (e: ThreeEvent<PointerEvent>) => void];

  React.useEffect(() => {
    if (!trail) return;
    // Imperatively configure the THREE texture returned by `useTrailTexture`
    // for crisp per-cell sampling. React Compiler treats hook returns as
    // frozen, but textures are mutable scene objects and the drei hook
    // explicitly hands them out for this kind of tweak.
    /* eslint-disable react-hooks/immutability -- intentional THREE texture configuration */
    trail.minFilter = THREE.NearestFilter;
    trail.magFilter = THREE.NearestFilter;
    trail.wrapS = THREE.ClampToEdgeWrapping;
    trail.wrapT = THREE.ClampToEdgeWrapping;
    /* eslint-enable react-hooks/immutability */
  }, [trail]);

  const scale = Math.max(viewport.width, viewport.height) / 2;

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={onMove}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={dotMaterial}
        gridSize={gridSize}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        mouseTrail={trail}
      />
    </mesh>
  );
}

export function PixelTrailShader({
  gridSize = 40,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  easingFunction = identityEase,
  gooeyFilter,
  gooeyEnabled = false,
  color = "#ffffff",
  className,
}: Readonly<PixelTrailShaderProps>) {
  const reactId = React.useId();
  const filterId = gooeyFilter?.id ?? `pixel-trail-goo-${reactId.replace(/:/g, "")}`;
  const filterStrength = gooeyFilter?.strength ?? 2;
  const showFilter = gooeyEnabled || Boolean(gooeyFilter);

  return (
    <>
      {showFilter && <GooeyFilter id={filterId} strength={filterStrength} />}
      <Canvas
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
        className={`absolute z-[1] ${className ?? ""}`}
        style={showFilter ? { filter: `url(#${filterId})` } : undefined}
      >
        <Scene
          gridSize={gridSize}
          trailSize={trailSize}
          maxAge={maxAge}
          interpolate={interpolate}
          easingFunction={easingFunction}
          pixelColor={color}
        />
      </Canvas>
    </>
  );
}
