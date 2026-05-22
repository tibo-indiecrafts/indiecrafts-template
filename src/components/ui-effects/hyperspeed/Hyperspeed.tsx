"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- Port of the lewislepton "Hyperspeed" three.js demo. The internal App/Road/CarLights/LightsSticks classes carry heterogeneous THREE uniform bags; pinning every type would balloon the file without runtime benefit. */

import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";
import * as React from "react";
import * as THREE from "three";

interface Distortion {
  uniforms: Record<string, { value: any }>;
  getDistortion: string;
  getJS?: (progress: number, time: number) => THREE.Vector3;
}

interface Colors {
  roadColor: number;
  islandColor: number;
  background: number;
  shoulderLines: number;
  brokenLines: number;
  leftCars: number[];
  rightCars: number[];
  sticks: number | number[];
}

export interface HyperspeedOptions {
  onSpeedUp?: (ev: MouseEvent | TouchEvent) => void;
  onSlowDown?: (ev: MouseEvent | TouchEvent) => void;
  distortion?: string | Distortion;
  length: number;
  roadWidth: number;
  islandWidth: number;
  lanesPerRoad: number;
  fov: number;
  fovSpeedUp: number;
  speedUp: number;
  carLightsFade: number;
  totalSideLightSticks: number;
  lightPairsPerRoadWay: number;
  shoulderLinesWidthPercentage: number;
  brokenLinesWidthPercentage: number;
  brokenLinesLengthPercentage: number;
  lightStickWidth: [number, number];
  lightStickHeight: [number, number];
  movingAwaySpeed: [number, number];
  movingCloserSpeed: [number, number];
  carLightsLength: [number, number];
  carLightsRadius: [number, number];
  carWidthPercentage: [number, number];
  carShiftX: [number, number];
  carFloorSeparation: [number, number];
  colors: Colors;
}

export interface HyperspeedProps {
  effectOptions?: Partial<HyperspeedOptions>;
}

const defaultOptions: HyperspeedOptions = {
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3,
  },
};

const nsin = (v: number) => Math.sin(v) * 0.5 + 0.5;

const turbulentUniforms = {
  uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
  uAmp: { value: new THREE.Vector4(25, 5, 10, 10) },
};

const distortions: Record<string, Distortion> = {
  turbulentDistortion: {
    uniforms: turbulentUniforms,
    getDistortion: `
      uniform vec4 uFreq; uniform vec4 uAmp;
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (cos(PI * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.) * uAmp.g);
      }
      float getDistortionY(float progress){
        return (-nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a);
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.0125),
          getDistortionY(progress) - getDistortionY(0.0125),
          0.);
      }
    `,
    getJS: (progress, time) => {
      const uFreq = turbulentUniforms.uFreq.value;
      const uAmp = turbulentUniforms.uAmp.value;
      const getX = (p: number) =>
        Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
        Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) *
          uAmp.y;
      const getY = (p: number) =>
        -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
        Math.pow(nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w;
      const distortion = new THREE.Vector3(
        getX(progress) - getX(progress + 0.007),
        getY(progress) - getY(progress + 0.007),
        0,
      );
      return distortion
        .multiply(new THREE.Vector3(-2, -5, 0))
        .add(new THREE.Vector3(0, 0, -10));
    },
  },
};

const random = (base: number | [number, number]) =>
  Array.isArray(base)
    ? Math.random() * (base[1] - base[0]) + base[0]
    : Math.random() * base;
const pickRandom = <T,>(arr: T | T[]): T =>
  Array.isArray(arr) ? arr[Math.floor(Math.random() * arr.length)] : arr;
const lerp = (cur: number, tgt: number, speed = 0.1, limit = 0.001) => {
  let change = (tgt - cur) * speed;
  if (Math.abs(change) < limit) change = tgt - cur;
  return change;
};

const carLightsFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  varying vec3 vColor; varying vec2 vUv; uniform vec2 uFade;
  void main() {
    vec3 color = vec3(vColor);
    float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const carLightsVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  attribute vec3 aOffset; attribute vec3 aMetrics; attribute vec3 aColor;
  uniform float uTravelLength; uniform float uTime;
  varying vec2 vUv; varying vec3 vColor;
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;
    transformed.xy *= radius;
    transformed.z *= myLength;
    transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;
    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    vColor = aColor;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

const sideSticksVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  attribute float aOffset; attribute vec3 aColor; attribute vec2 aMetrics;
  uniform float uTravelLength; uniform float uTime;
  varying vec3 vColor;
  mat4 rotationY(in float angle) {
    return mat4(cos(angle), 0, sin(angle), 0, 0, 1.0, 0, 0, -sin(angle), 0, cos(angle), 0, 0, 0, 0, 1);
  }
  #include <getDistortion_vertex>
  void main(){
    vec3 transformed = position.xyz;
    float width = aMetrics.x;
    float height = aMetrics.y;
    transformed.xy *= vec2(width, height);
    float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);
    transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
    transformed.z += -uTravelLength + time;
    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);
    transformed.y += height / 2.;
    transformed.x += -width / 2.;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

const sideSticksFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  varying vec3 vColor;
  void main(){
    gl_FragColor = vec4(vec3(vColor), 1.);
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const roadBaseFragment = `
  #define USE_FOG;
  varying vec2 vUv; uniform vec3 uColor; uniform float uTime;
  #include <roadMarkings_vars>
  ${THREE.ShaderChunk["fog_pars_fragment"]}
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uColor);
    #include <roadMarkings_fragment>
    gl_FragColor = vec4(color, 1.);
    ${THREE.ShaderChunk["fog_fragment"]}
  }
`;

const islandFragment = roadBaseFragment
  .replace("#include <roadMarkings_fragment>", "")
  .replace("#include <roadMarkings_vars>", "");

const roadMarkings_vars = `
  uniform float uLanes;
  uniform vec3 uBrokenLinesColor;
  uniform vec3 uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage;
  uniform float uBrokenLinesWidthPercentage;
  uniform float uBrokenLinesLengthPercentage;
`;

const roadMarkings_fragment = `
  uv.y = mod(uv.y + uTime * 0.05, 1.);
  float laneWidth = 1.0 / uLanes;
  float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
  float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;
  float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
  float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
  brokenLines = mix(brokenLines, sideLines, uv.x);
`;

const roadFragment = roadBaseFragment
  .replace("#include <roadMarkings_fragment>", roadMarkings_fragment)
  .replace("#include <roadMarkings_vars>", roadMarkings_vars);

const roadVertex = `
  #define USE_FOG;
  uniform float uTime;
  ${THREE.ShaderChunk["fog_pars_vertex"]}
  uniform float uTravelLength;
  varying vec2 vUv;
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    transformed.y += -1. * distortion.z;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${THREE.ShaderChunk["fog_vertex"]}
  }
`;

class CarLights {
  webgl: App;
  options: HyperspeedOptions;
  colors: number[] | number;
  speed: [number, number];
  fade: THREE.Vector2;
  mesh!: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;
  constructor(
    webgl: App,
    options: HyperspeedOptions,
    colors: number[] | number,
    speed: [number, number],
    fade: THREE.Vector2,
  ) {
    this.webgl = webgl;
    this.options = options;
    this.colors = colors;
    this.speed = speed;
    this.fade = fade;
  }
  init() {
    const options = this.options;
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    );
    const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
    const instanced = new THREE.InstancedBufferGeometry().copy(
      geometry as any,
    ) as THREE.InstancedBufferGeometry;
    instanced.instanceCount = options.lightPairsPerRoadWay * 2;
    const laneWidth = options.roadWidth / options.lanesPerRoad;
    const aOffset: number[] = [];
    const aMetrics: number[] = [];
    const aColor: number[] = [];
    const colorArr = Array.isArray(this.colors)
      ? this.colors.map((c) => new THREE.Color(c))
      : [new THREE.Color(this.colors)];
    for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
      const radius = random(options.carLightsRadius);
      const length = random(options.carLightsLength);
      const spd = random(this.speed);
      const carLane = i % options.lanesPerRoad;
      let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;
      const carWidth = random(options.carWidthPercentage) * laneWidth;
      const carShiftX = random(options.carShiftX) * laneWidth;
      laneX += carShiftX;
      const offsetY = random(options.carFloorSeparation) + radius * 1.3;
      const offsetZ = -random(options.length);
      aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
      aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);
      aMetrics.push(radius, length, spd);
      aMetrics.push(radius, length, spd);
      const color = pickRandom<THREE.Color>(colorArr);
      aColor.push(color.r, color.g, color.b);
      aColor.push(color.r, color.g, color.b);
    }
    instanced.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false),
    );
    instanced.setAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false),
    );
    instanced.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false),
    );
    const material = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex,
      transparent: true,
      uniforms: Object.assign(
        {
          uTime: { value: 0 },
          uTravelLength: { value: options.length },
          uFade: { value: this.fade },
        },
        this.webgl.fogUniforms,
        (typeof options.distortion === "object" ? options.distortion.uniforms : {}) || {},
      ),
    });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        typeof this.options.distortion === "object"
          ? this.options.distortion.getDistortion
          : "",
      );
    };
    const mesh = new THREE.Mesh(instanced, material);
    mesh.frustumCulled = false;
    this.webgl.scene.add(mesh);
    this.mesh = mesh;
  }
  update(time: number) {
    if (this.mesh.material.uniforms.uTime) {
      this.mesh.material.uniforms.uTime.value = time;
    }
  }
}

