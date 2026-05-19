/* eslint-disable @typescript-eslint/ban-ts-comment -- ts-nocheck below */
// @ts-nocheck -- Maxime Heckel brush-ripple effect; R3F intrinsic JSX + cross-render scene wiring carry well-known type quirks. Accepted as-is.
"use client";
/* eslint-disable react-hooks/immutability -- R3F useFrame mutates scene/uniforms each frame by design. */

import { useFBO, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { fragment, vertex } from "./shaders";
import { useDimension } from "./use-dimension";
import { useMouse } from "./use-mouse";

const MAX_WAVES = 100;

function buildBrushTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.6)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export interface ModelProps {
  images: string[];
}

export default function Model({ images }: Readonly<ModelProps>) {
  const { viewport, camera } = useThree();
  const brushTexture = useMemo(() => buildBrushTexture(), []);
  const meshRefs = useRef([]);
  const [meshes, setMeshes] = useState([]);
  const mouse = useMouse();
  const device = useDimension();
  const [prevMouse, setPrevMouse] = useState({ x: 0, y: 0 });
  const [currentWave, setCurrentWave] = useState(0);

  const scene = useMemo(() => new THREE.Scene(), []);

  const uniforms = useMemo(
    () => ({
      uDisplacement: { value: null },
      uTexture: { value: null },
      winResolution: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  const fboBase = useFBO(device.width, device.height);
  const fboTexture = useFBO(device.width, device.height);

  const imageTextures = useTexture(images);

  const { imageScene, imageCamera } = useMemo(() => {
    const s = new THREE.Scene();
    const c = new THREE.OrthographicCamera(
      viewport.width / -2,
      viewport.width / 2,
      viewport.height / 2,
      viewport.height / -2,
      -1000,
      1000,
    );
    c.position.z = 2;
    s.add(c);
    const geometry = new THREE.PlaneGeometry(1, 1);
    const group = new THREE.Group();
    const offsets = [-0.25, 0, 0.25];
    imageTextures.forEach((tex, i) => {
      const material = new THREE.MeshBasicMaterial({ map: tex });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = offsets[i] * viewport.width;
      mesh.position.y = 0;
      mesh.position.z = 1;
      mesh.scale.x = viewport.width / 5;
      mesh.scale.y = viewport.width / 4;
      group.add(mesh);
    });
    s.add(group);
    return { imageScene: s, imageCamera: c };
  }, [imageTextures, viewport.width, viewport.height]);

  useEffect(() => {
    const generated = Array.from({ length: MAX_WAVES }).map((_, i) => (
      <mesh
        key={i}
        position={[0, 0, 0]}
        ref={(el) => (meshRefs.current[i] = el)}
        rotation={[0, 0, Math.random()]}
        visible={false}
      >
        <planeGeometry args={[60, 60, 1, 1]} />
        <meshBasicMaterial transparent map={brushTexture} />
      </mesh>
    ));
    setMeshes(generated);
  }, [brushTexture]);

  function setNewWave(x, y, idx) {
    const mesh = meshRefs.current[idx];
    if (!mesh) return;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.visible = true;
    mesh.material.opacity = 1;
    mesh.scale.x = 1.75;
    mesh.scale.y = 1.75;
  }

  function trackMousePos(x, y) {
    if (Math.abs(x - prevMouse.x) > 0.1 || Math.abs(y - prevMouse.y) > 0.1) {
      setCurrentWave((currentWave + 1) % MAX_WAVES);
      setNewWave(x, y, currentWave);
    }
    setPrevMouse({ x, y });
  }

  useFrame(({ gl, scene: finalScene }) => {
    const x = mouse.x - device.width / 2;
    const y = -mouse.y + device.height / 2;
    trackMousePos(x, y);
    meshRefs.current.forEach((mesh) => {
      if (mesh && mesh.visible) {
        mesh.rotation.z += 0.025;
        mesh.material.opacity *= 0.95;
        mesh.scale.x = 0.98 * mesh.scale.x + 0.155;
        mesh.scale.y = 0.98 * mesh.scale.y + 0.155;
      }
    });

    if (device.width <= 0 || device.height <= 0) return;

    gl.setRenderTarget(fboBase);
    gl.clear();
    meshRefs.current.forEach((mesh) => {
      if (mesh && mesh.visible) scene.add(mesh);
    });
    gl.render(scene, camera);
    meshRefs.current.forEach((mesh) => {
      if (mesh && mesh.visible) scene.remove(mesh);
    });
    uniforms.uTexture.value = fboTexture.texture;

    gl.setRenderTarget(fboTexture);
    gl.render(imageScene, imageCamera);
    uniforms.uDisplacement.value = fboBase.texture;

    gl.setRenderTarget(null);
    gl.render(finalScene, camera);

    uniforms.winResolution.value = new THREE.Vector2(
      device.width,
      device.height,
    ).multiplyScalar(device.pixelRatio);
  }, 1);

  return (
    <group>
      {meshes}
      <mesh>
        <planeGeometry args={[device.width, device.height, 1, 1]} />
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          uniforms={uniforms}
        />
      </mesh>
    </group>
  );
}
