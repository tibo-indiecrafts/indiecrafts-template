"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- Port of Kevin Levron's ballpit demo. The internal scene/physics classes use heterogeneous THREE shader-chunk extensions; pinning each `any` would balloon the file with no runtime benefit. */

import * as React from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Clock,
  Color,
  InstancedMesh,
  MathUtils,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PMREMGenerator,
  PointLight,
  Raycaster,
  Scene,
  ShaderChunk,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  type WebGLRendererParameters,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface XConfig {
  canvas?: HTMLCanvasElement;
  id?: string;
  rendererOptions?: Partial<WebGLRendererParameters>;
  size?: "parent" | { width: number; height: number };
}

interface SizeData {
  width: number;
  height: number;
  wWidth: number;
  wHeight: number;
  ratio: number;
  pixelRatio: number;
}

class X {
  #config: XConfig;
  #postprocessing: any;
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #resizeTimer?: number;
  #animationFrameId = 0;
  #clock = new Clock();
  #animationState = { elapsed: 0, delta: 0 };
  #isAnimating = false;
  #isVisible = false;

  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov!: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene!: Scene;
  renderer!: WebGLRenderer;
  size: SizeData = {
    width: 0,
    height: 0,
    wWidth: 0,
    wHeight: 0,
    ratio: 0,
    pixelRatio: 0,
  };

  render: () => void = this.#render.bind(this);
  onBeforeRender: (state: { elapsed: number; delta: number }) => void = () => {};
  onAfterRender: (state: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: SizeData) => void = () => {};
  isDisposed = false;

  // Bound handlers stored once so add/removeEventListener can pair up.
  #boundResize = this.#onResize.bind(this);
  #boundVisibilityChange = this.#onVisibilityChange.bind(this);

  constructor(config: XConfig) {
    this.#config = { ...config };
    this.#initCamera();
    this.#initScene();
    this.#initRenderer();
    this.resize();
    this.#initObservers();
  }

  #initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #initScene() {
    this.scene = new Scene();
  }

  #initRenderer() {
    if (this.#config.canvas) this.canvas = this.#config.canvas;
    this.canvas.style.display = "block";
    const rendererOptions: WebGLRendererParameters = {
      canvas: this.canvas,
      powerPreference: "high-performance",
      ...(this.#config.rendererOptions ?? {}),
    };
    this.renderer = new WebGLRenderer(rendererOptions);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #initObservers() {
    if (!(this.#config.size instanceof Object)) {
      window.addEventListener("resize", this.#boundResize);
      if (this.#config.size === "parent" && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(this.#boundResize);
        this.#resizeObserver.observe(this.canvas.parentNode as Element);
      }
    }
    this.#intersectionObserver = new IntersectionObserver(
      this.#onIntersection.bind(this),
      { root: null, rootMargin: "0px", threshold: 0 },
    );
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.#boundVisibilityChange);
  }

  #onResize() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let w: number, h: number;
    if (this.#config.size instanceof Object) {
      w = this.#config.size.width;
      h = this.#config.size.height;
    } else if (this.#config.size === "parent" && this.canvas.parentNode) {
      w = (this.canvas.parentNode as HTMLElement).offsetWidth;
      h = (this.canvas.parentNode as HTMLElement).offsetHeight;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.#updateCamera();
    this.#updateRenderer();
    this.onAfterResize(this.size);
  }

  #updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#adjustFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.#updateWorldSize();
  }

  #adjustFov(aspect: number) {
    const tanFov = Math.tan(MathUtils.degToRad(this.cameraFov / 2));
    const newTan = tanFov / (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(newTan));
  }

  #updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const fovRad = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }
  }

  #updateRenderer() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pr = window.devicePixelRatio;
    if (this.maxPixelRatio && pr > this.maxPixelRatio) pr = this.maxPixelRatio;
    else if (this.minPixelRatio && pr < this.minPixelRatio) pr = this.minPixelRatio;
    this.renderer.setPixelRatio(pr);
    this.size.pixelRatio = pr;
  }

  #onIntersection(entries: IntersectionObserverEntry[]) {
    this.#isAnimating = entries[0].isIntersecting;
    if (this.#isAnimating) this.#startAnimation();
    else this.#stopAnimation();
  }

  #onVisibilityChange() {
    if (this.#isAnimating) {
      if (document.hidden) this.#stopAnimation();
      else this.#startAnimation();
    }
  }

  #startAnimation() {
    if (this.#isVisible) return;
    const animateFrame = () => {
      this.#animationFrameId = requestAnimationFrame(animateFrame);
      this.#animationState.delta = this.#clock.getDelta();
      this.#animationState.elapsed += this.#animationState.delta;
      this.onBeforeRender(this.#animationState);
      this.render();
      this.onAfterRender(this.#animationState);
    };
    this.#isVisible = true;
    this.#clock.start();
    animateFrame();
  }

  #stopAnimation() {
    if (this.#isVisible) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#isVisible = false;
      this.#clock.stop();
    }
  }

  #render() {
    this.renderer.render(this.scene, this.camera);
  }

  #clear() {
    this.scene.traverse((obj: any) => {
      if (obj.isMesh && typeof obj.material === "object" && obj.material) {
        Object.keys(obj.material).forEach((key) => {
          const matProp = obj.material[key];
          if (
            matProp &&
            typeof matProp === "object" &&
            typeof matProp.dispose === "function"
          ) {
            matProp.dispose();
          }
        });
        obj.material.dispose?.();
        obj.geometry.dispose?.();
      }
    });
    this.scene.clear();
  }

  dispose() {
    window.removeEventListener("resize", this.#boundResize);
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.#boundVisibilityChange);
    this.#stopAnimation();
    this.#clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.isDisposed = true;
  }
}

