"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

export interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: "capsule" | "sphere" | "box" | "tetrahedron";
  fieldStrength?: number;
}

interface Particle {
  t: number;
  speed: number;
  mx: number;
  my: number;
  mz: number;
  cx: number;
  cy: number;
  cz: number;
  randomRadiusOffset: number;
}

function AntigravityInner({
  count = 300,
  magnetRadius = 10,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 2,
  lerpSpeed = 0.1,
  color = "#FF9FFC",
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = "capsule",
  fieldStrength = 10,
}: Readonly<AntigravityProps>) {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  // Lazy useState init keeps the Object3D allocation off the render path —
  // React Compiler flags `new THREE.Object3D()` directly inside the body.
  const [dummy] = React.useState(() => new THREE.Object3D());

  const lastMousePos = React.useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = React.useRef(0);
  const virtualMouse = React.useRef({ x: 0, y: 0 });

  // Mutable simulation state — held in a ref because useFrame mutates per
  // frame, and React Compiler flags mutating `useMemo` results.
  const particlesRef = React.useRef<Particle[]>([]);
  React.useEffect(() => {
    const width = viewport.width || 100;
    const height = viewport.height || 100;
    const next: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;
      next.push({
        t: Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        randomRadiusOffset: (Math.random() - 0.5) * 2,
      });
    }
    particlesRef.current = next;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const { viewport: v, pointer: m } = state;
    const particles = particlesRef.current;
    if (particles.length === 0) return;

    const mouseDist = Math.hypot(
      m.x - lastMousePos.current.x,
      m.y - lastMousePos.current.y,
    );
    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;
    // r3f v10 dropped `state.clock` from the FrameState; `state.elapsed`
    // exposes the same "seconds since first frame" value.
    const elapsed = state.elapsed;
    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      destX = Math.sin(elapsed * 0.5) * (v.width / 4);
      destY = Math.cos(elapsed * 0.5 * 2) * (v.height / 4);
    }

    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;
    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;
    const globalRotation = elapsed * rotationSpeed;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      particle.t += particle.speed / 2;
      const t = particle.t;

      const projectionFactor = 1 - particle.cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = particle.mx - projectedTargetX;
      const dy = particle.my - projectedTargetY;
      const dist = Math.hypot(dx, dy);

      let targetPosX = particle.mx;
      let targetPosY = particle.my;
      let targetPosZ = particle.mz * depthFactor;

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;
        const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const deviation = particle.randomRadiusOffset * (5 / (fieldStrength + 0.1));
        const currentRingRadius = ringRadius + wave + deviation;
        targetPosX = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetPosY = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetPosZ =
          particle.mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);
      }

      particle.cx += (targetPosX - particle.cx) * lerpSpeed;
      particle.cy += (targetPosY - particle.cy) * lerpSpeed;
      particle.cz += (targetPosZ - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const currentDistToMouse = Math.hypot(
        particle.cx - projectedTargetX,
        particle.cy - projectedTargetY,
      );
      const distFromRing = Math.abs(currentDistToMouse - ringRadius);
      const scaleFactor = Math.max(0, Math.min(1, 1 - distFromRing / 10));
      const finalScale =
        scaleFactor *
        (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) *
        particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === "capsule" && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === "sphere" && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === "box" && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === "tetrahedron" && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}

export function Antigravity(props: Readonly<AntigravityProps>) {
  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
      <AntigravityInner {...props} />
    </Canvas>
  );
}
