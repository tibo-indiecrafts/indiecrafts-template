"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- Port of Juan Fuentes' "ASCIIText" three.js demo. The internal AsciiFilter/CanvasTxt/CanvAscii classes carry heterogeneous DOM/THREE types; pinning each `any` would balloon the file with no runtime benefit. */

import * as React from "react";
import * as THREE from "three";

const VERT = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;
    float waveFactor = uEnableWaves;
    vec3 transformed = position;
    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const FRAG = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

const DEFAULT_CHARSET =
  " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

function map(n: number, s1: number, e1: number, s2: number, e2: number) {
  return ((n - s1) / (e1 - s1)) * (e2 - s2) + s2;
}

class AsciiFilter {
  renderer: THREE.WebGLRenderer;
  domElement: HTMLDivElement;
  pre: HTMLPreElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  deg = 0;
  invert: boolean;
  fontSize: number;
  fontFamily: string;
  charset: string;
  pxRatio: number;
  width = 0;
  height = 0;
  center = { x: 0, y: 0 };
  mouse = { x: 0, y: 0 };
  cols = 0;
  rows = 0;

  constructor(
    renderer: THREE.WebGLRenderer,
    opts: { fontSize?: number; fontFamily?: string; charset?: string; invert?: boolean },
  ) {
    this.renderer = renderer;
    this.pxRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    this.domElement = document.createElement("div");
    this.domElement.style.position = "absolute";
    this.domElement.style.inset = "0";
    this.pre = document.createElement("pre");
    this.domElement.appendChild(this.pre);
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.domElement.appendChild(this.canvas);

    this.invert = opts.invert ?? true;
    this.fontSize = opts.fontSize ?? 12;
    this.fontFamily = opts.fontFamily ?? "'Courier New', monospace";
    this.charset = opts.charset ?? DEFAULT_CHARSET;
    if (this.context) this.context.imageSmoothingEnabled = false;

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener("mousemove", this.onMouseMove);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();
    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    if (!this.context) return;
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText("A").width;
    this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));
    this.rows = Math.floor(this.height / this.fontSize);
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    Object.assign(this.pre.style, {
      fontFamily: this.fontFamily,
      fontSize: `${this.fontSize}px`,
      margin: "0",
      padding: "0",
      lineHeight: "1em",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: "9",
      backgroundAttachment: "fixed",
      mixBlendMode: "difference",
    });
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
    if (!this.context) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
      this.asciify(this.context, w, h);
      this.hue();
    }
  }

  onMouseMove(e: MouseEvent) {
    this.mouse = { x: e.clientX * this.pxRatio, y: e.clientY * this.pxRatio };
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }
  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (!w || !h) return;
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let str = "";
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x * 4 + y * 4 * w;
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const a = imgData[i + 3];
        if (a === 0) {
          str += " ";
          continue;
        }
        const gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
        let idx = Math.floor((1 - gray) * (this.charset.length - 1));
        if (this.invert) idx = this.charset.length - idx - 1;
        str += this.charset[idx];
      }
      str += "\n";
    }
    this.pre.innerHTML = str;
  }

  dispose() {
    document.removeEventListener("mousemove", this.onMouseMove);
  }
}

class CanvasTxt {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  txt: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  font: string;

  constructor(
    txt: string,
    opts: { fontSize?: number; fontFamily?: string; color?: string },
  ) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.txt = txt;
    this.fontSize = opts.fontSize ?? 200;
    this.fontFamily = opts.fontFamily ?? "Arial";
    this.color = opts.color ?? "#fdf9f3";
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    if (!this.context) return;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    this.canvas.width = Math.ceil(metrics.width) + 20;
    this.canvas.height =
      Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;
  }

  render() {
    if (!this.context) return;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    this.context.fillText(this.txt, 10, 10 + metrics.actualBoundingBoxAscent);
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  get texture() {
    return this.canvas;
  }
}

interface CanvAsciiOptions {
  text: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor: string;
  planeBaseHeight: number;
  enableWaves: boolean;
}

class CanvAscii {
  options: CanvAsciiOptions;
  container: HTMLElement;
  width: number;
  height: number;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  mouse = { x: 0, y: 0 };
  textCanvas!: CanvasTxt;
  texture!: THREE.CanvasTexture;
  geometry!: THREE.PlaneGeometry;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  renderer!: THREE.WebGLRenderer;
  filter!: AsciiFilter;
  center = { x: 0, y: 0 };
  animationFrameId = 0;

