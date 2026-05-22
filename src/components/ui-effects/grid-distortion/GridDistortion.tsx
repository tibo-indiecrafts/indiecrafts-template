"use client";

import * as React from "react";
import * as THREE from "three";

import { logger } from "@/lib/logger";

export interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
}

const VERTEX = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
`;

export function GridDistortion({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className,
}: Readonly<GridDistortionProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: null as THREE.DataTexture | null },
    };

    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 255 - 125;
      data[i * 4 + 1] = Math.random() * 255 - 125;
    }
    const dataTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      renderer.setSize(w, h);
      plane.scale.set(aspect, 1, 1);
      camera.left = -aspect / 2;
      camera.right = aspect / 2;
      camera.top = 0.5;
      camera.bottom = -0.5;
      camera.updateProjectionMatrix();
      uniforms.resolution.value.set(w, h, 1, 1);
    };

    new THREE.TextureLoader().load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      uniforms.uTexture.value = texture;
      handleResize();
    });

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    const mouseState = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      mouseState.x = x;
      mouseState.y = y;
      mouseState.prevX = x;
      mouseState.prevY = y;
    };
    const onMouseLeave = () => {
      dataTexture.needsUpdate = true;
      mouseState.x = 0;
      mouseState.y = 0;
      mouseState.prevX = 0;
      mouseState.prevY = 0;
      mouseState.vX = 0;
      mouseState.vY = 0;
    };
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    handleResize();

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      uniforms.time.value += 0.05;
      const buf = dataTexture.image.data;
      if (!(buf instanceof Float32Array)) {
        logger.error("GridDistortion: dataTexture buffer is not Float32Array");
        return;
      }
      for (let i = 0; i < size * size; i++) {
        buf[i * 4] *= relaxation;
        buf[i * 4 + 1] *= relaxation;
      }
      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const distSq = Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
          if (distSq < maxDist * maxDist) {
            const index = 4 * (i + size * j);
            const power = Math.min(maxDist / Math.sqrt(distSq), 10);
            buf[index] += strength * 100 * mouseState.vX * power;
            buf[index + 1] -= strength * 100 * mouseState.vY * power;
          }
        }
      }
      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      uniforms.uTexture.value?.dispose();
    };
  }, [grid, mouse, strength, relaxation, imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
    />
  );
}