interface WConfig {
  count: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  maxSize: number;
  minSize: number;
  size0: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  controlSphere0?: boolean;
  followCursor?: boolean;
}

class W {
  config: WConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center = new Vector3();

  constructor(config: WConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count);
    this.velocityData = new Float32Array(3 * config.count);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center.toArray(this.positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const idx = 3 * i;
      this.positionData[idx] = MathUtils.randFloatSpread(2 * config.maxX);
      this.positionData[idx + 1] = MathUtils.randFloatSpread(2 * config.maxY);
      this.positionData[idx + 2] = MathUtils.randFloatSpread(2 * config.maxZ);
    }
    this.sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      this.sizeData[i] = MathUtils.randFloat(config.minSize, config.maxSize);
    }
  }

  update(deltaInfo: { delta: number }) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIdx = 0;
    if (config.controlSphere0) {
      startIdx = 1;
      const firstVec = new Vector3().fromArray(positionData, 0);
      firstVec.lerp(center, 0.1).toArray(positionData, 0);
      new Vector3(0, 0, 0).toArray(velocityData, 0);
    }
    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      const pos = new Vector3().fromArray(positionData, base);
      const vel = new Vector3().fromArray(velocityData, base);
      vel.y -= deltaInfo.delta * config.gravity * sizeData[idx];
      vel.multiplyScalar(config.friction);
      vel.clampLength(0, config.maxVelocity);
      pos.add(vel);
      pos.toArray(positionData, base);
      vel.toArray(velocityData, base);
    }
    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      const pos = new Vector3().fromArray(positionData, base);
      const vel = new Vector3().fromArray(velocityData, base);
      const radius = sizeData[idx];
      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        const otherPos = new Vector3().fromArray(positionData, otherBase);
        const otherVel = new Vector3().fromArray(velocityData, otherBase);
        const diff = new Vector3().copy(otherPos).sub(pos);
        const dist = diff.length();
        const sumRadius = radius + sizeData[jdx];
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          const correction = diff.normalize().multiplyScalar(0.5 * overlap);
          const velCorrection = correction
            .clone()
            .multiplyScalar(Math.max(vel.length(), 1));
          pos.sub(correction);
          vel.sub(velCorrection);
          pos.toArray(positionData, base);
          vel.toArray(velocityData, base);
          otherPos.add(correction);
          otherVel.add(correction.clone().multiplyScalar(Math.max(otherVel.length(), 1)));
          otherPos.toArray(positionData, otherBase);
          otherVel.toArray(velocityData, otherBase);
        }
      }
      if (config.controlSphere0) {
        const diff = new Vector3()
          .copy(new Vector3().fromArray(positionData, 0))
          .sub(pos);
        const d = diff.length();
        const sumRadius0 = radius + sizeData[0];
        if (d < sumRadius0) {
          const correction = diff.normalize().multiplyScalar(sumRadius0 - d);
          const velCorrection = correction
            .clone()
            .multiplyScalar(Math.max(vel.length(), 2));
          pos.sub(correction);
          vel.sub(velCorrection);
        }
      }
      if (Math.abs(pos.x) + radius > config.maxX) {
        pos.x = Math.sign(pos.x) * (config.maxX - radius);
        vel.x = -vel.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(pos.y) + radius > config.maxY) {
          pos.y = Math.sign(pos.y) * (config.maxY - radius);
          vel.y = -vel.y * config.wallBounce;
        }
      } else if (pos.y - radius < -config.maxY) {
        pos.y = -config.maxY + radius;
        vel.y = -vel.y * config.wallBounce;
      }
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(pos.z) + radius > maxBoundary) {
        pos.z = Math.sign(pos.z) * (config.maxZ - radius);
        vel.z = -vel.z * config.wallBounce;
      }
      pos.toArray(positionData, base);
      vel.toArray(velocityData, base);
    }
  }
}

class Y extends MeshPhysicalMaterial {
  uniforms: { [key: string]: { value: any } };
  constructor(params: any) {
    super(params);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };
    this.defines = { USE_UV: "" };
    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
        ` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
        `,
      );
      const lightsChunk = ShaderChunk.lights_fragment_begin.replaceAll(
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",
        `
          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
        `,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <lights_fragment_begin>",
        lightsChunk,
      );
    };
  }
}