  constructor(
    options: CanvAsciiOptions,
    container: HTMLElement,
    width: number,
    height: number,
  ) {
    this.options = options;
    this.container = container;
    this.width = width;
    this.height = height;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();
    this.mouse = { x: width / 2, y: height / 2 };
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  async init() {
    try {
      await document.fonts.load('600 200px "IBM Plex Mono"');
      await document.fonts.load('500 12px "IBM Plex Mono"');
    } catch {
      /* font loading is best-effort */
    }
    await document.fonts.ready;
    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    const { text, textFontSize, textColor, planeBaseHeight, enableWaves } = this.options;
    this.textCanvas = new CanvasTxt(text, {
      fontSize: textFontSize,
      fontFamily: "IBM Plex Mono",
      color: textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;

    const textAspect = this.textCanvas.width / this.textCanvas.height;
    const planeW = planeBaseHeight * textAspect;
    const planeH = planeBaseHeight;

    this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: enableWaves ? 1.0 : 0.0 },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: "IBM Plex Mono",
      fontSize: this.options.asciiFontSize,
      invert: true,
    });
    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("touchmove", this.onMouseMove);
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.filter.setSize(w, h);
    this.center = { x: w / 2, y: h / 2 };
  }

  load() {
    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      this.render();
    };
    animateFrame();
  }

  onMouseMove(evt: MouseEvent | TouchEvent) {
    const e = "touches" in evt ? (evt as TouchEvent).touches[0] : (evt as MouseEvent);
    const bounds = this.container.getBoundingClientRect();
    this.mouse = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  }

  render() {
    const time = performance.now() * 0.001;
    this.textCanvas.render();
    this.texture.needsUpdate = true;
    this.material.uniforms.uTime.value = Math.sin(time);
    const x = map(this.mouse.y, 0, this.height, 0.5, -0.5);
    const y = map(this.mouse.x, 0, this.width, -0.5, 0.5);
    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
    this.filter.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    this.filter?.dispose();
    if (this.filter?.domElement.parentNode === this.container) {
      this.container.removeChild(this.filter.domElement);
    }
    this.container.removeEventListener("mousemove", this.onMouseMove);
    this.container.removeEventListener("touchmove", this.onMouseMove);
    this.scene.traverse((object) => {
      const obj = object as any;
      if (!obj.isMesh) return;
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of materials) m?.dispose?.();
      obj.geometry?.dispose?.();
    });
    this.scene.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
  }
}

export interface ASCIITextProps {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
  className?: string;
}

export function ASCIIText({
  text = "Hey!",
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = "#fdf9f3",
  planeBaseHeight = 8,
  enableWaves = true,
  className,
}: Readonly<ASCIITextProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const optsRef = React.useRef({
    text,
    asciiFontSize,
    textFontSize,
    textColor,
    planeBaseHeight,
    enableWaves,
  });
  React.useLayoutEffect(() => {
    optsRef.current = {
      text,
      asciiFontSize,
      textFontSize,
      textColor,
      planeBaseHeight,
      enableWaves,
    };
  });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let instance: CanvAscii | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;

    const createAndStart = async (w: number, h: number) => {
      const inst = new CanvAscii(optsRef.current, container, w, h);
      await inst.init();
      if (cancelled) {
        inst.dispose();
        return;
      }
      inst.load();
      instance = inst;
      ro = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) instance?.setSize(width, height);
      });
      ro.observe(container);
    };

    const setup = async () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) {
        io = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (
              entry.isIntersecting &&
              entry.boundingClientRect.width > 0 &&
              entry.boundingClientRect.height > 0
            ) {
              io?.disconnect();
              io = null;
              if (!cancelled) {
                void createAndStart(
                  entry.boundingClientRect.width,
                  entry.boundingClientRect.height,
                );
              }
            }
          },
          { threshold: 0.1 },
        );
        io.observe(container);
      } else {
        await createAndStart(width, height);
      }
    };

    void setup();

    return () => {
      cancelled = true;
      io?.disconnect();
      ro?.disconnect();
      instance?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ascii-text-container absolute inset-0 ${className ?? ""}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap');
        .ascii-text-container canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          image-rendering: pixelated;
        }
        .ascii-text-container pre {
          margin: 0;
          user-select: none;
          padding: 0;
          line-height: 1em;
          text-align: left;
          position: absolute;
          left: 0;
          top: 0;
          background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);
          background-attachment: fixed;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          z-index: 9;
          mix-blend-mode: difference;
        }
      `}</style>
    </div>
  );
}