class LightsSticks {
  webgl: App;
  options: HyperspeedOptions;
  mesh!: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;
  constructor(webgl: App, options: HyperspeedOptions) {
    this.webgl = webgl;
    this.options = options;
  }
  init() {
    const options = this.options;
    const geometry = new THREE.PlaneGeometry(1, 1);
    const instanced = new THREE.InstancedBufferGeometry().copy(
      geometry as any,
    ) as THREE.InstancedBufferGeometry;
    const totalSticks = options.totalSideLightSticks;
    instanced.instanceCount = totalSticks;
    const stickoffset = options.length / (totalSticks - 1);
    const aOffset: number[] = [];
    const aColor: number[] = [];
    const aMetrics: number[] = [];
    const colorArr = Array.isArray(options.colors.sticks)
      ? options.colors.sticks.map((c) => new THREE.Color(c))
      : [new THREE.Color(options.colors.sticks)];
    for (let i = 0; i < totalSticks; i++) {
      const width = random(options.lightStickWidth);
      const height = random(options.lightStickHeight);
      aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random());
      const color = pickRandom<THREE.Color>(colorArr);
      aColor.push(color.r, color.g, color.b);
      aMetrics.push(width, height);
    }
    instanced.setAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false),
    );
    instanced.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false),
    );
    instanced.setAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false),
    );
    const material = new THREE.ShaderMaterial({
      fragmentShader: sideSticksFragment,
      vertexShader: sideSticksVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(
        { uTravelLength: { value: options.length }, uTime: { value: 0 } },
        this.webgl.fogUniforms,
        (typeof options.distortion === "object" ? options.distortion.uniforms : {}) || {},
      ),
    });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        typeof this.options.distortion === "object"
          ? this.options.distortion.getDistortion
          : "",
      );
    };
    const mesh = new THREE.Mesh(instanced, material);
    mesh.frustumCulled = false;
    this.webgl.scene.add(mesh);
    this.mesh = mesh;
  }
  update(time: number) {
    if (this.mesh.material.uniforms.uTime) {
      this.mesh.material.uniforms.uTime.value = time;
    }
  }
}

class Road {
  webgl: App;
  options: HyperspeedOptions;
  uTime = { value: 0 };
  constructor(webgl: App, options: HyperspeedOptions) {
    this.webgl = webgl;
    this.options = options;
  }
  createPlane(side: number, isRoad: boolean) {
    const options = this.options;
    const geometry = new THREE.PlaneGeometry(
      isRoad ? options.roadWidth : options.islandWidth,
      options.length,
      20,
      100,
    );
    let uniforms: Record<string, { value: any }> = {
      uTravelLength: { value: options.length },
      uColor: {
        value: new THREE.Color(
          isRoad ? options.colors.roadColor : options.colors.islandColor,
        ),
      },
      uTime: this.uTime,
    };
    if (isRoad) {
      uniforms = Object.assign(uniforms, {
        uLanes: { value: options.lanesPerRoad },
        uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
        uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
        uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
        uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
        uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage },
      });
    }
    const material = new THREE.ShaderMaterial({
      fragmentShader: isRoad ? roadFragment : islandFragment,
      vertexShader: roadVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(
        uniforms,
        this.webgl.fogUniforms,
        (typeof options.distortion === "object" ? options.distortion.uniforms : {}) || {},
      ),
    });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        typeof this.options.distortion === "object"
          ? this.options.distortion.getDistortion
          : "",
      );
    };
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = -options.length / 2;
    mesh.position.x += (options.islandWidth / 2 + options.roadWidth / 2) * side;
    this.webgl.scene.add(mesh);
    return mesh;
  }
  init() {
    this.createPlane(-1, true);
    this.createPlane(1, true);
    this.createPlane(0, false);
  }
  update(time: number) {
    this.uTime.value = time;
  }
}