const defaultConfig = {
  count: 200,
  // Upstream ships [0, 0, 0] as a placeholder — invisible balls on a dark
  // canvas. Default to a colorful palette so out-of-the-box use is visible.
  colors: [0xff5733, 0x33c1ff, 0xa0e6a3, 0xf2a900],
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
};

const U = new Object3D();

class Z extends InstancedMesh {
  config: typeof defaultConfig;
  physics: W;
  ambientLight!: AmbientLight;
  light!: PointLight;

  constructor(renderer: WebGLRenderer, params: Partial<typeof defaultConfig> = {}) {
    const config = { ...defaultConfig, ...params };
    const roomEnv = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(roomEnv).texture;
    const geometry = new SphereGeometry();
    const material = new Y({ envMap: envTexture, ...config.materialParams });
    material.envMapRotation.x = -Math.PI / 2;
    super(geometry, material, config.count);
    this.config = config;
    this.physics = new W(config);
    this.ambientLight = new AmbientLight(config.ambientColor, config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(config.colors[0], config.lightIntensity);
    this.add(this.light);
    this.setColors(config.colors);
  }

  setColors(colors: number[]) {
    if (!Array.isArray(colors) || colors.length < 2) return;
    const colorObjects = colors.map((c) => new Color(c));
    const getColorAt = (ratio: number, out = new Color()) => {
      const t = Math.max(0, Math.min(1, ratio));
      const scaled = t * (colors.length - 1);
      const idx = Math.floor(scaled);
      const start = colorObjects[idx];
      if (idx >= colors.length - 1) return start.clone();
      const alpha = scaled - idx;
      const end = colorObjects[idx + 1];
      out.r = start.r + alpha * (end.r - start.r);
      out.g = start.g + alpha * (end.g - start.g);
      out.b = start.b + alpha * (end.b - start.b);
      return out;
    };
    for (let i = 0; i < this.count; i++) {
      this.setColorAt(i, getColorAt(i / this.count));
      if (i === 0) this.light.color.copy(getColorAt(0));
    }
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }

  update(deltaInfo: { delta: number }) {
    this.physics.update(deltaInfo);
    for (let i = 0; i < this.count; i++) {
      U.position.fromArray(this.physics.positionData, 3 * i);
      if (i === 0 && this.config.followCursor === false) {
        U.scale.setScalar(0);
      } else {
        U.scale.setScalar(this.physics.sizeData[i]);
      }
      U.updateMatrix();
      this.setMatrixAt(i, U.matrix);
      if (i === 0) this.light.position.copy(U.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

interface CreateBallpitReturn {
  three: X;
  spheres: Z;
  dispose: () => void;
}

function createBallpit(
  canvas: HTMLCanvasElement,
  config: Partial<typeof defaultConfig> & { followCursor?: boolean } = {},
): CreateBallpitReturn {
  const threeInstance = new X({
    canvas,
    size: "parent",
    rendererOptions: { antialias: true, alpha: true },
  });
  threeInstance.renderer.toneMapping = ACESFilmicToneMapping;
  threeInstance.camera.position.set(0, 0, 20);
  threeInstance.camera.lookAt(0, 0, 0);
  threeInstance.cameraMaxAspect = 1.5;
  threeInstance.resize();
  const spheres = new Z(threeInstance.renderer, config);
  threeInstance.scene.add(spheres);

  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersectionPoint = new Vector3();
  const pointer = new Vector2();

  canvas.style.touchAction = "none";
  canvas.style.userSelect = "none";

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, threeInstance.camera);
    threeInstance.camera.getWorldDirection(plane.normal);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    spheres.physics.center.copy(intersectionPoint);
    spheres.config.controlSphere0 = true;
  };
  const onPointerLeave = () => {
    spheres.config.controlSphere0 = false;
  };
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);

  threeInstance.onBeforeRender = (deltaInfo) => spheres.update(deltaInfo);
  threeInstance.onAfterResize = (size) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };
  // Trigger a resize once spheres exist so initial maxX/maxY get applied.
  threeInstance.resize();

  return {
    three: threeInstance,
    spheres,
    dispose() {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      threeInstance.dispose();
    },
  };
}

export interface BallpitProps {
  className?: string;
  count?: number;
  colors?: number[];
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  maxVelocity?: number;
  maxX?: number;
  maxY?: number;
  maxZ?: number;
  controlSphere0?: boolean;
  followCursor?: boolean;
}

export function Ballpit({
  className,
  followCursor = true,
  ...props
}: Readonly<BallpitProps>) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const instanceRef = React.useRef<CreateBallpitReturn | null>(null);

  // Snapshot props for the effect (intentionally empty-deps init).
  const initialPropsRef = React.useRef({ followCursor, ...props });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    instanceRef.current = createBallpit(canvas, initialPropsRef.current);
    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className ?? ""}`} />;
}