class App {
  container: HTMLElement;
  options: HyperspeedOptions;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  clock = new THREE.Clock();
  disposed = false;
  road: Road;
  leftCarLights: CarLights;
  rightCarLights: CarLights;
  leftSticks: LightsSticks;
  fogUniforms: Record<string, { value: any }>;
  fovTarget: number;
  speedUpTarget = 0;
  speedUp = 0;
  timeOffset = 0;
  hasValidSize = false;
  private _tick: () => void;
  private _onResize: () => void;
  private _onMouseDown: (e: MouseEvent) => void;
  private _onMouseUp: (e: MouseEvent) => void;
  private _onTouchStart: (e: TouchEvent) => void;
  private _onTouchEnd: (e: TouchEvent) => void;
  private _onContextMenu: (e: MouseEvent) => void;

  constructor(container: HTMLElement, options: HyperspeedOptions) {
    this.container = container;
    this.options = options;
    const initW = Math.max(1, container.offsetWidth);
    const initH = Math.max(1, container.offsetHeight);

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setSize(initW, initH, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.composer = new EffectComposer(this.renderer);
    // Force the canvas to fill the container — three.js leaves an inline
    // canvas which clips the bottom of the scene in fullscreen demos.
    const canvas = this.renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    this.camera = new THREE.PerspectiveCamera(options.fov, initW / initH, 0.1, 10000);
    this.camera.position.set(0, 8, -5);
    this.scene = new THREE.Scene();
    this.scene.background = null;
    const fog = new THREE.Fog(
      options.colors.background,
      options.length * 0.2,
      options.length * 500,
    );
    this.scene.fog = fog;
    this.fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far },
    };

    this.road = new Road(this, options);
    this.leftCarLights = new CarLights(
      this,
      options,
      options.colors.leftCars,
      options.movingAwaySpeed,
      new THREE.Vector2(0, 1 - options.carLightsFade),
    );
    this.rightCarLights = new CarLights(
      this,
      options,
      options.colors.rightCars,
      options.movingCloserSpeed,
      new THREE.Vector2(1, 0 + options.carLightsFade),
    );
    this.leftSticks = new LightsSticks(this, options);
    this.fovTarget = options.fov;

    this._tick = this.tick.bind(this);
    this._onResize = this.onWindowResize.bind(this);
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onTouchStart = this.onTouchStart.bind(this);
    this._onTouchEnd = this.onTouchEnd.bind(this);
    this._onContextMenu = (e) => e.preventDefault();

    window.addEventListener("resize", this._onResize);
    if (initW > 0 && initH > 0) this.hasValidSize = true;
  }

  onWindowResize() {
    const w = this.container.offsetWidth;
    const h = this.container.offsetHeight;
    if (w <= 0 || h <= 0) {
      this.hasValidSize = false;
      return;
    }
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.composer.setSize(w, h);
    this.hasValidSize = true;
  }

  initPasses() {
    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomPass = new EffectPass(
      this.camera,
      new BloomEffect({
        luminanceThreshold: 0.2,
        luminanceSmoothing: 0,
        resolutionScale: 1,
      }),
    );
    const smaaPass = new EffectPass(
      this.camera,
      new SMAAEffect({ preset: SMAAPreset.MEDIUM }),
    );
    renderPass.renderToScreen = false;
    bloomPass.renderToScreen = false;
    smaaPass.renderToScreen = true;
    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);
    this.composer.addPass(smaaPass);
  }

  loadAssets() {
    return new Promise<void>((resolve) => {
      const manager = new THREE.LoadingManager(resolve);
      const s = new Image();
      const a = new Image();
      s.addEventListener("load", () => manager.itemEnd("smaa-search"));
      a.addEventListener("load", () => manager.itemEnd("smaa-area"));
      manager.itemStart("smaa-search");
      manager.itemStart("smaa-area");
      s.src = SMAAEffect.searchImageDataURL;
      a.src = SMAAEffect.areaImageDataURL;
    });
  }

  init() {
    this.initPasses();
    const o = this.options;
    this.road.init();
    this.leftCarLights.init();
    this.leftCarLights.mesh.position.setX(-o.roadWidth / 2 - o.islandWidth / 2);
    this.rightCarLights.init();
    this.rightCarLights.mesh.position.setX(o.roadWidth / 2 + o.islandWidth / 2);
    this.leftSticks.init();
    this.leftSticks.mesh.position.setX(-(o.roadWidth + o.islandWidth / 2));

    this.container.addEventListener("mousedown", this._onMouseDown);
    this.container.addEventListener("mouseup", this._onMouseUp);
    this.container.addEventListener("mouseout", this._onMouseUp);
    this.container.addEventListener("touchstart", this._onTouchStart, { passive: true });
    this.container.addEventListener("touchend", this._onTouchEnd, { passive: true });
    this.container.addEventListener("touchcancel", this._onTouchEnd, { passive: true });
    this.container.addEventListener("contextmenu", this._onContextMenu);

    this._tick();
  }

  onMouseDown(ev: MouseEvent) {
    this.options.onSpeedUp?.(ev);
    this.fovTarget = this.options.fovSpeedUp;
    this.speedUpTarget = this.options.speedUp;
  }
  onMouseUp(ev: MouseEvent) {
    this.options.onSlowDown?.(ev);
    this.fovTarget = this.options.fov;
    this.speedUpTarget = 0;
  }
  onTouchStart(ev: TouchEvent) {
    this.options.onSpeedUp?.(ev);
    this.fovTarget = this.options.fovSpeedUp;
    this.speedUpTarget = this.options.speedUp;
  }
  onTouchEnd(ev: TouchEvent) {
    this.options.onSlowDown?.(ev);
    this.fovTarget = this.options.fov;
    this.speedUpTarget = 0;
  }

  update(delta: number) {
    const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
    this.speedUp += lerp(this.speedUp, this.speedUpTarget, lerpPercentage, 0.00001);
    this.timeOffset += this.speedUp * delta;
    const time = this.clock.elapsedTime + this.timeOffset;

    this.rightCarLights.update(time);
    this.leftCarLights.update(time);
    this.leftSticks.update(time);
    this.road.update(time);

    let updateCamera = false;
    const fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
    if (fovChange !== 0) {
      this.camera.fov += fovChange * delta * 6;
      updateCamera = true;
    }

    if (typeof this.options.distortion === "object" && this.options.distortion.getJS) {
      const distortion = this.options.distortion.getJS(0.025, time);
      this.camera.lookAt(
        new THREE.Vector3(
          this.camera.position.x + distortion.x,
          this.camera.position.y + distortion.y,
          this.camera.position.z + distortion.z,
        ),
      );
      updateCamera = true;
    }
    if (updateCamera) this.camera.updateProjectionMatrix();
  }

  tick() {
    if (this.disposed) return;
    if (!this.hasValidSize) {
      const w = this.container.offsetWidth;
      const h = this.container.offsetHeight;
      if (w > 0 && h > 0) {
        this.renderer.setSize(w, h, false);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.composer.setSize(w, h);
        this.hasValidSize = true;
      } else {
        requestAnimationFrame(this._tick);
        return;
      }
    }
    const canvas = this.renderer.domElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      this.composer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    const delta = this.clock.getDelta();
    this.composer.render(delta);
    this.update(delta);
    requestAnimationFrame(this._tick);
  }

  dispose() {
    this.disposed = true;
    this.scene.traverse((obj) => {
      const mesh = obj as unknown as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[];
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.composer.dispose();
    window.removeEventListener("resize", this._onResize);
    this.container.removeEventListener("mousedown", this._onMouseDown);
    this.container.removeEventListener("mouseup", this._onMouseUp);
    this.container.removeEventListener("mouseout", this._onMouseUp);
    this.container.removeEventListener("touchstart", this._onTouchStart);
    this.container.removeEventListener("touchend", this._onTouchEnd);
    this.container.removeEventListener("touchcancel", this._onTouchEnd);
    this.container.removeEventListener("contextmenu", this._onContextMenu);
  }
}

const DEFAULT_EFFECT: Partial<HyperspeedOptions> = {};

export function Hyperspeed({
  effectOptions = DEFAULT_EFFECT,
}: Readonly<HyperspeedProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options: HyperspeedOptions = {
      ...defaultOptions,
      ...effectOptions,
      colors: { ...defaultOptions.colors, ...effectOptions.colors },
    };
    if (typeof options.distortion === "string") {
      options.distortion =
        distortions[options.distortion] ?? distortions.turbulentDistortion;
    }

    const app = new App(container, options);
    app.loadAssets().then(() => app.init());

    return () => app.dispose();
  }, [effectOptions]);

  return <div ref={containerRef} className="relative h-full w-full overflow-hidden" />;
}
